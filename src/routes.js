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

    app.get("/products", middlewares.asyncError(handlers.findProducts));

    app.use(middlewares.authenticate);

    app.get("/addresses", middlewares.asyncError(handlers.findAddresses));
    app.post("/addresses", middlewares.validate(schemas.address), middlewares.asyncError(handlers.addAddress));
    app.put("/addresses/:id", middlewares.validate(schemas.address), middlewares.asyncError(handlers.updateAddress));
    app.delete("/addresses/:id", middlewares.asyncError(handlers.deleteAddress));

    app.get("/cards", middlewares.asyncError(handlers.findCards));
    app.post("/cards", middlewares.validate(schemas.card), middlewares.asyncError(handlers.addCard));
    app.delete("/cards/:id", middlewares.asyncError(handlers.deleteCard));

    app.post("/products", middlewares.validate(schemas.product), middlewares.asyncError(handlers.addProduct));

    app.get("/purchases", middlewares.asyncError(handlers.findPurchases));
    app.get("/purchases/:id", middlewares.asyncError(handlers.findPurchase));
    app.post("/purchases", middlewares.validate(schemas.purchase), middlewares.asyncError(handlers.addPurchase));
};