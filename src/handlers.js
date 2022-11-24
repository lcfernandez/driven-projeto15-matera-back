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