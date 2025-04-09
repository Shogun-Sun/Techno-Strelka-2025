import { Controller, Get, Param } from '@nestjs/common';
import { T2apiService } from './t2api.service';

@Controller('t2api')
export class T2apiController {
  constructor(private readonly t2apiService: T2apiService) {}

  @Get('/offices')
  gelALlOffices() {
    return this.t2apiService.getAllOffices();
  }

  @Get('/offices:filter')
  gelALlOfficesFilter(@Param('filter') filter: string) {
    return this.t2apiService.gelALlOfficesFilter(filter);
  }
}
