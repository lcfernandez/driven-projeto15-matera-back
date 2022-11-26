import { validator } from "./schemas.js";

export const collections = db => (req, _res, next) => {
    const users = db.collection("users");
    const sessions = db.collection("sessions");
    const purchases = db.collection("purchases");
    const products = db.collection("products");
    const cards = db.collection("cards");
    const adresses = db.collection("adresses");

    req.collections = {
        users,
        sessions,
        purchases,
        products,
        cards,
        adresses,
    };

    next();
};

export const validate = schema => (req, res, next) => {
    const payload = req.body;
    const { error } = validator(schema, payload);

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send({
            message: "Unprocessable Entity",
            errors,
        });
    }

    next();
};

export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    const session = await req.collections.sessions.findOne({ token });
    const user = await req.collections.users.findOne({ _id: session?.userId });

    if (!user) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    delete user.password;

    req.user = user;

    return next();
};

export const asyncError = handlerFn => async (req, res, next) => {
    try {
        await handlerFn(req, res, next);
    } catch (err) {
        console.warn(err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};