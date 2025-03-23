import { Controller, Post, Get, Req, Res, Body, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { ConfigService } from '@nestjs/config';

@Controller('billing')
export class BillingController {
  constructor(
    private billingService: BillingService,
    private configService: ConfigService,
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
  async webhook(@Body() body, @Req() req, @Res() res: Response) {
    // Implement webhook handling here
    // This would handle events like payment_succeeded, payment_failed, etc.
    // We'd typically update the user's subscription status in our database
    
    res.status(200).send({ received: true });
  }
} 