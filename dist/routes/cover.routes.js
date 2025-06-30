"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/cover.routes.ts
const express_1 = __importDefault(require("express"));
const cover_controller_1 = require("../controllers/cover.controller");
const router = express_1.default.Router();
router.get("/", cover_controller_1.getCoverDesigns);
exports.default = router;
