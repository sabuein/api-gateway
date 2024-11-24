// /src/validations/eventValidation.mjs
import Joi from "joi";

const eventSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
});

export default eventSchema;