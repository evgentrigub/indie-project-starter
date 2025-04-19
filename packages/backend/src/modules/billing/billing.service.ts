import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';
import Stripe from 'stripe';

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
      const customer = await this.stripeService.createCustomer(user.email);
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

  async createBillingPortalSession(userId: string): Promise<Stripe.BillingPortal.Session> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID');
    }

    const returnUrl = this.configService.get<string>('FRONTEND_URL') + '/billing';
    const session = await this.stripeService.createBillingPortalSession(user.stripeCustomerId, returnUrl);
    if (!session) {
      throw new Error('Failed to create billing portal session');
    }
    return session;
  }

  async cancelSubscription(userId: string): Promise<Stripe.Subscription> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID');
    }

    const subscriptions = await this.stripeService.listSubscriptions(user.stripeCustomerId);
    if (!subscriptions?.data?.length) {
      throw new Error('No active subscription found');
    }

    const activeSubscription = subscriptions.data[0];
    const canceledSubscription = await this.stripeService.cancelSubscription(activeSubscription.id);
    if (!canceledSubscription) {
      throw new Error('Failed to cancel subscription');
    }
    return canceledSubscription;
  }

  async getSubscriptionStatus(userId: string): Promise<{ hasActiveSubscription: boolean; subscriptions?: Stripe.Subscription[] }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      return { hasActiveSubscription: false };
    }

    const subscriptions = await this.stripeService.listSubscriptions(user.stripeCustomerId);
    if (!subscriptions?.data) {
      return { hasActiveSubscription: false };
    }

    const hasActiveSubscription = subscriptions.data.some(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    return {
      hasActiveSubscription,
      subscriptions: subscriptions.data,
    };
  }
} 