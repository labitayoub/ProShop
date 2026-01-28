import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
    product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};

describe('ProductsService', () => {
    let service: ProductsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllProducts', () => {
        it('should return an array of active products', async () => {
            const result = [{ id: '1', title: 'Test Product', active: true }];
            // @ts-ignore
            jest.spyOn(prisma.product, 'findMany').mockResolvedValue(result);

            expect(await service.getAllProducts()).toBe(result);
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: { active: true },
                include: { seller: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('getProductById', () => {
        it('should return a product if found', async () => {
            const result = { id: '1', title: 'Found Product' };
            // @ts-ignore
            jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(result);

            expect(await service.getProductById('1')).toBe(result);
        });

        it('should throw NotFoundException if product is not found', async () => {
            jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);

            await expect(service.getProductById('99')).rejects.toThrow(NotFoundException);
        });
    });
});
