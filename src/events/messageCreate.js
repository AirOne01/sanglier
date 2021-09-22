module.exports = (client, msg) => {
  if (msg.author.tag === client.user.tag && msg.content === "🏓 Pong") {
    if (client.hasOwnProperty('lastDate')) {
      const timePassed = Date.now() - client.lastDate
      msg.edit(`🏓 Pong, ${timePassed} ms`)
    } else {
      msg.edit('❌ Une erreur est survenue')
    }
    client.lastDate = undefined
  }

  if (msg.author.bot) return; // ignores bot messages
  if (msg.content.indexOf(client.config.prefix) !== 0) return; // ignores messages without prefix
  const args = msg.content
    .slice(client.config.prefix.length) // removes prefix...
    .trim()                             // ...and useless whitespaces...
    .split(/ +/g);                      // ...and then splits into args
  // removes prefix and splits command arguments. Regex '/ +/g' matches whitespaces
  let command = args.shift().toLowerCase();
  require('../commands.json').commands.forEach(c => {
    // this loops crawls through the aliases to see if the given command is an alias
    if (!c.hasOwnProperty('aliases')) return;
    if (c.aliases.includes(command)) {
      command = c.name;
    }
  });

  const cmd = client.commands.get(command); // gets the command from client.commands Enmap
  if (!cmd) {
    return msg.reply(
      `Commande inconnue. Utilise \`${client.config.prefix}help\` pour plus d'infos.`
    ); // bad command handler
  }
  try {
    cmd.run(client, msg, args); // run the command
  } catch (e) {
    console.log(e);
    msg.reply('Une erreur est survenue pendant l\'éxécution de cette commmande. dsl. ```\n' + e + '\n```');
  }
};
