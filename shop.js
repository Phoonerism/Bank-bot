/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
const { MessageEmbed } = require('discord.js');

const banners = [
  'https://media.discordapp.net/attachments/821770819671031839/822433530877181962/banner0.png?width=1440&height=432',
  'https://media.discordapp.net/attachments/821436680027373578/821758935496654858/image0.png?width=1440&height=540',
  'https://media.discordapp.net/attachments/821436680027373578/821758936083595264/image1.png',
  'https://media.discordapp.net/attachments/821436680027373578/821758936293179412/image2.png',
  'https://media.discordapp.net/attachments/821436680027373578/821758936688361472/image3.png?width=1202&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821758937367314433/image4.png?width=1013&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821758937917423626/image5.png?width=1202&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821758938440532064/image6.png?width=1202&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821758939309670400/image7.png?width=1082&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821758939838414868/image8.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758940085092412/image9.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758942925422621/image0.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758943130812436/image1.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758943336071168/image2.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758943587598389/image3.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758943781060608/image4.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758944207962163/image5.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758944421740554/image6.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758944636698685/image7.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758944925843496/image8.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821758945445543946/image9.jpg',
  'https://media.discordapp.net/attachments/821436680027373578/821759391060459570/image0.jpg?width=956&height=676',
  'https://media.discordapp.net/attachments/821436680027373578/821759391539527690/image1.png?width=1202&height=676',
];

module.exports = {
  name: 'shop',
  description: 'shop',
  aliases: [],
  usage: 'shop',
  admin: true,
  execute: async (client, message) => {
    let index = 0;
    const embed = new MessageEmbed()
      .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(banners[index])
      .setFooter('Price: 5000 💵');
    const shop = await message.channel.send(embed);
    await shop.react('⏪');
    await shop.react('◀️');
    await shop.react('💵');
    await shop.react('▶️');
    await shop.react('⏩');

    const filter = (r, u) => u.id === message.author.id;
    while (true) {
      const collected = await shop.awaitReactions((filter), {
        max: 1,
        time: 1000 * 300,
      });
      const reaction = collected.first();
      if (!reaction) {
        shop.delete();
        break;
      }
      if (reaction.emoji.name === '⏪') {
        index = 0;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
          .setImage(banners[index]);
        shop.edit(embed);
      } else if (reaction.emoji.name === '◀️' && index > 0) {
        index -= 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
          .setImage(banners[index]);
        shop.edit(embed);
      } else if (reaction.emoji.name === '▶️' && index < banners.length - 1) {
        index += 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
          .setImage(banners[index]);
        shop.edit(embed);
      } else if (reaction.emoji.name === '⏩') {
        index = banners.length - 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
          .setImage(banners[index]);
        shop.edit(embed);
      } else if (reaction.emoji.name === '💵') {
        shop.delete();
        const userdata = await client.db.userdata.findOne({ id: message.author.id });
        if (userdata.coins > 5000) {
          userdata.banner = index;
          message.channel.send(`${message.author}, You have successfully changed your banner!`);
          client.db.userdata.updateOne({ id: message.author.id },
            {
              $set: {
                banner: index,
              },
              $inc: {
                coins: -5000,
              },
            });
          return;
        }
        message.channel.send(`${message.author}, You don't have enought coins!!`);
        return;
      }
      reaction.users.remove(message.author.id);
    }
  },
};
