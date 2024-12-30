"use strict";

// /src/validations/postValidation.mjs
import Joi from "joi";

const postSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
});

const newPostSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
});

export { postSchema, newPostSchema };