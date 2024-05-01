const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express()
const port = 3333

app.use(express.json(), cors({
    origin: 'http://localhost:5173',
}))

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    created_at: { type: Date, default: Date.now }
})

app.get("/", async (req, res) => {
    const users =  await User.find()
    return res.send(users)
})

app.delete("/:id", async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    return res.send(user)
})

app.post("/autenticar", async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("Email ou senha inválidos!");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send("Email ou senha inválidos!");
        }
        
        res.send(user);
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).send("Erro interno do servidor");
    }
})

app.put("/:id", async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.oldPassword) {
        return res.status(400).send("Preencha todos os campos");
    }

    try {
        const user = await User.findById(req.params.id);

        const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Senha anterior incorreta");
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.body.password !== req.body.oldPassword) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();
        return res.send(updatedUser);
    } catch (error) {
        return res.status(500).send("Erro ao atualizar usuário");
    }
})

app.post("/", async (req, res) => {
    const existinEmail = await User.findOne({ email: req.body.email });

    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send("Preencha todos os campos");
    }

    if(existinEmail) {
        return res.status(400).send("Usuario ja cadastrado para o email informado");
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        await user.save();
        
        return res.send(user);
    } catch (error) {
        return res.status(500).send("Erro ao criar usuário");
    }
})

app.listen(port, () => {
    mongoose.connect('mongodb+srv://Teteu:Mtgb2905@teteu.ugsiidu.mongodb.net/teteu?retryWrites=true&w=majority&appName=Teteu')
    console.info('App running')
})