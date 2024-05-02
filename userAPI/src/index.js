const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3333;

app.use(express.json(), cors({
    origin: 'http://localhost:5173',
}));

mongoose.connect('mongodb+srv://Teteu:Mtgb2905@teteu.ugsiidu.mongodb.net/teteu?retryWrites=true&w=majority&appName=Teteu');

app.use('/', userRoutes);

app.listen(port, () => {
    console.info('App running');
});