import Discord from "discord.js";

import loadGuildInfo from "../../../util/loadGuildInfo";

import InteractionHandler from "../../../types/InteractionHandler";

const handler: InteractionHandler = async (client, interaction) => {
	if (!(interaction instanceof Discord.CommandInteraction)) {
		return;
	}

	console.log(
		`Command Interaction Recieved - ${interaction.commandName} from ${interaction.user.tag} in ${interaction.guild.name}`
	);
	if (!client.commands.has(interaction.commandName) || !interaction.guild)
		return;

	const serverDoc = await loadGuildInfo(client, interaction.guild);

	let executor = null;

	if (interaction.options.getSubcommandGroup(false)) {
		executor = client.commands
			.get(interaction.commandName)
			?.options.find(
				(cmd) => cmd.name === interaction.options.getSubcommandGroup()
			)
			?.options?.find(
				(cmd) => cmd.name === interaction.options.getSubcommand()
			)?.slashExecute;
	} else if (interaction.options.getSubcommand(false)) {
		executor = client.commands
			.get(interaction.commandName)
			?.options.find(
				(cmd) => cmd.name === interaction.options.getSubcommand()
			)?.slashExecute;
	} else {
		executor = client.commands.get(interaction.commandName)?.slashExecute;
	}

	if (!executor) {
		return;
	}

	try {
		await executor(client, interaction, serverDoc);
	} catch (error) {
		console.error(error);
		const embed = new Discord.MessageEmbed()
			.setColor(0x000000)
			.setDescription(
				"An error was encountered while executing this command. The issue has been reported to the Singularity Team. We are sorry for the inconvenience."
			);
		await interaction.editReply({
			embeds: [embed],
		});
	}
};

export default handler;