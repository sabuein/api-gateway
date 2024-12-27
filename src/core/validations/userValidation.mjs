// /src/validations/userValidation.mjs
import Joi from "joi";

const userLoginSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

const userRegisterSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export {
    userLoginSchema,
    userRegisterSchema
};