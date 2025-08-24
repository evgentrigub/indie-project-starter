import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthResponse, MemoryInfo, SystemInfo, ServicesInfo } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Get the health status of the application
   * @returns HealthResponse
   */
  async getHealthStatus(): Promise<HealthResponse> {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();
    
    const memory: MemoryInfo = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    };

    const system: SystemInfo = {
      memory,
      pid: process.pid,
    };

    const services: ServicesInfo = {
      database: await this.checkDatabaseHealth(),
    };

    // Determine overall health status based on critical services
    const overallStatus = services.database === 'DOWN' ? 'ERROR' : 'OK';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptimeSeconds),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      system,
    };
  }

  /**
   * Check database connectivity by performing a simple query
   * @returns Promise<'UP' | 'DOWN'>
   */
  private async checkDatabaseHealth(): Promise<'UP' | 'DOWN'> {
    try {
      // Perform a simple query to test database connectivity
      await this.dataSource.query('SELECT 1');
      return 'UP';
    } catch (error) {
      console.error('Database health check failed:', error);
      return 'DOWN';
    }
  }
}
