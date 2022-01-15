const optMapping = {
	1: "1️⃣",
	2: "2️⃣",
	3: "3️⃣",
	4: "4️⃣",
	5: "5️⃣",
	6: "6️⃣",
	7: "7️⃣",
	8: "8️⃣",
	9: "9️⃣",
	10: "🔟",
};

export default {
	name: "create",
	description: "Creates a poll",
	options: [
		{
			name: "title",
			description: "The title of the poll",
			type: "STRING",
			required: true,
		},
		{
			name: "option1",
			description: "The first option",
			type: "STRING",
			required: true,
		},
		{
			name: "option2",
			description: "The second option",
			type: "STRING",
			required: true,
		},
		{
			name: "option3",
			description: "The third option",
			type: "STRING",
			required: false,
		},
		{
			name: "option4",
			description: "The fourth option",
			type: "STRING",
			required: false,
		},
		{
			name: "option5",
			description: "The fifth option",
			type: "STRING",
			required: false,
		},
		{
			name: "option6",
			description: "The sixth option",
			type: "STRING",
			required: false,
		},
		{
			name: "option7",
			description: "The seventh option",
			type: "STRING",
			required: false,
		},
		{
			name: "option8",
			description: "The eighth option",
			type: "STRING",
			required: false,
		},
		{
			name: "option9",
			description: "The ninth option",
			type: "STRING",
			required: false,
		},
		{
			name: "option10",
			description: "The tenth option",
			type: "STRING",
			required: false,
		},
		{
			name: "description",
			description: "The description of the poll",
			type: "STRING",
			required: false,
		},
		{
			name: "color",
			description: "The hex color of the poll embed (just the 6 characters)",
			type: "STRING",
			required: false,
		},
	],
	example: 'poll create "Yes or no?" "Yes" "No"',
	async slashExecute(client, Discord, interaction) {
		await interaction.deferReply();
		let title = interaction.options.get("title").value;
		let description = interaction.options.get("description")?.value ?? "";
		let colorStr = interaction.options.get("color")?.value ?? "000000";
		let options = [
			interaction.options.get("option1")?.value,
			interaction.options.get("option2")?.value,
			interaction.options.get("option3")?.value,
			interaction.options.get("option4")?.value,
			interaction.options.get("option5")?.value,
			interaction.options.get("option6")?.value,
			interaction.options.get("option7")?.value,
			interaction.options.get("option8")?.value,
			interaction.options.get("option9")?.value,
			interaction.options.get("option10")?.value,
		];
		let cleanOptions = options.filter((opt) => typeof opt === "string");

		let optStr = "";
		for (let i = 0; i < cleanOptions.length; i++) {
			optStr = optStr + `${optMapping[`${i + 1}`]} ${cleanOptions[i]} \n \n`;
		}

		const currentDate = new Date(Date.now());
		const poll = new Discord.MessageEmbed()
			.setTitle(title)
			.setFooter(
				`Poll created by ${
					interaction.user.tag
				} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,
				interaction.user.displayAvatarURL()
			);

		try {
			poll.setColor(`#${colorStr}`);
		} catch {
			const embed = new Discord.MessageEmbed()
				.setColor(0x000000)
				.setDescription("Invalid hex color provided");

			return interaction.editReply({ embeds: [embed] });
		}

		if (description !== "")
			poll.addFields({
				name: "Description",
				value: description,
				inline: false,
			});

		poll.addFields({
			name: "Options",
			value: optStr,
			inline: false,
		});

		interaction.editReply({ embeds: [poll] }).then((sent) => {
			let sentEmbed = sent.embeds[0];
			sentEmbed.setFooter(
				`Poll ID: ${sent.id} • Poll created by ${
					interaction.user.tag
				} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,
				interaction.user.displayAvatarURL()
			);
			sent.edit({ embeds: [sentEmbed] }).then((newSent) => {
				for (let i = 0; i < cleanOptions.length; i++) {
					newSent.react(optMapping[`${i + 1}`]);
				}
			});
		});
	},
};
