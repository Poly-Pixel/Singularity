import { Schema } from "mongoose";
import { Snowflake } from "discord.js";

import type ActiveItem from "../../interfaces/user/activeitem.js";
import type UserSingularity from "../../interfaces/user/usersingularity.js";
import type Infraction from "../../interfaces/user/infraction.js";

export interface User {
	userID: Snowflake;
	guildID: Snowflake;
	protons: number;
	electrons: number;
	darkMatter: number;
	lifeExp: number;
	items: string[];
	rareItems: string[];
	active: ActiveItem[];
	activity: Date;
	singularity: UserSingularity;
	infractions: Infraction[];
}

export const UserSchema = new Schema({
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
