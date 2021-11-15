const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Model = require('./public/models/chatModel');

require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${port}`,
    methods: ['GET', 'POST'],
  },
});

require('./socket/socket')(io);

app.set('view engine', 'ejs');
app.set('views', './public/views');

app.use(cors());

app.get('/', async (_req, res) => {
  const messages = await Model.getMessage();
  return res.render('app.ejs', { oldMessages: messages });
});

httpServer.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
