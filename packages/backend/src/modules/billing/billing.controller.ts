import { Controller, Post, Get, Req, Res, Body, UseGuards, Headers, RawBodyRequest, InternalServerErrorException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { UsersService } from '../../modules/users/users.service';
import Stripe from 'stripe';

@Controller('billing')
export class BillingController {
  constructor(
    private billingService: BillingService,
    private configService: ConfigService,
    private stripeService: StripeService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req) {
    const session = await this.billingService.createCheckoutSession(req.user.id);
    return { url: session.url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-billing-portal-session')
  async createBillingPortalSession(@Req() req) {
    const session = await this.billingService.createBillingPortalSession(req.user.id);
    return { url: session.url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel-subscription')
  async cancelSubscription(@Req() req) {
    const subscription = await this.billingService.cancelSubscription(req.user.id);
    return { subscription };
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscription-status')
  async getSubscriptionStatus(@Req() req) {
    return this.billingService.getSubscriptionStatus(req.user.id);
  }

  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    const rawBody = req.rawBody;
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    try {
      const event = this.stripeService.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      try {
        console.log("🚀 ~ BillingController ~ event.type:", event.type)
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`🚀 ~ BillingController ~ Processing ${event.type} for customer ${subscription.customer}`);
            const user = await this.usersService.findByStripeCustomerId(subscription.customer as string);
            await this.usersService.updateSubscriptionStatus(
              user.id,
              subscription.status === 'active',
              subscription.id,
            );
            console.log(`🚀 ~ BillingController ~ Successfully updated subscription status for user ${user.id}`);
            break;
            
          case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object as Stripe.Subscription;
            console.log(`🚀 ~ BillingController ~ Processing subscription deletion for customer ${deletedSubscription.customer}`);
            const userToDelete = await this.usersService.findByStripeCustomerId(deletedSubscription.customer as string);
            await this.usersService.updateSubscriptionStatus(
              userToDelete.id,
              false,
              null,
            );
            console.log(`🚀 ~ BillingController ~ Successfully marked subscription as inactive for user ${userToDelete.id}`);
            break;
            
          case 'invoice.payment_succeeded':
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.subscription) {
              console.log(`🚀 ~ BillingController ~ Processing successful payment for customer ${invoice.customer}`);
              const userWithSuccess = await this.usersService.findByStripeCustomerId(invoice.customer as string);
              await this.usersService.updateSubscriptionStatus(
                userWithSuccess.id,
                true,
                invoice.subscription as string,
              );
              console.log(`🚀 ~ BillingController ~ Successfully updated subscription status for user ${userWithSuccess.id}`);
            } else {
              console.log('🚀 ~ BillingController ~ Skipping invoice without subscription');
            }
            break;
            
          case 'invoice.payment_failed':
            const failedInvoice = event.data.object as Stripe.Invoice;
            if (failedInvoice.subscription) {
              console.log(`🚀 ~ BillingController ~ Processing failed payment for customer ${failedInvoice.customer}`);
              const userWithFailure = await this.usersService.findByStripeCustomerId(failedInvoice.customer as string);
              await this.usersService.updateSubscriptionStatus(
                userWithFailure.id,
                false,
                failedInvoice.subscription as string,
              );
              console.log(`🚀 ~ BillingController ~ Marked subscription as inactive for user ${userWithFailure.id}`);
            } else {
              console.log('🚀 ~ BillingController ~ Skipping invoice without subscription');
            }
            break;
            
          default:
            console.log(`🚀 ~ BillingController ~ Unhandled event type: ${event.type}`);
        }
      } catch (error) {
        console.error('🚀 ~ BillingController ~ Error processing webhook:', error);
        throw new InternalServerErrorException(`Failed to process webhook: ${error.message}`);
      }

      res.status(200).send({ received: true });
    } catch (err) {
      // Log in catch is still useful, but the one above is more immediate
      console.log('🚀 ~ BillingController ~ Type of req.body in webhook catch:', typeof req.body, Buffer.isBuffer(req.body)); 
      
      if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Signature Error: ${err.message}`);
        return;
      }
      
      console.error('Webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
} 