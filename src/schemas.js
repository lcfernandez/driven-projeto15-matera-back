import joi from "joi";

export const validator = (schema, payload) =>
    schema.validate(payload, { abortEarly: false });

export const newUser = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    repeat_password: joi.ref("password")
});

export const user = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

export const product = joi.object({
    name: joi.string().min(1).required(),
    price: joi.string().min(2).required(),
    date: joi.string().required(),
    image: joi.string().required(),
    type: joi.valid("sofa", "cadeira", "mesa", "cama").required(),
});

export const card = joi.object({
    number: joi.string().min(16).max(16).required(),
    name: joi.string().min(3).required(),
    code: joi.string().min(3).max(3).required(),
    expiration: joi.string().min(5).max(5).required(),
});