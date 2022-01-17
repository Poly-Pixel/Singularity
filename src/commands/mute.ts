import Discord from "discord.js";

import loadUserInfo from "../util/loadUserInfo";
import updateUser from "../util/updateUser";

import Command from "../interfaces/client/command";

export default {
	name: "mute",
	description: "Mutes the mentioned user h",
	defaultPermission: true,
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you want to mute",
			required: true,
		},
		{
			name: "reason",
			type: "STRING",
			description:
				'A short reason for muting this user - will default to "Muted by <your tag>" if omitted',
			required: false,
		},
	],
	type: "mod",
	args: ["<user to mute>"],
	aliases: [],
	example: "mute @poly",
	notes: "user must be mentioned",
	async slashExecute(client, interaction, serverDoc) {
		await interaction.deferReply();
		const user = interaction.options.get("user");

		if (
			!(user?.member instanceof Discord.GuildMember) ||
			!(interaction.member instanceof Discord.GuildMember)
		) {
			return;
		}

		if (user.member.permissions.has("ADMINISTRATOR")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setDescription("You cannot mute a moderator!")
				.setColor(0x000000);

			return interaction.editReply({ embeds: [permsEmbed] });
		}

		if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setDescription("You do not have permissions to mute!")
				.setColor(0x000000);

			return interaction.editReply({ embeds: [permsEmbed] });
		}

		if (user.member.roles.cache.find((role) => role.name === "Muted")) {
			const embed = new Discord.MessageEmbed()
				.setDescription("This member is already muted!")
				.setColor(0x000000);

			return interaction.editReply({ embeds: [embed] });
		}

		if (!interaction.guild) {
			return;
		}

		await interaction.guild.roles.fetch();

		let muteRole = interaction.guild.roles.cache.find(
			(rl) => rl.name === "Muted"
		);

		if (!muteRole) {
			await interaction.guild.roles.create({
				name: "Muted",
				color: "#FFFFFF",
				hoist: true,
				permissions: 66560n,
				mentionable: false,
				reason: "mute role",
			});

			muteRole = interaction.guild.roles.cache.find(
				(rl) => rl.name === "Muted"
			);

			const channels = interaction.member.guild.channels.cache;

			channels.mapValues((chanel) => {
				if (!(chanel instanceof Discord.ThreadChannel)) {
					if (chanel.manageable) {
						if (!muteRole) {
							return;
						}

						if (chanel.isText()) {
							chanel.permissionOverwrites.create(
								muteRole,
								{
									SEND_MESSAGES: false,
								},
								{
									reason: "Setting up Muted role",
								}
							);
						} else {
							chanel.permissionOverwrites.create(
								muteRole,
								{
									SPEAK: false,
								},
								{
									reason: "Setting up Muted role",
								}
							);
						}
					}
				}
			});
		}

		if (!muteRole) {
			return;
		}

		user.member.roles
			.add(
				muteRole,
				(interaction.options.get("reason")?.value ??
					`User muted by ${interaction.user.tag}`) as string
			)
			.then(async () => {
				if (!user.user) {
					return;
				}

				const userDoc = await loadUserInfo(client, serverDoc, user.user.id);
				userDoc.infractions.push({
					modID: interaction.user.id,
					modTag: interaction.user.tag,
					timestamp: interaction.createdTimestamp,
					type: "Mute",
					message: (interaction.options.get("reason")?.value ??
						`User muted by ${interaction.user.tag}`) as string,
				});
				updateUser(client, userDoc.guildID, userDoc.userID, {
					...userDoc.toObject(),
					infractions: userDoc.infractions,
				});

				if (!interaction.guild) {
					return;
				}

				const mutedEmbed = new Discord.MessageEmbed()
					.setColor(0x000000)
					.setDescription(
						`You have been muted in **${interaction.guild.name}** for \`${
							interaction.options.get("reason")?.value ??
							`User banned by ${interaction.user.tag}`
						}\``
					);

				user.user.send({ embeds: [mutedEmbed] });

				const embed = new Discord.MessageEmbed()
					.setColor(0x000000)
					.setDescription(`Successfully muted **${user.user.tag}**`);

				interaction.editReply({ embeds: [embed] });
			})
			.catch((err) => {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000000)
					.setDescription(
						"I was unable to mute the member because: \n`" + err + "`"
					);

				interaction.editReply({ embeds: [embed] });
				console.error(err);
			});
	},
} as Command;
