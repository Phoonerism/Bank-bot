/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

module.exports = {
  name: 'coinflip',
  description: 'coinflip',
  aliases: ['cf', 'flip'],
  usage: 'coinflip <amount>',
  admin: false,
  execute: async (client, message) => {
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    if (isNaN(msgArr[1])) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    const flipAmount = parseInt(msgArr[1], 10);
    if (isNaN(flipAmount)) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    if (userdata) {
      if (userdata.coins < flipAmount) {
        message.channel.send(`You only have ${userdata.coins} coins!`);
        return;
      } if (flipAmount < 10) {
        message.channel.send('Minimum flip amount is 10 coins!');
        return;
      }

      if (Math.random() <= 0.50) {
        message.channel.send(`✅ ${message.author} You got ${flipAmount} 🪙 coins!! You now have ${userdata.coins + flipAmount} 🪙 coins!`);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: flipAmount } }, { upsert: true });
      } else {
        message.channel.send(`❌ ${message.author} You lost ${flipAmount} 🪙 coins!! You now only have ${userdata.coins - flipAmount} 🪙 coins!`);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: flipAmount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
