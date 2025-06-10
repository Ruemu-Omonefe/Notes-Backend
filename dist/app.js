"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
require("./configs/passport.config"); // Ensure passport strategies are loaded
const passport_1 = __importDefault(require("passport"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// Routes
app.get("/", (req, res) => {
    res.send("Hello, welcome to our book app!");
});
app.use('/api/auth', auth_routes_1.default); // Authentication routes
app.use('/api/users', auth_middleware_1.protect, user_routes_1.default); // User management routes
app.use('/api/notes', auth_middleware_1.protect, note_routes_1.default); // Note management routes
// Error handling middleware
app.use(error_middleware_1.default);
exports.default = app;
