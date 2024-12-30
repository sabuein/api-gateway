"use strict";

// /src/validations/userValidation.mjs
import Joi from "joi";

const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

const newUserSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export { userSchema, newUserSchema };