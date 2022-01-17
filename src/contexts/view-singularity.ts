import Context from "../interfaces/client/context.js";

export default {
	name: "View Singularity",
	type: "USER",
	async execute(client, interaction, serverDoc) {
		const slashExecute = (await import("../commands/ms/view.js")).default
			.slashExecute;

		if (!slashExecute) {
			return;
		}

		slashExecute(client, interaction, serverDoc);
	},
} as Context;
