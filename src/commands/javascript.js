const Sandbox = require('sandbox');
const s = new Sandbox();

exports.run = (client, msg, args) => {
  const code = args.join(' ');

  s.run(code, out => {
    msg.reply(`\`${out.result}\``);
    out.result ? msg.channel.send('Pour plus d\'infos sur l\'utilisation de cette commande, tape `' + client.config.prefix + 'help js`') : null;
  })
}