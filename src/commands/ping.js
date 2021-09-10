exports.run = (client, msg, args) => {
  client.lastDate = Date.now()
  msg.reply('🏓 Pong');
};
