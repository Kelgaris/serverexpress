const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

//Conectamos con MONGO
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

const uri = 'mongodb+srv://davidpp:abc123.@cluster0.4mh62.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const cliente = new MongoClient(uri);

let collection;

async function conectarMongoDB() {
  try {
    await cliente.connect();
    const db = cliente.db('PracticaExpress');
    collection = db.collection('Clientes');
    console.log('Conectado a MongoDB');
    return collection;
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
  }
}

conectarMongoDB();


app.get('/api/users/user1/', async (req, res) => {
  const user = await collection.findOne();
  res.json(user);
});


app.get('/api/users/', async (req, res) => {
  const users = await collection.find().toArray();
  res.json(users);
});


app.get('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = await collection.findOne({id:userId});
  console.log("Usuario encontrado:", user);
  res.json(user);
});

app.post('/api/users/', async (req, res) => {
  const {nombre, apellido, telefono} = req.body;
  const collection = await conectarMongoDB();
  const nuevoUser = {nombre, apellido, telefono};

  await collection.insertOne(nuevoUser);
  
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
