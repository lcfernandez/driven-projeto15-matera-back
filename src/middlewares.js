export const collections = db => (req, _res, next) => {
    const users = db.collection("users");
    const sessions = db.collection("sessions");
    const purchases = db.collection("purchases");
    const products = db.collection("products");

    req.collections = {
        users,
        sessions,
        purchases,
        products,
    };

    next();
};