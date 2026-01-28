import { Controller, Post, Get, Param, UseGuards, Req, Res, Header } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';
import { StreamableFile } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('buy/:productId')
    async buyProduct(@Param('productId') productId: string, @Req() req) {
        const userId = req.user.sub;
        return this.ordersService.buyProduct(userId, productId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('purchases')
    async getUserPurchases(@Req() req) {
        const userId = req.user.sub;
        return this.ordersService.getUserPurchases(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('download/:productId')
    @Header('Content-Type', 'application/octet-stream')
    async downloadProduct(
        @Param('productId') productId: string,
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ): Promise<StreamableFile> {
        const userId = req.user.sub;
        const streamableFile = await this.ordersService.getDownloadStream(userId, productId);

        // Suggest the original filename to the browser
        const filename = `product-${productId}-download.zip`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        return streamableFile;
    }
}
