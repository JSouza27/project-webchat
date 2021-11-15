const connection = require('./connection');

const TABLE = 'messages';

const sendMessage = async (message) => {
  const connect = await connection();
  const db = await connect.collection(TABLE).insertOne(message);

  return db.ops[0];
};

const getMessage = async () => {
  const connect = await connection();
  const findAllMessages = await connect.collection(TABLE).find({}).toArray();

  return findAllMessages;
};

const updateNickname = async (oldNick, newNick) => {
  const connect = await connection();
  await connect.collection(TABLE).updateOne({ nickname: oldNick }, { $set: { nickname: newNick } });
};

module.exports = {
  sendMessage,
  getMessage,
  updateNickname,
};
