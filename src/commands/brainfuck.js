const { MessageEmbed } = require('discord.js');

exports.run = (client, msg, args) => {
  if (args.length < 1) {
    return msg.reply(
      `Syntax: \`${client.config.prefix}brainfuck <code> [argument]\``
    );
  }

  const Brainfuck = require('brainfuck-node');
  const bf = new Brainfuck();

  const res = bf.execute(args[0], args[1]);
  const emb = new MessageEmbed({
    description: `**Output**\n\`${res.output}\``,
    fields: [
      {
        name: 'Mémoire',
        value: `${res.memory.pointers ? 'Pointeurs:' + res.memory.pointers + '\n' : ''}Base: ${res.memory.base}`,
      },
    ],
  });

  if (res.output.toLowerCase().includes('@everyone')) {
    msg.reply({
      embeds: [emb, { description: 'Bien essayé <:pog:886274646322839653>' }],
    });
  } else {
    msg.reply({ embeds: [emb] });
  }
};
