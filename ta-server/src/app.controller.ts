import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      ok: true,
      service: 'trust-automobile-api',
      timestamp: new Date().toISOString(),
    };
  }
}
