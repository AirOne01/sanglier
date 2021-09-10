exports.run = (client, message, args) => {
  if(!args || args.length < 1) return message.reply("Veuillez renseigner une commande à recharger");
  const commandName = args[0];
  // Check if the command exists and is valid
  if(!client.commands.has(commandName)) {
    return message.reply("Cette commande n'existe pas");
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${commandName}.js`)];
  // We also need to delete and reload the command from the client.commands Enmap
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  message.reply(`La commande \`${commandName}\` a été rechargée`);
};