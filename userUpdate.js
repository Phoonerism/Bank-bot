/* eslint-disable global-require */
const Discord = require('discord.js');

module.exports = async (client, distube, oldUser, newUser) => {
  if (!client.ready) return;

  const config = client.guildConfig[oldUser.guild.id];
  if (!config.channels.logChannel) return;

  const userUpdate = new Discord.MessageEmbed()
    .setTitle('User Update')
    .setColor('#EE33E4')
    .addFields(
      { name: 'Old Username', value: oldUser.username, inline: true },
      { name: 'New Username', value: newUser.username, inline: true },
    )
    .setTimestamp()
    .setFooter(`ID: ${newUser.id}`);
  const message = client.guilds.cache.get(config.serverID).channels.cache.get(config.channels.logChannel);
  message.send({ embed: userUpdate });
};
