"use strict";
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
/**
* @swagger
* /api/users/{id}:
*   get:
*     summary: Get a user by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the user to retrieve
*         schema:
*           type: string
*     responses:
*       200:
*         description: User details
*       404:
*         description: User not found
*       500:
*         description: Server error
*/
