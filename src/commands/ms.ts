import type Command from "../interfaces/client/command.js";

export default {
	name: "ms",
	description: "Manage your Singularity and view the Singularities of others!",
	defaultPermission: true,
	options: [],
	type: "ms",
	args: ["!<@user | upgrade | shop>"],
	aliases: ["ms"],
	example: "singularity",
} as Command;
