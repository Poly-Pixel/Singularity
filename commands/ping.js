module.exports = {
    name: 'ping',
    description: "Responds with the bot's latency and the API latency",
    defaultPermission: true,
    options: [],
    type: 'general',
    args: [],
    aliases: [],
    example: 'ping',
    execute(client, Discord, msg){
        const embed = new Discord.MessageEmbed()
        .setDescription(`🏓 Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        .setColor(0x000000);
        
        msg.channel.send({embeds: [embed]});
    },
    async slashExecute(client, Discord, interaction){
        await interaction.deferReply({ephemeral: true})
        const embed = new Discord.MessageEmbed()
        .setDescription(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        .setColor(0x000000);
        
        interaction.editReply({embeds: [embed]});
    }
}