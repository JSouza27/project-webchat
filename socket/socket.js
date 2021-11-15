const moment = require('moment');
const Model = require('../public/models/chatModel');

const users = [];

const setUser = (user) => {
  users.push(user);

  return user;
};

const updateUser = (obj) => {
  const index = users.indexOf(obj.oldNickname);
  users.splice(index, 1, obj.newNickname);
};

const message = (chatMessage, nickname) => ({
  message: `${moment().format('DD-MM-YYYY HH:mm:ss')} ${nickname}: ${chatMessage}`,
  nickname,
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
});

const NEW_CONNETION = 'new-connection';

module.exports = (io) => io.on('connection', async (socket) => {
  socket.emit('user-nickname', setUser(socket.id.slice(1, 17)));
  
  io.emit(NEW_CONNETION, users);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const msg = message(chatMessage, nickname);

    io.emit('message', msg.message);
    await Model.sendMessage(msg);
  });

  socket.on('update-nickname', (nick) => {
    updateUser(nick);
    io.emit(NEW_CONNETION, users);
  });

  socket.on('disconnect', (user) => {
    users.splice(users.indexOf(user), 1);
    io.emit(NEW_CONNETION, users);
  });
});
