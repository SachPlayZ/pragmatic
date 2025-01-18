import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PropertyComparisonDto, PropertyDto } from './dto/propertyDto';

interface Context {
  role: string;
  content: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('property')
  addProperty(@Body() data: PropertyDto) {
    return this.appService.addProperty(data);
  }

  @Post('getComparison')
  getComparison(@Body() data: {properties: PropertyComparisonDto[]}) {
    return this.appService.getComparison(data.properties);
  }

  @Post('getAnswer')
  getAnswer(@Body() data: { query: string; context?: Context[] }) {
    return this.appService.getAnswer(data);
  }

  @Post('getDescription')
  getDescription(@Body() data: PropertyDto) {
    return this.appService.getDescription(data);
  }

  @Get('property')
  getAllProperties() {
    return this.appService.getAllProperties();
  }

  @Get('property/:id')
  getPropertyById(id: number) {
    return this.appService.getPropertyById(id);
  }

  @Patch('property/:id')
  updateProperty(id: number, @Body() data: PropertyDto) {
    return this.appService.updateProperty(id, data);
  }

  @Delete('property/:id')
  deleteProperty(id: number) {
    return this.appService.deleteProperty(id);
  }

  @Get('property/:owner')
  getPropertyByOwner(owner: string) {
    return this.appService.getPropertyByOwner(owner);
  }
}
