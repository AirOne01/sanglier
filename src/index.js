#!/usr/bin/node
const { Client, Intents, Collection } = require("discord.js");
const prompts = require("prompts");
const fs = require("fs");
const pupp = require("puppeteer");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// loads config in the client object
client.config = require("../config/config.json");

// async because we'll call await methods
(async () => {
  /// Using prompts to ask for the unprecized options
  console.log("⚙️ Configuration avec prompts 💫");
  const list = ["token", "prefix", "deeplKey", "wolframKey", "osuId", "osuSecret", "MDUser", "MDPwd"];
  const secret = ["token", "deeplKey", "wolframKey", "osuSecret", "MDPwd"];
  for (let i = 0; i < list.length; i++) {
    if (client.config.hasOwnProperty(list[i])) continue;
    const response = await prompts({
      type: "text",
      name: "value",
      message: "Veuillez renseigner '" + list[i] + "'"
    });
    client.config[list[i]] = response.value;
  }
  fs.writeFileSync('../config/config.json', JSON.stringify(client.config, null, 2));
  console.log("⚙️ Configuration terminée ✔️");

  // launch the browser, so that it isn't call multiple times
  console.log("🪐 Lancement du navigateur de puppeteer 💫");
  client.browser = await pupp.launch(); // the reason the whole file is under async
  console.log("🪐 Chromium lancé ! ✔️");

  // Magical Event-Assigning Loop®️
  // it crawls through the 'events' folder and assign every file to its event
  fs.readdir("./events/", (err, files) => {
    console.log(`🌟 Chargement des events... 💫`);
    if (err) return console.log(err);
    let errors = 0;
    files.forEach((file) => {
      if (!file.endsWith("js")) return; // MacOS thing
      let loaded = true;
      const eventName = file.split(".")[0]; // gets name to register event
      try {
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client)); // binds file to event
      } catch (e) {
        console.log(`🌟 Impossible de charger ${file} ❌\n${e}`);
        errors++;
        loaded = false;
      }
      if (!loaded) return;
      // note: the event in the file will be called with 'client' as its only argument
      console.log(`🌟 Event chargé chargée: ${eventName} ✔️`);
    });
    if (errors === 0) {
      console.log(`🌟 Events chargés. (${files.length}/${files.length}) 👌`);
    } else {
      console.log(
        `🌟 Events chargés. (${files.length - errors}/${files.length}) ⚠️`
      );
    }
  });

  client.commands = new Collection(); // Enmap collection of commands

  // Magical Command-Assigning Loop®️
  // same as the one above, except we store the commands in 'client' for later use
  fs.readdir("./commands/", (err, files) => {
    console.log(`☄️ Chargement des commandes... 💫`);
    if (err) return console.log(err);
    let errors = 0;
    files.forEach((file) => {
      if (!file.endsWith("js")) return; // MacOS again
      let loaded = true;
      let command;
      try {
        command = require(`./commands/${file}`); // loads the command
      } catch (e) {
        console.log(`☄️ Impossible de charger ${file} ❌\n${e}`);
        errors++;
        loaded = false;
      }
      if (!loaded) return;
      const commandName = file.split(".")[0]; // gets the name
      client.commands.set(commandName, command); // registers the command

      console.log(`☄️ Commande chargée: ${commandName} ✔️`);
    });
    if (errors === 0) {
      console.log(`☄️ Commandes chargées. (${files.length}/${files.length}) 👌`);
    } else {
      console.log(
        `☄️ Commandes chargées. (${files.length - errors}/${
          files.length
        }) ⚠️`
      );
    }
  });

  client.login(client.config.token);
})();
