import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  /**
   * Create a new Stripe customer
   */
  async createCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
    });
  }

  /**
   * Get a Stripe customer by ID
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    priceId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  /**
   * Create a billing portal session for managing subscriptions
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    return this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * List a customer's subscriptions
   */
  async listSubscriptions(customerId: string): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return this.stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
  }

  /**
   * Verify a webhook signature
   */
  constructEvent(
    payload: Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  /**
   * Get a subscription by ID
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Update a subscription's payment method
   */
  async updateSubscriptionPaymentMethod(
    subscriptionId: string,
    paymentMethodId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId,
    });
  }

  /**
   * List a customer's payment methods
   */
  async listPaymentMethods(customerId: string): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  /**
   * Attach a payment method to a customer
   */
  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  /**
   * Detach a payment method from a customer
   */
  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }
} 