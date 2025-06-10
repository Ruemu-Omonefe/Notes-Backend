"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
exports.getUserById = getUserById;
const user_model_1 = __importDefault(require("../models/user.model"));
// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find({}, '-password'); // exclude password
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};
exports.getAllUsers = getAllUsers;
`         `;
function getUserById(req, res) {
    const id = req.params.id;
    user_model_1.default.findById(id, '-password').then((user) => {
        res.status(200).send(JSON.stringify(user));
    }).catch((err) => {
        res.status(404).send(err.message);
    });
}
