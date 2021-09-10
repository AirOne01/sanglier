const { MessageEmbed } = require("discord.js");

exports.run = (client, message, args) => {
  if (args.length === 0) {
    // for a list of commands
    let msg = { title: "Command list", fields: [] };
    const cmd = require("../commands.json");

    cmd.categories.forEach((cat) => {
      let desc = ""; // blank field description
      cmd.commands.forEach((i) => {
        if (i.category === cat.tag) desc += `\`${i.name}\` `; // adds command to field desc
      });
      msg.fields.push({ name: cat.name, value: desc, inline: true }); // pushed field with category name as well
    });
    message.reply({ embeds: [msg] });
  } else {
    msgs = [];
    const commands = require("../commands.json").commands;
    args.forEach((arg) => {
      // getting the command
      command2 = {};
      commands.forEach((c) => {
        command2[c.name] = c;
      });
      commands.forEach(c => {
        // this loops crawls through the aliases to see if the given command is an alias
        if (!c.hasOwnProperty('aliases')) return;
        if (c.aliases.includes(arg)) {
          arg = c.name;
        }
      });
      // this checks if the command exists
      if (!command2.hasOwnProperty(arg)) {
        msgs.push({ description: `Commande inconnue : \`${arg}\``})
        return;
      }
      const cmd = command2[arg];

      let msg = new MessageEmbed({
        fields: [{ name: cmd.name, value: cmd.description, inline: true }],
      });
      msg.spliceFields;
      if (cmd.hasOwnProperty("category"))
        msg.addField("Catégorie", cmd.category, true);
      if (cmd.hasOwnProperty("aliases"))
        msg.addField("Alias", cmd.aliases.toString(), true);
      if (cmd.hasOwnProperty("syntax"))
        msg.addField("Utilisation", cmd.syntax, true);
      msgs.push(msg);
    });
    message.reply({ embeds: msgs });
  }
};
