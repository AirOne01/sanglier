const { MessageEmbed } = require("discord.js");
const color = require("dominant-color");

exports.run = (client, msg, args) => {
  msg.channel.sendTyping();

  guild = msg.guild;
  let emb = new MessageEmbed({
    title: guild.name,
    thumbnail: { url: guild.iconURL() },
  });
  emb.description = guild.description ? guild.description : undefined;

  msg.reply({ embeds: [emb] })
    .then(msg => {
      [ emb ] = msg.embeds;

      client.users.fetch(guild.ownerId).then(o => {
        guild.fetch().then(guild => {
          owner = o.tag
          emb.addField('Utilisateurs', `${guild.approximateMemberCount} utilisateurs.\nServeur géré par ${owner}`)
  
          msg.edit({ embeds: [emb] })
        })
      })
    })
};
