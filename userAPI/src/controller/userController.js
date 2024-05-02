const bcrypt = require('bcrypt');
const User = require('../model/user');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            return res.send(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).send("Internal Server Error");
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.send(user);
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).send("Internal Server Error");
        }
    },

    async authenticateUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).send("Email ou senha invalidos");
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).send("Email ou senha invalidos");
            }

            res.send(user);
        } catch (error) {
            console.error("Error authenticating user:", error);
            return res.status(500).send("Internal Server Error");
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, oldPassword } = req.body;

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).send("usuario não encontrado");
            }

            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).send("Senha anterior incorreta");
            }

            user.name = name;
            user.email = email;

            if (password !== oldPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            const updatedUser = await user.save();
            return res.send(updatedUser);
        } catch (error) {
            console.error("Erro ao atualizar o usuario:", error);
            return res.status(500).send("Internal Server Error");
        }
    },

    async createUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).send("Preencha todos os campos");
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).send("Usuario cadastrado para o email informado");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save();
            return res.send(newUser);
        } catch (error) {
            console.error("Erro ao criar usuario:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
};
