module.exports = {
    name: 'prefix',
    description: "Sets the prefix of the bot",
    type: 'mod',
    args: ['<new prefix>'],
    aliases: [],
    example: 'prefix ?',
    execute(client, Discord, msg, args, serverDoc){
      if(!args[0]){
        const embed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription('Please enter a prefix!');

        return msg.channel.send(embed);
      }

        if(msg.member.hasPermission('MANAGE_GUILD')){
          client.utils.updateServer(client, serverDoc, {prefix: args[0]}).then(() => {
            const embed = new Discord.MessageEmbed()
            .setColor(0x000000)
            .setDescription(`Prefix set to: \`${args[0]}\``);

            msg.channel.send(embed);
          });
        } else {
          const permsEmbed = new Discord.MessageEmbed()
          .setDescription('You do not have permissions to change my prefix!')
          .setColor(0x000000);
          
          msg.channel.send(permsEmbed);
        }
    }
}