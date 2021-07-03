const Discord = require('discord.js');

module.exports = async (client, distube, channel) => {
  if (!client.ready) return;

  const config = client.guildConfig[channel.guild.id];
  if (!config.channels.logChannel) return;

  const logs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' });
  const entry = logs.entries.find((e) => e.target.id === channel.id);

  const ChannelEmbed = new Discord.MessageEmbed()
    .setTitle('**Channel Created**')
    .setAuthor(entry.executor.tag, entry.executor.avatarURL())
    .addField('User', `${entry.executor.tag}`)
    .addField('Channel Name', `#${channel.name}`)
    .setColor('#EE33E4')
    .setTimestamp();
  client.channels.cache.get(config.channels.logChannel).send({ embed: ChannelEmbed });
};
