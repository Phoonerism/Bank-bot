const Discord = require('discord.js');

module.exports = async (client, distube, oldMessage, newMessage) => {
  if (!client.ready) return;

  const config = client.guildConfig[oldMessage.guild.id];
  if (!config.channels.logChannel) return;

  if (newMessage.content && oldMessage.content && oldMessage.author) {
    const DeleteEmbed = new Discord.MessageEmbed()
      .setTitle('**Message Edit**')
      .setColor('#EE33E4')
      .addField('Channel', oldMessage.channel)
      .addField('User', newMessage.author.tag)
      .addFields(
        { name: 'Old Message', value: oldMessage.content, inline: true },
        { name: 'New Message', value: newMessage.content, inline: true },
      )
      .setTimestamp()
      .setFooter(`ID: ${newMessage.author.id}`);
    const message = newMessage.guild.channels.cache.get(config.channels.logChannel);
    message.send({ embed: DeleteEmbed });
  }
};
