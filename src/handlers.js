export const findProducts = async (req, res) => {
    try {
        const products = await req.collections.products
            .find()
            .sort({date: -1})
            .toArray();

        res.status(200).send(products);
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"});
    }
};

export const addProduct = async (req, res) => {
    const product = req.body;

    try {
        await req.collections.products.insertOne({...product});
        res.sendStatus(201);
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"});
    }
};