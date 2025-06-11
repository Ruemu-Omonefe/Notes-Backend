import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Rainbow Notes API',
    version: '1.0.0',
    description: 'API documentation for Rainbow Notes App',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
    {
      url: 'https://notes-backend-gwye.onrender.com',
    },
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/docs/*.ts', './src/routes/*.ts', './src/controllers/*.ts'], // path to your route files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        docExpansion: 'none', // Collapse all endpoints by default
      },
    })
  );
};
