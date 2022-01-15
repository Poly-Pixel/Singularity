const cooldowns = {};

const levelArr = [200, 500, 1000, 2000, 5000, 9000, 14000, 20000, 28000, 40000];

//eslint-disable-next-line no-unused-vars
let cooldownInterval = setInterval(() => {
	for (let person in cooldowns) {
		if (cooldowns[person] > 0) cooldowns[person]--;
	}
}, 1000);

function splitCommandLine(commandLine) {
	var doubleDoubleQuote = "<DDQ>";
	while (commandLine.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += "@";
	var noDoubleDoubleQuotes = commandLine.replace(/""/g, doubleDoubleQuote);
	var spaceMarker = "<SP>";
	while (commandLine.indexOf(spaceMarker) > -1) spaceMarker += "@";
	var noSpacesInQuotes = noDoubleDoubleQuotes.replace(
		/"([^"]*)"?/g,
		(fullMatch, capture) => {
			return capture
				.replace(/ /g, spaceMarker)
				.replace(RegExp(doubleDoubleQuote, "g"), '"');
		}
	);
	var mangledParamArray = noSpacesInQuotes.split(/ +/);
	var paramArray = mangledParamArray.map((mangledParam) => {
		return mangledParam
			.replace(RegExp(spaceMarker, "g"), " ")
			.replace(RegExp(doubleDoubleQuote, "g"), "");
	});
	return paramArray;
}

module.exports = async (Discord, client, msg) => {
	if (msg.author.bot || msg.channel.type === "DM") return;
	let userMS;
	let serverDoc;
	await client.utils.loadGuildInfo(client, msg.guild).then(async (server) => {
		serverDoc = server;
		userMS = await client.utils.loadUserInfo(client, server, msg.author.id);
	});
	if (serverDoc === "err") return;

	if (!msg.author.bot) {
		if (!cooldowns[msg.author.id]) {
			cooldowns[msg.author.id] = 0;
		}

		const prevExp = userMS.atoms;
		if (cooldowns[msg.author.id] === 0) {
			let addProton = Math.floor(5 + Math.random() * 5);
			let addElectron = Math.floor(5 + Math.random());
			let addDarkMatter = Math.random() < 0.001 ? 1 : 0;
			[addProton, addElectron, addDarkMatter] = client.utils.manageUse.message(
				msg,
				userMS,
				addProton,
				addElectron,
				addDarkMatter
			);
			userMS.protons += addProton;
			userMS.electrons += addElectron;
			userMS.darkMatter += addDarkMatter;
			userMS.lifeExp += Math.floor(10 + addProton + addElectron * 2.5);
			cooldowns[msg.author.id] = 60;
		}
		let index = 1;
		for (let value of levelArr) {
			if (prevExp < value && userMS.lifeAtoms >= value) {
				msg.channel.send({
					content: `Level up! Your Singularity is now level **${index}**!`,
				});
			}
			index++;
		}

		await client.utils.updateUser(client, serverDoc.guildID, userMS.userID, {
			...userMS.toObject(),
			protons: userMS.protons,
			electrons: userMS.electrons,
			darkMatter: userMS.darkMatter,
			lifeExp: userMS.lifeExp,
		});
	}

	if (!msg.content.startsWith(".") || msg.author.bot) return;

	const args = splitCommandLine(msg.content.slice(1));
	const cmd = args.shift().toLowerCase();

	const command =
		client.commands.get(cmd) ||
		client.commands.find((a) => a.aliases && a.aliases.includes(cmd));
	if (!command) return;

	const warning = new Discord.MessageEmbed()
		.setColor(0x000000)
		.setTitle("Message-Based Command Deprecation")
		.setDescription(
			"Uhoh! It look like you're using Singularity's old message-based commands. **Message-based commands have been removed.** Please switch to using Singularity's brand-new slash commands!"
		);

	msg.author.send({ embeds: [warning] });
};