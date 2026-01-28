import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(data: {
        title: string;
        description?: string;
        price: number;
        category: string;
        previewUrl: string;
        fileKey: string;
        sellerId: string;
    }): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async getAllProducts(): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: { active: true },
            include: { seller: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { seller: { select: { name: true } } },
        });

        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        return product;
    }
}
