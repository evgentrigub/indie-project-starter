import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class BillingService {
  constructor(
    private stripeService: StripeService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async createCheckoutSession(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a Stripe customer ID
    if (!user.stripeCustomerId) {
      const customer = await this.stripeService.createCustomer(user.email, user.name || user.email);
      await this.usersService.updateStripeCustomerId(user.id, customer.id);
      user.stripeCustomerId = customer.id;
    }

    // Create checkout session
    const session = await this.stripeService.createCheckoutSession(
      user.stripeCustomerId,
      this.configService.get<string>('FRONTEND_URL') + '/billing/success',
      this.configService.get<string>('FRONTEND_URL') + '/billing/cancel',
      this.configService.get<string>('STRIPE_PRICE_ID'),
    );

    return session;
  }

  async createBillingPortalSession(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID');
    }

    const session = await this.stripeService.createBillingPortalSession(
      user.stripeCustomerId,
      this.configService.get<string>('FRONTEND_URL') + '/billing',
    );

    return session;
  }

  async cancelSubscription(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID');
    }

    // Get subscription ID
    const subscriptions = await this.stripeService.listSubscriptions(user.stripeCustomerId);
    if (!subscriptions.data.length) {
      throw new Error('No active subscription found');
    }

    // Cancel the subscription
    const subscription = await this.stripeService.cancelSubscription(subscriptions.data[0].id);
    return subscription;
  }

  async getSubscriptionStatus(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      return { hasActiveSubscription: false };
    }

    // Get subscription status
    const subscriptions = await this.stripeService.listSubscriptions(user.stripeCustomerId);
    const hasActiveSubscription = subscriptions.data.some(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    return {
      hasActiveSubscription,
      subscriptions: subscriptions.data,
    };
  }
} 