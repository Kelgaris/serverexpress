const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

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




let data = [
  {id: 1, nombre: "David", apellido: "Priego", telefono: 630650786},
  {id: 2, nombre: "Agustín", apellido: "Alonso", telefono: 630650786},
  {id: 3, nombre: "Eder", apellido: "Castro", telefono: 630650786},
  {id: 4, nombre: "Diego", apellido: "Perez", telefono: 630650786},
];


app.get('/users/user1/', (req, res) => {
  res.json(data[0]);
});


app.get('/users/', (req, res) => {
  res.json(data);
});


app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = data.find((u) => u.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({Error: "Usuario no encontrado"});
  }
});

app.post('/users/', (req, res) => {
  const user = req.body;
  if (!user.nombre || !user.apellido || !user.telefono) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  user.id = data.length + 1;
  data.push(user);
  res.status(201).json(user);
});


app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
