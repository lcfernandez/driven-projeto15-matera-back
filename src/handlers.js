import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
    const { email, name, password } = req.body;

    const userExists = await req.collections.users.findOne({ email });

    if (userExists) {
        return res.status(409).send({ message: "this email is already registered" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    await req.collections.users.insertOne({
        name,
        email,
        password: hashPassword
    });

    res.sendStatus(201);
};

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