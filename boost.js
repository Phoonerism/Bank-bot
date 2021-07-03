const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'boost',
  description: 'boost',
  aliases: [],
  usage: 'boost @user/@channel/@role',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const boostTarget = message.mentions.users.first()
    || message.mentions.channels.first()
    || message.mentions.roles.first()
    || client.users.cache.get(msgArr[1])
    || message.guild.channels.cache.get(msgArr[1])
    || message.guild.roles.cache.get(msgArr[1]);
    if (!boostTarget) {
      let list = [];
      if (config.boost) {
        config.boost.forEach((item) => {
          const target = client.users.cache.get(item)
      || message.guild.channels.cache.get(item)
      || message.guild.roles.cache.get(item);
          if (target) {
            list.push(`> ${target}`);
          }
        });
      } else {
        list = '> None';
      }
      const embed = new MessageEmbed()
        .setTitle('Exp Boost')
        .setDescription(list);
      message.channel.send(embed);
      return;
    }
    const boostID = boostTarget.id;
    if (!config.boost) {
      config.boost = [];
    }
    const index = config.boost.indexOf(boostID);
    if (index >= 0) {
      config.boost.splice(index, 1);
      message.channel.send(`${boostTarget} has been removed from Boost!`);
    } else {
      config.boost.push(boostID);
      message.channel.send(`${boostTarget} has been Boosted!`);
    }
    await client.db.config.updateOne({ id: message.guild.id }, { $set: { boost: config.boost } }, { upsert: true });
  },
};
