module.exports = {
  name: "info",
  description: "Provides information on My Singularity Prestige",
  options: [],
  example: "ms prestige info",
  async slashExecute(client, Discord, interaction, serverDoc) {
    await interaction.deferReply({ ephemeral: true });

    let userMS = await client.utils.loadUserInfo(
      client,
      serverDoc,
      interaction.user.id
    );
    let baseReq =
      (userMS.singularity.prestige + 2) *
      ((userMS.singularity.prestige + 2) * 2);

    const embed = new client.utils.BaseEmbed(
      "Singularity Prestige",
      interaction.user
    ).setDescription(
      `
			Is your Singularity so big that the universe is beginning to collapse in on itself? If so, it may be time to prestige.

			**What is Singularity Prestige?**
			Singularity Prestige is your way to massively upgrade your Singularity. When your Singularity gets too powerful, it begins to have negative effects on itself. By prestiging, you can stop your Singularity from dying and condense its power into something your new Singularity can use.

			**Requirements:**
			You have prestiged **${
        userMS.singularity.prestige
      }** times, so your next prestige will cost you:
			- **${baseReq * 125000}** Protons
			- **${baseReq * 41666}** Electrons
			- **${baseReq * 6}** Dark Matter

			**Effects:**
			This prestige will get you **${
        userMS.singularity.prestige + 2
      }** random items from the Rare Items list (\`${
        serverDoc.prefix
      }ms rare\`), as well as a new type of Singularity
		
			*Your Lifetime Experience will not be affected*
			`
    );

    return interaction.editReply({ embeds: [embed] });
  },
};
