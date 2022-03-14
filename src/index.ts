import APIClient from "./website/server";
import cron from "node-cron";
import dotenv from "dotenv";
import Discord from "discord.js";
import mongoose from "mongoose";
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import * as Tracing from "@sentry/tracing";

import checkActivity from "./util/checkActivity";
import command_handler from "./handlers/command_handler";
import event_handler from "./handlers/event_handler";
import rootDir from "./root";
import captureException from "./util/captureException";

import Singularity from "./interfaces/singularity";
import Command from "./interfaces/client/command";
import Context from "./interfaces/client/context";

// Used to prevent Tracing import from being pruned
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tracer = Tracing;

dotenv.config();

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: "Singularity@1.0.1",
	tracesSampleRate: 1.0,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new RewriteFrames({
			root: rootDir,
		}),
	],
	environment: process.env.SENTRY_ENVIRONMENT,
});

const startupTransaction = Sentry.startTransaction({
	op: "startup",
	name: "Startup",
});

Sentry.configureScope((scope) => {
	scope.setSpan(startupTransaction);
});

const client = new Discord.Client({
	partials: ["REACTION", "MESSAGE", "CHANNEL"],
	intents: [
		"GUILDS",
		"GUILD_MEMBERS",
		"GUILD_BANS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"DIRECT_MESSAGES",
	],
	failIfNotExists: true,
}) as Singularity;
const api = new APIClient({
	type: process.env.API_TYPE as string,
	host: process.env.API_HOST as string,
	port: Number(process.env.API_PORT) ?? 5000,
});

if (!process.env.MONGODB_URI) {
	throw new Error("MongoDB URI must be provided in the environment variables");
}

mongoose.connect(process.env.MONGODB_URI);

const databaseConnectionTransaction = startupTransaction.startChild({
	op: "connection",
	description: "Database Connection",
});

const db = mongoose.connection;
db.once("open", () => {
	databaseConnectionTransaction.finish();
	console.log("Database connected:", process.env.MONGODB_URI);
	const userSchema = new mongoose.Schema({
		userID: String,
		guildID: String,
		protons: Number,
		electrons: Number,
		darkMatter: Number,
		lifeExp: Number,
		items: Array,
		rareItems: Array,
		active: Array,
		activity: Date,
		singularity: Object,
		infractions: Array,
	});

	const serverSchema = new mongoose.Schema({
		guildID: String,
		welcomeMessage: String,
		welcomeChannelID: String,
		leaveChannelID: String,
		leaveMessage: String,
		reactionRoles: Array,
		ms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
		items: Array,
		types: Array,
	});

	userSchema.index({ guildID: 1, userID: -1 });
	serverSchema.index({ guildID: 1 });

	client.userModel = mongoose.model("Users", userSchema);
	client.serverModel = mongoose.model("Servers", serverSchema);

	client.commands = new Discord.Collection<string, Command>();
	client.contexts = new Discord.Collection<string, Context>();

	client.login(process.env.DISCORD_TOKEN);
	const loginTransaction = startupTransaction.startChild({
		op: "connection",
		description: "Login to Discord API",
	});

	client.once("ready", () => {
		console.log("Singularity is now online");

		client.user?.setPresence({
			activities: [{ name: "singularitybot.glitch.me", type: "WATCHING" }],
			status: "online",
		});

		command_handler(client);
		event_handler(client, api);

		cron.schedule("0 0 * * *", () => checkActivity(client), {
			timezone: "America/New_York",
		});

		loginTransaction.finish();
		startupTransaction.finish();
	});
});

db.on("error", (err) => {
	captureException(err);
});
