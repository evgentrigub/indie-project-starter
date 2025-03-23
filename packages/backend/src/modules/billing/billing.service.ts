import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe(configService.get('stripe.secretKey'), {
      apiVersion: '2022-08-01',
    });
  }

  async createCheckoutSession(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    // If the user already has an active subscription, don't allow creating a new one
    if (user.hasActiveSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId,
        },
      });
      
      customerId = customer.id;
      await this.usersService.updateStripeCustomerId(userId, customerId);
    }
    
    // Create the checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.configService.get('stripe.priceId'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('frontend.url')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('frontend.url')}/billing/cancel`,
      metadata: {
        userId,
      },
    });
    
    return { checkoutUrl: session.url };
  }

  async cancelSubscription(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.hasActiveSubscription || !user.stripeSubscriptionId) {
      throw new BadRequestException('User does not have an active subscription');
    }
    
    // Cancel the subscription at period end
    await this.stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    
    // Update user subscription status
    // Note: The webhook handler will also update this when Stripe processes the cancelation
    await this.usersService.updateSubscriptionStatus(userId, false);
    
    return { message: 'Subscription has been scheduled for cancellation' };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('stripe.webhookSecret');
    
    let event: Stripe.Event;
    
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
    
    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription as string;
        
        await this.usersService.updateSubscriptionStatus(userId, true, subscriptionId);
        break;
      }
        
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        
        await this.usersService.updateSubscriptionStatus(userId, false, null);
        break;
      }
    }
    
    return { received: true };
  }
} 