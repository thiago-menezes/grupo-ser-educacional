"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productListMock = {
    name: 'Search products',
    path: '/products/search',
    method: 'get',
    tags: ['products'],
    description: 'Search products by name, category, or description with pagination',
    parameters: [
        {
            name: 'q',
            location: 'query',
            required: false,
            type: 'string',
            description: 'Search query',
            example: 'coffee',
        },
        {
            name: 'category',
            location: 'query',
            required: false,
            type: 'string',
            description: 'Filter by category',
            example: 'coffee',
        },
        {
            name: 'minPrice',
            location: 'query',
            required: false,
            type: 'number',
            description: 'Minimum price filter',
            example: 10,
        },
        {
            name: 'page',
            location: 'query',
            required: false,
            type: 'integer',
            description: 'Page number (default: 1)',
            example: 1,
        },
        {
            name: 'limit',
            location: 'query',
            required: false,
            type: 'integer',
            description: 'Items per page (default: 20, max: 100)',
            example: 20,
        },
    ],
    responses: [
        {
            statusCode: 200,
            description: 'Search results with pagination',
            schema: {
                type: 'object',
                properties: {
                    results: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'prod_001' },
                                name: { type: 'string', example: 'Premium Coffee Beans' },
                                price: {
                                    type: 'number',
                                    format: 'float',
                                    minimum: 0,
                                    example: 24.99,
                                },
                                description: {
                                    type: 'string',
                                    example: 'Single origin coffee beans from Brazil',
                                },
                                category: { type: 'string', example: 'coffee' },
                                inStock: { type: 'boolean', example: true },
                                rating: {
                                    type: 'number',
                                    format: 'float',
                                    minimum: 0,
                                    maximum: 5,
                                    example: 4.8,
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string', format: 'uri' },
                                    example: ['/images/coffee-brazil.jpg'],
                                },
                                tags: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['single-origin', 'premium'],
                                },
                            },
                            required: [
                                'id',
                                'name',
                                'price',
                                'description',
                                'category',
                                'inStock',
                                'rating',
                            ],
                        },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    totalPages: { type: 'integer' },
                },
            },
            example: {
                results: [
                    {
                        id: 'prod_123',
                        name: 'Premium Coffee Beans',
                        price: 24.99,
                        category: 'coffee',
                        rating: 4.8,
                    },
                ],
                total: 15,
                page: 1,
                totalPages: 1,
            },
        },
        {
            statusCode: 400,
            description: 'Invalid search parameters',
        },
    ],
};
exports.default = productListMock;
