const createTicket = require('../utils/ticket/createTicket');
const deleteTicket = require('../utils/ticket/deleteTicket');

module.exports = (client, distube, reaction, user) => {
  if (!client.ready) return;

  if (user.bot) { return; }

  const config = client.guildConfig[reaction.message.guild.id];

  if (client.reactrolelocal) {
    const reactRoleObj = client.reactrolelocal.find((item) => item.id === reaction.message.id);
    if (reactRoleObj) {
      const selectedEmoji = reactRoleObj.roles[reaction.emoji.id || reaction.emoji.name];
      if (selectedEmoji) {
        client.guilds.cache.get(reaction.message.guild.id).members.cache.get(user.id).roles.add(selectedEmoji.roleId);
      }
    }
  }

  if (reaction.message.id === config.ticketMessage) {
    createTicket(client, config, reaction, user);
  } else if (config.ticketsOpen[reaction.message.channel.id] !== undefined) {
    deleteTicket(client, config, reaction, user);
  }
};
