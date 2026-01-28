import { Injectable, NotFoundException, BadRequestException, ForbiddenException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    // Simplified "Buy Now" flow directly marking as COMPLETED without Stripe
    async buyProduct(userId: string, productId: string) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product || !product.active) {
            throw new NotFoundException('Product not found or not available');
        }

        if (product.sellerId === userId) {
            throw new BadRequestException('You cannot buy your own product');
        }

        // Check if user already owns it
        const existingOrder = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: OrderStatus.COMPLETED
                }
            }
        });

        if (existingOrder) {
            throw new BadRequestException('You already own this product');
        }

        // Create the order and items in one transaction
        const order = await this.prisma.order.create({
            data: {
                userId,
                totalAmount: product.price,
                status: OrderStatus.COMPLETED, // Automatically mark completed
                items: {
                    create: {
                        productId: product.id,
                        priceAtPurchase: product.price
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return order;
    }

    // Get all purchases for a user
    async getUserPurchases(userId: string) {
        return this.prisma.order.findMany({
            where: {
                userId,
                status: OrderStatus.COMPLETED,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                previewUrl: true,
                                fileKey: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Securely get the file stream for download
    async getDownloadStream(userId: string, productId: string) {
        // Verify ownership
        const ownership = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: OrderStatus.COMPLETED
                }
            },
            include: {
                product: true
            }
        });

        if (!ownership) {
            throw new ForbiddenException('You do not own this product');
        }

        const fileKey = ownership.product.fileKey;
        if (!fileKey) {
            throw new NotFoundException('Digital file not found for this product');
        }

        const filePath = join(__dirname, '..', '..', 'uploads', fileKey);
        if (!existsSync(filePath)) {
            throw new NotFoundException('File no longer exists on the server');
        }

        const fileStream = createReadStream(filePath);
        return new StreamableFile(fileStream);
    }
}
