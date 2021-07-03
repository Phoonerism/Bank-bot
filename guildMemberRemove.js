const Discord = require('discord.js');

exports.run = async (client, distube, member) => {
  if (!client.ready) return;

  const config = client.guildConfig[member.guild.id];
  if (!config.channels.logChannel) return;

  const embed = new Discord.MessageEmbed()
    .setTitle('**Member Removed**')
    .addField('Name', member.user.tag)
    .setColor('#A74C59')
    .setTimestamp()
    .setFooter(config.footer);
  client.channels.cache.get(config.channels.logChannel).send(embed);
};
