const Discord = require('discord.js');

module.exports = (client, distube, messageDeleted) => {
  if (!client.ready) return;

  const config = client.guildConfig[messageDeleted.guild.id];
  if (!config.channels.logChannel) return;

  if (messageDeleted.author) {
    if (messageDeleted.author.bot) { return; }
    const DeleteEmbed = new Discord.MessageEmbed()
      .setTitle('**MESSAGE DELETED!**')
      .setColor('#EE33E4')
      .addField('User', messageDeleted.author.tag)
      .addField('Channel', messageDeleted.channel)
      .addField('Message', messageDeleted.content)
      .setTimestamp()
      .setFooter(`ID: ${messageDeleted.author.id}`);
    const messageSend = messageDeleted.guild.channels.cache.get(config.channels.logChannel);
    messageSend.send({ embed: DeleteEmbed });
  }
};
