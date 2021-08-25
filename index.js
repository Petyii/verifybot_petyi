// #!/usr/bin/env node
"use strict";
require("dotenv").config();

const Discord = require("discord.js");
const chalk = require("chalk");
const moment = require("moment");
const { BOT_TOKEN, VERIFICATION_CHANNEL, VERIFIED_ROLE, PORT } = process.env;


const client = new Discord.Client({
  disableEveryone: true
});

client.once("ready", () => {
  console.log(chalk.greenBright("[READY]"), `Bejelentkeztem ${client.user.tag} (${client.user.id}) ebben a pillanatban ${moment().format("DD MMMM YYYY, hh:mm:ss")}`);
});

client.on("message", message => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.content === "elfogadom" && message.channel.id === VERIFICATION_CHANNEL) {
    if (!message.channel.permissionsFor(message.guild.me).serialize().SEND_MESSAGES) return console.error("The bot doesn't have the permission to send messages.\nRequired permission: SEND_MESSAGES");
    if (!message.channel.permissionsFor(message.guild.me).serialize().ADD_REACTIONS) {
      console.error("Oh uh.😦 Hibát fedeztem fel.❗ **Nincs engedélyem, hogy reakciót hozzak létre** - `ADD_REACTIONS`");
      message.channel.send("The bot doesn't have the permission to add reactions.\nRequired permission: `ADD_REACTIONS`")
        .then(m => m.delete({timeout: 20000}));
      return;
    }
    if (!message.channel.permissionsFor(message.guild.me).serialize().MANAGE_MESSAGES) {
      console.error("Oh uh.😦 Hibát fedeztem fel.❗`MANAGE_MESSAGES`");
      message.channel.send("Oh uh.😦 Hibát fedeztem fel.❗ `MANAGE_MESSAGES`")
        .then(m => m.delete({timeout: 20000}));
      return;
    }
    const messageRole = message.guild.roles.cache.find(role => role.name === VERIFIED_ROLE);
    if (messageRole == null) return;
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      message.channel.send("Oh uh.😦 Hibát fedeztem fel.❗ `MANAGE_ROLES`")
        .then(m => m.delete({timeout: 20000}));
      return;
    }
    if (message.guild.me.roles.highest.comparePositionTo(messageRole) < 1) {
      message.channel.send("Hiba. Keresd fel a működtetőt.")
        .then(m => m.delete({timeout: 20000}));
      return;
    }
    if (messageRole.managed == true) {
      message.channel.send("Oh uh.😦 Hibát fedeztem fel.❗ **Ez a rang automatikus**")
        .then(m => m.delete({timeout: 20000}));
      return;
    }
    if (message.member.roles.cache.has(messageRole.id)) return;
    message.react("✅");
    message.member.roles.add(messageRole)
      .then(() => message.delete({ timeout:5000 }))
      .catch(error => {
      console.error(error.stack);
      message.channel.send(error.stack)
        .then(m => m.delete({timeout: 20000}));
    });
  }
});



client.login(BOT_TOKEN);
