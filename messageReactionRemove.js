module.exports = (client, distube, reaction, user) => {
  if (!client.ready) return;

  if (user.bot) { return; }
  if (client.reactrolelocal) {
    const reactRoleObj = client.reactrolelocal.find((item) => item.id === reaction.message.id);
    if (reactRoleObj) {
      const selectedEmoji = reactRoleObj.roles[reaction.emoji.id || reaction.emoji.name];
      if (selectedEmoji) {
        client.guilds.cache.get(reaction.message.guild.id).members.cache.get(user.id).roles.remove(selectedEmoji.roleId);
      }
    }
  }
};
