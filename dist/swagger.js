"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const specs = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        swaggerOptions: {
            docExpansion: 'none', // Collapse all endpoints by default
        },
    }));
};
exports.setupSwagger = setupSwagger;
