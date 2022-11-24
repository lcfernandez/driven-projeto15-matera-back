import * as handlers from "./handlers.js";
import * as middlewares from "./middlewares.js";
import * as schemas from "./schemas.js";
import express from "express";

export const routes = (app, db) => {
    app.use(middlewares.collections(db));
    app.use(express.static("public"));

    app.post("/sign-up", middlewares.validate(schemas.newUser), middlewares.asyncError(handlers.signUp));

    app.get("/products", handlers.findProducts);
    app.post("/products", middlewares.validate(schemas.product), handlers.addProduct);
};