import Joi from "joi";

export const validator = (schema, payload) =>
    schema.validate(payload, { abortEarly: false }
);

export const newUser = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    repeat_password: Joi.ref("password"),
});