import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponse } from './dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check the health of the application' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application is healthy', 
    type: HealthResponse 
  })
  async getHealth(): Promise<HealthResponse> {
    return await this.healthService.getHealthStatus();
  }
}
