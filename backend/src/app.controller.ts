import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PropertyDto } from './dto/propertyDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("property")
  addProperty(@Body() data: PropertyDto) {
    return this.appService.addProperty(data);
  }

  @Get("property")
  getAllProperties() {
    return this.appService.getAllProperties();
  }

  @Get("property/:id")
  getPropertyById(id: number) {
    return this.appService.getPropertyById(id);
  }

  @Patch("property/:id")
  updateProperty(id: number, @Body() data: PropertyDto) {
    return this.appService.updateProperty(id, data);
  }

  @Delete("property/:id")
  deleteProperty(id: number) {
    return this.appService.deleteProperty(id);
  }
}
