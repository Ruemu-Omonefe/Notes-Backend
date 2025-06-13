/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */


/**
 * @swagger
 * paths:
 *   /api/auth/register:
 *     post:
 *       summary: Register a new user
 *       description: This endpoint allows users to register by providing their email and password.
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         201:
 *           description: User registered successfully
 *         400:
 *           description: Bad request
 */

/**
 * @swagger
 * paths:
 *   /api/auth/login:
 *     post:
 *       summary: Login a user
 *       description: This endpoint allows users to log in by providing their email and password.
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         200:
 *           description: User logged in successfully
 *         401:
 *           description: Unauthorized
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: This endpoint retrieves the currently authenticated user's information.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 */
