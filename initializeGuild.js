module.exports = (client, guildID) => {
  client.guildConfig[guildID] = {
    channels: {
      welcomeChannel: null,
      logChannel: null,
      serverStatsCategory: null,
      serverStatsChannel: null,
    },
    warnexpiration: 86400000,
    permissions: {
      moderation: [],
    },
    automod: [],
    prefix: '!',
    ticketMessage: null,
    ticketCategory: null,
    ticketsOpen: {},
    levels: [],
    levelRoles: [],
    levelSettings: {
      minTime: 100,
      maxTime: 200,
      minExp: 150,
      maxExp: 250,
      minCoins: 30,
      maxCoins: 70,
    },
  };
  client.cooldowns[guildID] = {}; client.db.config.updateOne({ id: guildID }, {
    $set: client.guildConfig[guildID],
  },
  { upsert: true });
};
