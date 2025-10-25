"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authEndpoints = [
    {
        name: 'User login',
        path: '/auth/login',
        method: 'post',
        tags: ['authentication'],
        description: 'Authenticate user with email and password',
        requestBody: {
            schema: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com',
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        example: 'password123',
                    },
                },
                required: ['email', 'password'],
            },
            required: true,
        },
        responses: [
            {
                statusCode: 200,
                description: 'Login successful',
                schema: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'user_123' },
                                name: { type: 'string', example: 'John Doe' },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john@example.com',
                                },
                                createdAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-15T10:30:00Z',
                                },
                                updatedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-15T10:30:00Z',
                                },
                            },
                            required: ['id', 'name', 'email'],
                        },
                    },
                },
                example: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    user: {
                        id: 'user_123',
                        email: 'user@example.com',
                        name: 'John Doe',
                    },
                },
            },
            {
                statusCode: 401,
                description: 'Invalid credentials',
            },
            {
                statusCode: 400,
                description: 'Missing required fields',
            },
        ],
    },
    {
        name: 'User registration',
        path: '/auth/register',
        method: 'post',
        tags: ['authentication'],
        description: 'Register a new user account',
        requestBody: {
            schema: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        minLength: 2,
                        example: 'John Doe',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john@example.com',
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        example: 'securepass123',
                    },
                },
                required: ['name', 'email', 'password'],
            },
            required: true,
        },
        responses: [
            {
                statusCode: 201,
                description: 'User registered successfully',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'user_456' },
                        name: { type: 'string', example: 'John Doe' },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00Z',
                        },
                    },
                    required: ['id', 'name', 'email'],
                },
                example: {
                    id: 'user_456',
                    name: 'John Doe',
                    email: 'john@example.com',
                    createdAt: '2024-01-15T10:30:00Z',
                },
            },
            {
                statusCode: 400,
                description: 'Validation error',
            },
            {
                statusCode: 409,
                description: 'Email already exists',
            },
        ],
    },
    {
        name: 'Refresh token',
        path: '/auth/refresh',
        method: 'post',
        tags: ['authentication'],
        description: 'Refresh the access token using a refresh token',
        requestBody: {
            schema: {
                type: 'object',
                properties: {
                    refreshToken: {
                        type: 'string',
                        example: 'refresh_token_here',
                    },
                },
                required: ['refreshToken'],
            },
            required: true,
        },
        responses: [
            {
                statusCode: 200,
                description: 'Token refreshed successfully',
                schema: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            example: 'new_access_token_here',
                        },
                        refreshToken: {
                            type: 'string',
                            example: 'new_refresh_token_here',
                        },
                    },
                },
            },
            {
                statusCode: 401,
                description: 'Invalid refresh token',
            },
        ],
    },
];
exports.default = authEndpoints;
