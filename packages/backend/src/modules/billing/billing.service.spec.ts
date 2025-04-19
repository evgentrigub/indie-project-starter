import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthProvider } from '../users/entities/user.entity';
import Stripe from 'stripe';

describe('BillingService', () => {
  let service: BillingService;
  let stripeService: StripeService;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    provider: AuthProvider.LOCAL,
    hasActiveSubscription: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createMockUser = (overrides: Partial<User> = {}): User => {
    const user = JSON.parse(JSON.stringify(mockUser));
    return { ...user, ...overrides } as User;
  };

  const mockStripeCustomer = {
    id: 'cus_123',
    object: 'customer',
    balance: 0,
    created: Date.now(),
    default_source: null,
    email: 'test@example.com',
    livemode: false,
    metadata: {},
  } as unknown as Stripe.Customer;

  const mockStripeSession = {
    id: 'sess_123',
    object: 'checkout.session',
    after_expiration: null,
    allow_promotion_codes: null,
    amount_subtotal: null,
    amount_total: null,
    automatic_tax: { enabled: false, status: null },
    billing_address_collection: null,
    cancel_url: null,
    client_reference_id: null,
    consent: null,
    consent_collection: null,
    created: Date.now(),
    currency: null,
    customer: null,
    customer_creation: null,
    customer_details: null,
    customer_email: null,
    expires_at: null,
    livemode: false,
    locale: null,
    metadata: {},
    mode: null,
    payment_intent: null,
    payment_link: null,
    payment_method_collection: null,
    payment_method_options: null,
    payment_method_types: null,
    payment_status: 'unpaid',
    phone_number_collection: { enabled: false },
    recovered_from: null,
    setup_intent: null,
    shipping: null,
    shipping_address_collection: null,
    shipping_options: null,
    shipping_rate: null,
    status: 'open',
    submit_type: null,
    subscription: null,
    success_url: null,
    total_details: null,
    url: null,
  } as unknown as Stripe.Checkout.Session;

  const mockStripeBillingPortalSession = {
    id: 'sess_123',
    object: 'billing_portal.session',
    configuration: null,
    created: Date.now(),
    customer: 'cus_123',
    livemode: false,
    locale: null,
    on_behalf_of: null,
    return_url: null,
    url: 'https://billing.stripe.com/session/test',
  } as unknown as Stripe.BillingPortal.Session;

  const mockStripeSubscription = {
    id: 'sub_123',
    object: 'subscription',
    application: null,
    application_fee_percent: null,
    automatic_tax: { enabled: false },
    billing_cycle_anchor: Date.now(),
    billing_thresholds: null,
    cancel_at: null,
    cancel_at_period_end: false,
    canceled_at: null,
    collection_method: 'charge_automatically',
    created: Date.now(),
    currency: 'usd',
    current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,
    current_period_start: Date.now(),
    customer: 'cus_123',
    days_until_due: null,
    default_payment_method: null,
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    ended_at: null,
    items: {
      object: 'list',
      data: [],
      has_more: false,
      url: '',
    },
    latest_invoice: null,
    livemode: false,
    metadata: {},
    next_pending_invoice_item_invoice: null,
    on_behalf_of: null,
    pause_collection: null,
    payment_settings: null,
    pending_invoice_item_interval: null,
    pending_setup_intent: null,
    pending_update: null,
    schedule: null,
    start_date: Date.now(),
    status: 'active',
    transfer_data: null,
    trial_end: null,
    trial_start: null,
  } as unknown as Stripe.Subscription;

  const mockStripeSubscriptionList = {
    object: 'list',
    data: [mockStripeSubscription],
    has_more: false,
    url: '',
  } as unknown as Stripe.ApiList<Stripe.Subscription>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: StripeService,
          useValue: {
            createCustomer: jest.fn(),
            createCheckoutSession: jest.fn(),
            createBillingPortalSession: jest.fn(),
            listSubscriptions: jest.fn(),
            cancelSubscription: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            updateStripeCustomerId: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'FRONTEND_URL':
                  return 'http://localhost:3000';
                case 'STRIPE_PRICE_ID':
                  return 'price_123';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    stripeService = module.get<StripeService>(StripeService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session for existing customer', async () => {
      const userWithCustomer = createMockUser({ stripeCustomerId: 'cus_123' });
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithCustomer);
      jest.spyOn(stripeService, 'createCheckoutSession').mockResolvedValue(mockStripeSession);

      const result = await service.createCheckoutSession('1');
      expect(result).toEqual(mockStripeSession);
      expect(stripeService.createCustomer).not.toHaveBeenCalled();
    });

    it('should create customer and checkout session for new customer', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(stripeService, 'createCustomer').mockResolvedValue(mockStripeCustomer);
      jest.spyOn(usersService, 'updateStripeCustomerId').mockResolvedValue(undefined);
      jest.spyOn(stripeService, 'createCheckoutSession').mockResolvedValue(mockStripeSession);

      const result = await service.createCheckoutSession('1');
      expect(result).toEqual(mockStripeSession);
      expect(stripeService.createCustomer).toHaveBeenCalledWith(mockUser.email);
      expect(usersService.updateStripeCustomerId).toHaveBeenCalledWith('1', 'cus_123');
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.createCheckoutSession('1'))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('createBillingPortalSession', () => {
    it('should create billing portal session', async () => {
      const userWithCustomer = createMockUser({ stripeCustomerId: 'cus_123' });
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithCustomer);
      jest.spyOn(stripeService, 'createBillingPortalSession').mockResolvedValue(mockStripeBillingPortalSession);

      const result = await service.createBillingPortalSession('1');
      expect(result).toEqual(mockStripeBillingPortalSession);
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.createBillingPortalSession('1'))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error if user has no Stripe customer ID', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      await expect(service.createBillingPortalSession('1'))
        .rejects
        .toThrow('User does not have a Stripe customer ID');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription', async () => {
      const userWithCustomer = createMockUser({ stripeCustomerId: 'cus_123' });
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithCustomer);
      jest.spyOn(stripeService, 'listSubscriptions').mockResolvedValue(mockStripeSubscriptionList);
      jest.spyOn(stripeService, 'cancelSubscription').mockResolvedValue(mockStripeSubscription);

      const result = await service.cancelSubscription('1');
      expect(result).toEqual(mockStripeSubscription);
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.cancelSubscription('1'))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error if user has no Stripe customer ID', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      await expect(service.cancelSubscription('1'))
        .rejects
        .toThrow('User does not have a Stripe customer ID');
    });

    it('should throw error if no active subscription found', async () => {
      const userWithCustomer = createMockUser({ stripeCustomerId: 'cus_123' });
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithCustomer);
      jest.spyOn(stripeService, 'listSubscriptions').mockResolvedValue({
        ...mockStripeSubscriptionList,
        data: [],
      });

      await expect(service.cancelSubscription('1'))
        .rejects
        .toThrow('No active subscription found');
    });
  });

  describe('getSubscriptionStatus', () => {
    it('should return subscription status for user with active subscription', async () => {
      const userWithCustomer = createMockUser({ stripeCustomerId: 'cus_123' });
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithCustomer);
      jest.spyOn(stripeService, 'listSubscriptions').mockResolvedValue(mockStripeSubscriptionList);

      const result = await service.getSubscriptionStatus('1');
      expect(result).toEqual({
        hasActiveSubscription: true,
        subscriptions: [mockStripeSubscription],
      });
    });

    it('should return subscription status for user with no Stripe customer ID', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await service.getSubscriptionStatus('1');
      expect(result).toEqual({
        hasActiveSubscription: false,
      });
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.getSubscriptionStatus('1'))
        .rejects
        .toThrow('User not found');
    });
  });
}); 