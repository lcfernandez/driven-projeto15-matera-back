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
    const { id } = req.body;

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

    res.status(200).send({message: "Cartão apagado com sucesso!"});
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