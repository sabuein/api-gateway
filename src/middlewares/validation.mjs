// /src/middlewares/validation.mjs
import Joi from "joi";

// Middleware to validate incoming data against a schema to prevent invalid data from reaching the controllers
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        next(); // Pass control to the next middleware or route handler
    };
};

export default validate;