module.exports = {
    name: 'bestmcseed',
    description: "Shows the best seed in Minecraft Bedrock Edition",
    type: 'general',
    execute(msg, Discord){
        const embed = new Discord.MessageEmbed()
        .setTitle('Best Minecraft Seeds')
        .setFooter(`Best Minecraft seeds requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
        .setColor(0x000000)
        .setDescription('sioma1');
        
        msg.channel.send(embed);
    }
}