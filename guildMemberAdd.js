const generateWelcome = require('../utils/generateWelcome');

module.exports = async (client, distube, member) => {
  if (!client.ready) return;

  const config = client.guildConfig[member.guild.id];

  // SEND WELCOME
  const attachment = await generateWelcome(member.user, member.guild.name);
  const welcomeChannel = member.guild.channels.cache.get(config ? config.channels.welcomeChannel : null);
  welcomeChannel.send(attachment);

  // RESUME MUTE
  const currentDate = Date.now();
  const mute = await client.db.mute.findOne({ id: member.id });
  if (mute) {
    const remainingDuration = mute.duration - (currentDate - mute.start);
    if (remainingDuration < 0) {
      member.roles.remove('771253782809411614');
      client.db.mute.deleteOne({ id: mute.id });
    } else {
      member.roles.add('771253782809411614');
    }
  }
};
