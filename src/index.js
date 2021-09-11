#!/usr/bin/node
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.config = require("../config/config.json"); // loads config in the client object

// Magical Event-Assigning Loop®️
// it crawls through the 'events' folder and assign every file to its event
fs.readdir("./events/", (err, files) => {
  console.log(`💫 Chargement des events...`);
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
      console.log(`❌ Impossible de charger ${file}\n${e}`);
      errors++;
      loaded = false;
    }
    if (!loaded) return;
    // note: the event in the file will be called with 'client' as its only argument
    console.log(`✔️ Event chargé chargée: ${eventName}`);
  });
  if (errors === 0){
    console.log(`👌 Events chargés. (${files.length}/${files.length})`);
  } else {
    console.log(`⚠️ Events chargés. (${files.length-errors}/${files.length})`);
  }
});

client.commands = new Collection(); // Enmap collection of commands

// Magical Command-Assigning Loop®️
// same as the one above, except we store the commands in 'client' for later use
fs.readdir("./commands/", (err, files) => {
  console.log(`💫 Chargement des commandes...`);
  if (err) return console.log(err);
  let errors = 0;
  files.forEach((file) => {
    if (!file.endsWith("js")) return; // MacOS again
    let loaded = true;
    let command
    try {
      command = require(`./commands/${file}`); // loads the command
    } catch(e) {
      console.log(`❌ Impossible de charger ${file}\n${e}`);
      errors++;
      loaded = false;
    }
    if (!loaded) return;
    const commandName = file.split(".")[0];     // gets the name
    client.commands.set(commandName, command);  // registers the command
    
    console.log(`✔️ Commande chargée: ${commandName}`);
  });
  if (errors === 0){
    console.log(`👌 Commandes chargées. (${files.length}/${files.length})`);
  } else {
    console.log(`⚠️ Commandes chargées chargés. (${files.length-errors}/${files.length})`);
  }
});

client.login(client.config.token);
