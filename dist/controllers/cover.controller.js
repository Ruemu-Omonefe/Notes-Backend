"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoverDesigns = void 0;
const cloudinary_config_1 = require("../configs/cloudinary.config");
const getCoverDesigns = async (req, res) => {
    try {
        const covers = await (0, cloudinary_config_1.getCoverDesign)();
        res.json({ covers });
    }
    catch (error) {
        console.error("Failed to fetch cover designs:", error);
        res.status(500).json({ error: "Failed to load cover designs" });
    }
};
exports.getCoverDesigns = getCoverDesigns;
