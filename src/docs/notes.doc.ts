/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management operations
 */

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     description: Returns a single note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note data
 *       404:
 *         description: Note not found
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     description: Creates a new note for the authenticated user
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               userId:
 *                 type: string
 *               numberOfPages:
 *                 type: integer
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     type:
 *                      type: string
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         altText:
 *                           type: string
 *                         duration:
 *                           type: number
 *                         size:
 *                           type: number
 *                         width:
 *                           type: number
 *                         height:
 *                           type: number
 *               isFavorite:
 *                 type: boolean
 *               isShared:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/notes:
 *   put:
 *     summary: Update an existing note
 *     description: Updates an existing note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               userId:
 *                 type: string
 *               coverDesign:
 *                 type: string
 *               numberOfPages:
 *                 type: integer
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         altText:
 *                           type: string
 *                         duration:
 *                           type: number
 *                         size:
 *                           type: number
 *                         width:
 *                           type: number
 *                         height:
 *                           type: number
 *               isFavorite:
 *                 type: boolean
 *               isShared:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Note not found
 */

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */

/**
 * @swagger
 * /api/notes/user/{userId}:
 *   get:
 *     summary: Get all notes for a user
 *     description: Returns a list of all notes for a specific user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notes for the user
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/notes/{noteId}/share:
 *   post:
 *     summary: Share a note
 *     description: Shares a note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note shared successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/notes/shared/{sharedId}:
 *   get:
 *     summary: Get shared note by ID
 *     description: Returns a single shared note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: sharedId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shared Note ID
 *     responses:
 *       200:
 *         description: Shared note data
 *       404:
 *         description: Shared note not found
 */