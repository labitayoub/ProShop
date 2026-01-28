import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    Req
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Multer storage config to keep extensions and avoid conflicts
const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
});

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getAll() {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.productsService.getProductById(id);
    }

    // Create a product requires Auth + Multipart form data handling
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'previewImage', maxCount: 1 },
                { name: 'digitalFile', maxCount: 1 },
            ],
            { storage },
        ),
    )
    async create(
        @Req() req,
        @Body() body: { title: string; description?: string; price: string; category: string },
        @UploadedFiles() files: { previewImage?: Express.Multer.File[]; digitalFile?: Express.Multer.File[] },
    ) {
        const sellerId = req.user.sub; // From Jwt token

        const previewUrl = files.previewImage
            ? `${process.env.API_URL || 'http://localhost:3001'}/uploads/${files.previewImage[0].filename}`
            : '';

        const fileKey = files.digitalFile
            ? files.digitalFile[0].filename
            : '';

        return this.productsService.createProduct({
            title: body.title,
            description: body.description,
            price: parseFloat(body.price),
            category: body.category,
            previewUrl,
            fileKey, // Represents the real file name locally
            sellerId,
        });
    }
}
