/*
REMINDERS:
 -Server perks system
 -Improve profile system (black hole upgrade system)
 -Make code cleaner (unnecessary arguments, pass config)
*/

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing"); //eslint-disable-line

Sentry.init({
  dsn: "https://d38245378f464bdeb3d02ca1cb6af6f9@o920118.ingest.sentry.io/5865017",
  release: 'Singularity@0.1.0',
  tracesSampleRate: 1.0,
});

Sentry.setTag("appProcess", "bot-core");

const Discord = require('discord.js');
const client = new Discord.Client({partials: ["REACTION", "MESSAGE"]});
const mongoose = require('mongoose');

require('dotenv').config();

const url = 'mongodb://127.0.0.1:27017/Singularity';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
  console.log('Database connected:', url);
  client.msSchema = new mongoose.Schema({
    userID: String,
    protons: Number,
    electrons: Number,
    darkMatter: Number,
    lifeExp: Number,
    items: Array,
    powerUps: Array,
    singularity: Object
  });
  
  const serverSchema = new mongoose.Schema({
    guildID: String,
    prefix: String,
    welcomeMessage: String,
    welcomeChannelName: String,
    leaveChannelName: String,
    leaveMessage: String,
    reactionRoles: Array,
    ms: [client.msSchema]
  });
  
  client.serverModel = mongoose.model('serverModel', serverSchema);
  
  client.commands = new Discord.Collection();
  client.events = new Discord.Collection();
  client.utils = {};
  
  ['command_handler', 'event_handler', 'util_handler'].forEach(handler =>{
      require(`./handlers/${handler}`)(Discord, client);
  });
  
  client.login(process.env.TOKEN);
});

db.on('error', err => {
  console.error('connection error:', err)
});