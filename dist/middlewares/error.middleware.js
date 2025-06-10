"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    console.error(err.stack);
    console.error('err', err);
    console.error('err message', err.message);
    res.status(500).json({ message: 'Something went wrong!' });
};
