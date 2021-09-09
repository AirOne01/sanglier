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
  if (err) return console.log(err);
  files.forEach((file) => {
    if (!file.endsWith("js")) return; // MacOS thing
    const eventName = file.split(".")[0]; // gets name to register event
    console.log(`💫 Chargement event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client)); // binds file to event
    // note: the event in the file will be called with 'client' as its only argument
  });
});

client.commands = new Collection(); // Enmap collection of commands

// Magical Command-Assigning Loop®️
// same as the one above, except we store the commands in 'client' for later use
fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);
  files.forEach((file) => {
    if (!file.endsWith("js")) return; // MacOS again
    const command = require(`./commands/${file}`); // loads the command
    const commandName = file.split(".")[0]; // gets the name
    console.log(`💫 Chargement commande: ${commandName}`);
    client.commands.set(commandName, command); // registers the command
  });
});

client.login(client.config.token);
