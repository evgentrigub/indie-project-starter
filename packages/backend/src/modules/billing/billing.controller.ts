import { Controller, Post, Get, Req, Res, Body, UseGuards, Headers } from '@nestjs/common';
import { Response } from 'express';
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
    @Body() body: Buffer,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    try {
      const event = this.stripeService.constructEvent(
        body,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          await this.usersService.updateSubscriptionStatus(
            subscription.customer as string,
            subscription.status === 'active',
            subscription.id,
          );
          break;
          
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription;
          await this.usersService.updateSubscriptionStatus(
            deletedSubscription.customer as string,
            false,
            null,
          );
          break;
          
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            await this.usersService.updateSubscriptionStatus(
              invoice.customer as string,
              true,
              invoice.subscription as string,
            );
          }
          break;
          
        case 'invoice.payment_failed':
          const failedInvoice = event.data.object as Stripe.Invoice;
          if (failedInvoice.subscription) {
            await this.usersService.updateSubscriptionStatus(
              failedInvoice.customer as string,
              false,
              failedInvoice.subscription as string,
            );
          }
          break;
      }

      res.status(200).send({ received: true });
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
} 