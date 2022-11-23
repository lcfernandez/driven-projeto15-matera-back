import * as middlewares from "./middlewares.js";

export const routes = (app, db) => {
    app.use(middlewares.collections(db));
};