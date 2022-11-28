import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

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

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    const activeUser = await req.collections.users.findOne({ email });
    const rightPassword = bcrypt.compareSync(password, activeUser?.password || "");

    if (!activeUser || !rightPassword) {
        return res.status(401).send({ message: `invalid username or password` });
    }

    const name = activeUser.name;
    const session = await req.collections.sessions.findOne({ userId: activeUser._id });

    if (session) {
        return res.status(401).send({ message: `this account is already logged in` });
    }

    const token = uuidV4();

    await req.collections.sessions.insertOne({
        token,
        userId: activeUser._id
    });

    res.status(200).send({ token, name });
};

export const signOut = async (req, res) => {
    await req.collections.sessions.deleteOne({
        userId: req.user._id,
    });

    res.sendStatus(200);
};

export const findAddresses = async (req, res) => {
    const user = req.user;
    const addresses = await req.collections.addresses.find({ userId: user._id }).toArray();

    res.status(200).send(addresses);
};

export const addAddress = async (req, res) => {
    const user = req.user;
    const address = req.body;

    await req.collections.addresses.insertOne({
        userId: user._id,
        ...address
    });

    res.sendStatus(201);
};

export const updateAddress = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const newAddress = req.body;

    const address = await req.collections.addresses.findOne({ _id: ObjectId(id) });
    console.log(address);
    if (!address) {
        return res.status(404).send({
            message: "Not Found"
        });
    }

    if (!address.userId.equals(user._id)) {
        return res.status(403).send({
            message: "Forbidden"
        });
    }

    await req.collections.addresses.updateOne(
        {_id: address._id},
        {$set: newAddress}
    );

    res.status(200).send({message: "Endereço editado com sucesso!"});
};

export const deleteAddress = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const address = await req.collections.addresses.findOne({ _id: ObjectId(id) });

    if (!address) {
        return res.status(404).send({
            message: "Not Found"
        });
    }

    if (!address.userId.equals(user._id)) {
        return res.status(403).send({
            message: "Forbidden"
        });
    }

    await req.collections.addresses.deleteOne({ _id: ObjectId(id) });

    res.status(200).send({ message: "Endereço apagado com sucesso!" });
};

export const findCards = async (req, res) => {
    const user = req.user;
    const cards = await req.collections.cards.find({ userId: user._id }).toArray();
    const filteredCards = cards.filter(c => {
        return {
            number: c.number,
            name: c.name,
            expiration: c.expiration
        };
    });
    const hashedCards = filteredCards.map(c => {
        const hash = "************";
        const hashedNumber = hash + c.number.substring(11, 15);
        return {
            ...c,
            number: hashedNumber
        };
    });

    res.status(200).send(hashedCards);
};

export const addCard = async (req, res) => {
    const user = req.user;
    const card = req.body;

    await req.collections.cards.insertOne({
        userId: user._id,
        ...card
    });

    res.sendStatus(201);
};

export const deleteCard = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const card = await req.collections.cards.findOne({ _id: ObjectId(id) });

    if (!card) {
        return res.status(404).send({
            message: "Not Found"
        });
    }

    if (!card.userId.equals(user._id)) {
        return res.status(403).send({
            message: "Forbidden"
        });
    }

    await req.collections.cards.deleteOne({ _id: ObjectId(id) });

    res.status(200).send({ message: "Cartão apagado com sucesso!" });
};

export const findProducts = async (req, res) => {
    const products = await req.collections.products
        .find()
        .sort({ date: -1 })
        .toArray();

    res.status(200).send(products);
};

export const addProduct = async (req, res) => {
    const product = req.body;

    await req.collections.products.insertOne({ ...product });
    res.sendStatus(201);
};

export const addPurchase = async (req, res) => {
    const user = req.user;
    const purchase = req.body;

    await req.collections.purchases.insertOne({
        userId: user._id,
        ...purchase
    });

    res.sendStatus(201);
};

export const findPurchases = async (req, res) => {
    const user = req.user;
    const purchases = await req.collections.purchases.find({ userId: user._id }).toArray();
    const filteredPurchases = purchases.map(p => {
        return {
            id: p._id,
            firstProduct: p.products[0].name,
            firstProductImage: p.products[0].image,
            remainingProducts: p.products.length - 1,
            date: p.date,
            time: p.time
        };
    });

    res.status(200).send(filteredPurchases);
};

export const findPurchase = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const purchase = await req.collections.purchases.findOne({ _id: ObjectId(id) });

    if (!purchase) {
        return res.status(404).send({
            message: "Not Found"
        });
    }

    if (!purchase.userId.equals(user._id)) {
        return res.status(403).send({
            message: "Forbidden"
        });
    }

    res.status(200).send(purchase);
};