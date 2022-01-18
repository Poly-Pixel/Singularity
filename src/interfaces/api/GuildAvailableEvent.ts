import { HydratedDocument } from "mongoose";
import { Guild } from "discord.js";

import { Server } from "../../database/schema/server";

export default interface GuildAvailableEvent {
	available?: boolean;
	data?: Promise<HydratedDocument<Server>>;
	guild?: Promise<Guild>;
}