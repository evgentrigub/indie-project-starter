import { Controller, Get, Redirect } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  @Redirect('/api/docs', 302)
  redirectToSwagger1(): void { 
    return;
  }

  @Get('api')
  @Redirect('/api/docs', 302)
  redirectToSwagger2(): void {
    return;
  }
}