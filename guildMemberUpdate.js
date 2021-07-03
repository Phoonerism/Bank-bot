const Discord = require('discord.js');

module.exports = async (client, distube, oldMember, newMember) => {
  if (!client.ready) return;

  const config = client.guildConfig[newMember.guild.id];
  if (!config.channels.logChannel) return;

  // declare changes
  const { guild } = newMember;
  const Changes = {
    unknown: 0,
    addedRole: 1,
    removedRole: 2,
    username: 3,
    nickname: 4,
    avatar: 5,
  };
  let change = Changes.unknown;

  // check if roles were removed
  let removedRole = '';
  oldMember.roles.cache.forEach((value) => {
    if (newMember.roles.cache.get(value.id) == null) {
      change = Changes.removedRole;
      removedRole = value.name;
    }
  });

  // check if roles were added
  let addedRole = '';
  newMember.roles.cache.forEach((value) => {
    if (oldMember.roles.cache.get(value.id) == null) {
      change = Changes.addedRole;
      addedRole = value.name;
    }
  });

  // check if username changed
  if (newMember.user.username !== oldMember.user.username) {
    change = Changes.username;
  }
  // check if nickname changed
  if (newMember.nickname !== oldMember.nickname) {
    change = Changes.nickname;
  }
  // check if avatar changed
  if (newMember.user.avatarURL !== oldMember.user.avatarURL) {
    change = Changes.avatar;
  }
  // post in the guild's log channel
  const ChangeEmbed = new Discord.MessageEmbed()

    .setColor('#EE33E4')
    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(`Bruker ID: ${newMember.user.id}`);

  const log = guild.channels.cache.get(config.channels.logChannel);
  if (log != null) {
    switch (change) {
      case Changes.unknown:
        log.send(`**[User Update]** ${newMember}`);
        break;
      case Changes.addedRole:
        ChangeEmbed.setTitle(newMember.displayName, '**UPDATE**')
          .setDescription('Role Added')
          .addField('Role', addedRole);
        break;
      case Changes.removedRole:
        ChangeEmbed.setTitle(newMember.displayName, '**UPDATE**')
          .setDescription('Role Removed')
          .addField('Role', removedRole);
        break;
      case Changes.username:
        ChangeEmbed.addField('Old', oldMember.user.discriminator)
          .addField('New', newMember.user.discriminator)
          .setTitle('**UPDATE**');
        break;
      case Changes.nickname:
        ChangeEmbed.addField('Old', oldMember.displayName)
          .addField('New', newMember.displayName)
          .setTitle('**UPDATE**');
        break;
      case Changes.avatar:
        log.send(`**[Avatar Changed]** ${newMember}`);
        break;
      default:
        break;
    }
    log.send({ embed: ChangeEmbed });
  }
};
