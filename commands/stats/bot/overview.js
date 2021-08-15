const prettyMS = require("pretty-ms");
const os = require("os-utils");
module.exports = {
  name: "overview",
  description: "An overview of Singularity's statistics",
  options: [],
  async slashExecute(client, Discord, interaction) {
    await interaction.deferReply({ ephemeral: true });
    os.cpuUsage((percentage) => {
      client.userModel.distinct("userID").exec((err, count) => {
        if (err) throw err;

        const currentDate = new Date(Date.now());
        const embed = new Discord.MessageEmbed()
          .setColor(0x000000)
          .setTitle("Singularity - Bot Stats")
          .setDescription("Various statistics about Singularity")
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter(
            `Singularity Bot Stats requested by ${
              interaction.user.tag
            } • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,
            interaction.user.displayAvatarURL()
          )
          .addFields([
            {
              name: "Uptime",
              value: `${prettyMS(os.processUptime() * 1000, {
                verbose: true,
              })}`,
              inline: true,
            },
            {
              name: "Latency",
              value: `
						Bot Latency: **${Date.now() - interaction.createdTimestamp}** ms
						API Latency: **${Math.round(client.ws.ping)}** ms
					`,
              inline: true,
            },
            {
              name: "System",
              value: `
						CPU Usage: **${Math.round((percentage * 100) / os.cpuCount())}%**
						Memory Usage: **${
              Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100
            }** MB
					`,
              inline: true,
            },
            {
              name: "Stats",
              value: `
						Number of Servers: **${client.guilds.cache.size}**
						Number of Users: **${count.length}**
					`,
              inline: true,
            },
          ]);

        interaction.editReply({ embeds: [embed] });
      });
    });
  },
};