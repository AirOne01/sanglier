const axios = require('axios').default;

exports.run = (client, msg, args) => {
  msg.channel.sendTyping();

  question = args.join(' ').trim()
  try {
    axios.get(`https://api-free.deepl.com/v2/translate?auth_key=${client.config.deeplKey}&text=${question.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}&target_lang=EN`)
    .then(res => {
      if (!res.data.hasOwnProperty('translations')) msg.reply('Erreur de communication à DeepL');
      axios.get(`https://api.wolframalpha.com/v1/result?i=${res.data.translations[0].text}&appid=${client.config.wolframKey}`)
        .then(res => {
          axios.get(`https://api-free.deepl.com/v2/translate?auth_key=${client.config.deeplKey}&text=${res.data}&target_lang=FR`)
            .then(res => {
              if (!res.data.hasOwnProperty('translations')) msg.reply('Erreur de communication à DeepL');
              msg.reply(res.data.translations[0].text);
            })
        })
        .catch(err => {
          if (err.response.data === 'Wolfram|Alpha did not understand your input') msg.reply('Oula, ça c\'est trop compliqué pour moi :-/');
        })
    })
  } catch (err) {
    msg.reply(`Une erreur est survenue pendant l'éxécution de cette commmande. dsl. \`\`\`javascript\n${err}\n\`\`\``);
  }
}