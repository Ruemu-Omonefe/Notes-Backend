"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI || "";
mongoose_1.default.connect(MONGO_URI).then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Connected to MongoDB at ${MONGO_URI}`);
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.log("uri", MONGO_URI);
    console.error("MongoDB connection error:", err);
});
