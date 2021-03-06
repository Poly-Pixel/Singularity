import type { Snowflake } from "discord.js";

import type Singularity from "../interfaces/singularity.js";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (client: Singularity, id: Snowflake, data: any) => {
	await client.serverModel.updateOne({ guildID: id }, data).exec();
};
