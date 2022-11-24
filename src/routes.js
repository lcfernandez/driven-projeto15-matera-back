import express from "express";
import * as handlers from "./handlers.js";
import * as middlewares from "./middlewares.js";
import * as schemas from "./schemas.js";

export const routes = (app, db) => {
    app.use(middlewares.collections(db));
    app.use(express.static("public"));

    app.post("/sign-up", middlewares.validate(schemas.newUser), middlewares.asyncError(handlers.signUp));
};