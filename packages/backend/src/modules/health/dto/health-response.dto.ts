import { ApiProperty } from '@nestjs/swagger';

export class MemoryInfo {
  @ApiProperty({ description: 'Memory used in MB', example: 45 })
  used: number;

  @ApiProperty({ description: 'Total memory in MB', example: 128 })
  total: number;

  @ApiProperty({ description: 'Memory usage percentage', example: 35 })
  percentage: number;
}

export class SystemInfo {
  @ApiProperty({ description: 'Memory usage information', type: MemoryInfo })
  memory: MemoryInfo;

  @ApiProperty({ description: 'Process ID', example: 12345 })
  pid: number;
}

export class ServicesInfo {
  @ApiProperty({ description: 'Database connection status', enum: ['UP', 'DOWN'], example: 'UP' })
  database: 'UP' | 'DOWN';
}

export class HealthResponse {
  @ApiProperty({ description: 'Overall health status', enum: ['OK', 'ERROR'], example: 'OK' })
  status: 'OK' | 'ERROR';

  @ApiProperty({ description: 'Timestamp when health check was performed', example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Application uptime in seconds', example: 3600 })
  uptime: number;

  @ApiProperty({ description: 'Application version', example: '1.0.0' })
  version: string;

  @ApiProperty({ description: 'Current environment', example: 'development' })
  environment: string;

  @ApiProperty({ description: 'External services status', type: ServicesInfo })
  services: ServicesInfo;

  @ApiProperty({ description: 'System resource information', type: SystemInfo })
  system: SystemInfo;
}
