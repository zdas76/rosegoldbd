"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationRequiest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body
        });
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validationRequiest;
