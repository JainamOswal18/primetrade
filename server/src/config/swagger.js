import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Enterprise Node.js SQLite API',
            version: '1.0.0',
            description: 'Scalable REST API with SQLite WAL, Redis, and Docker',
        },
        servers: [
            {
                url: 'http://localhost/api/v1',
                description: 'Production server (via Nginx)'
            },
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/modules/**/*.routes.js'], // Scrape comments from route files
};

export const swaggerSpec = swaggerJsdoc(options);
