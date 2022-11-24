import joi from "joi";

export const validator = (schema, payload) =>
    schema.validate(payload, { abortEarly: false });

export const product = joi.object({
    name: joi.string().min(1).required(),
    price: joi.string().min(2).required(),
    date: joi.string().required(),
    image: joi.string().required(),
    type: joi.valid("sofa", "cadeira", "mesa", "cama").required(),
});