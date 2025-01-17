import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PropertyComparisonDto, PropertyDto } from './dto/propertyDto';
import { PrismaService } from 'lib/common/database/prisma.service';
import {
  generateAnswers,
  generateComparison,
  generateDescription,
} from 'lib/genAI/gen';

interface Context {
  role: string;
  content: string;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addProperty(data: PropertyDto) {
    try {
      await this.prisma.property.create({
        data: {
          owner: data.owner,
          name: data.name,
          location: data.location,
          price: data.price,
          bedrooms: data.bedrooms,
          sqft: data.sqft,
          imageUrl: data.imageUrl,
          ammenities: data.ammenities,
        },
      });
      return { message: 'Property added successfully', status: 200 };
    } catch (error) {
      console.log('Error creating user:', error);
      throw new HttpException(
        'Failed to Subscribing user, try again or come back later.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAnswer(data: { query: string; context?: Context[] }) {
    const { query, context } = data;
    let cont;
    if (!context) {
      cont = [];
    }
    return {
      answer: await generateAnswers(query, cont),
    };
  }

  async getDescription(data: PropertyDto) {
    return await generateDescription(data);
  }

  async getComparison(data: PropertyComparisonDto[]) {
    return await generateComparison(data);
  }

  async getAllProperties() {
    return await this.prisma.property.findMany();
  }

  async getPropertyById(id: number) {
    return await this.prisma.property.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateProperty(id: number, data: PropertyDto) {
    return await this.prisma.property.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        location: data.location,
        bedrooms: data.bedrooms,
        sqft: data.sqft,
        imageUrl: data.imageUrl,
      },
    });
  }

  async deleteProperty(id: number) {
    return await this.prisma.property.delete({
      where: {
        id: id,
      },
    });
  }
}
