import * as handlers from "./handlers.js";
import * as middlewares from "./middlewares.js";
import * as schemas from "./schemas.js";
import express from "express";

export const routes = (app, db) => {
    app.use(middlewares.collections(db));
    app.use(express.static("public"));

    app.post("/sign-up", middlewares.validate(schemas.newUser), middlewares.asyncError(handlers.signUp));
    app.post("/sign-in", middlewares.validate(schemas.user), middlewares.asyncError(handlers.signIn));

    app.post("/sign-out", middlewares.authenticate, middlewares.asyncError(handlers.signOut));

    app.use(middlewares.authenticate);

    app.get("/cards", middlewares.asyncError(handlers.findCards));
    app.post("/cards", middlewares.validate(schemas.card), middlewares.asyncError(handlers.addCard));
    app.delete("/cards", middlewares.asyncError(handlers.deleteCard));

    app.get("/products", middlewares.asyncError(handlers.findProducts));
    app.post("/products", middlewares.validate(schemas.product), middlewares.asyncError(handlers.addProduct));
};