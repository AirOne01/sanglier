// 'message' event
module.exports = (client, msg) => {
  if (msg.author.bot) return; // ignores bot messages
  if (msg.content.indexOf(client.config.prefix) !== 0) return; // ignores messages without prefix
  const args = msg.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  // removes prefix and splits command arguments. Regex '/ +/g' matches whitespaces
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command); // gets the command from client.commands Enmap
  if (!cmd)
    msg.reply(
      `Commande inconnue. Utilise ${client.config.prefix}help pour plus d'infos.`
    ); // bad command handler

  cmd.run(client, msg, args); // run the command
};
