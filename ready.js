const lt = require('long-timeout');
const voiceExp = require('../utils/voice/voiceExp');
const mongoUtil = require('../mongoUtil.js');
const resumeMute = require('../utils/resume/resumeMute');
const resumeBan = require('../utils/resume/resumeBan');
const resumeGiveaways = require('../utils/resume/resumeGiveaways');
const resumeServerStats = require('../utils/resume/resumeServerStats');
const resumeLeaderboards = require('../utils/resume/resumeLeaderboards');
const fetchGuildConfigs = require('../utils/fetchGuildConfigs');

module.exports = async (client) => {
  await mongoUtil.connectDB(client);

  client.reactrolelocal = await client.db.reactrole.find().toArray();
  client.guildConfig = {};
  client.mutes = {};
  client.bans = {};
  client.giveaways = {};
  client.leaderboards = {};

  await fetchGuildConfigs(client);
  await resumeMute(client);
  await resumeBan(client);
  await resumeGiveaways(client);
  await resumeServerStats(client);
  await resumeLeaderboards(client);
  await voiceExp(client);

  const last = new Date();
  const remainingTimeDaily = (1000 * 60 * 60 * 24) - (last.getTime() - (Math.floor((last.getTime()) / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)));
  const remainingTimeWeekly = (1000 * 60 * 60 * 24 * 7) - (last.getTime() - (Math.floor((last.getTime()) / (1000 * 60 * 60 * 24 * 7)) * (1000 * 60 * 60 * 24 * 7)));
  const remainingTimeMonthly = (1000 * 60 * 60 * 24 * 30) - (last.getTime() - (Math.floor((last.getTime()) / (1000 * 60 * 60 * 24 * 30)) * (1000 * 60 * 60 * 24 * 30)));

  const dailyReset = (time) => lt.setTimeout(() => {
    client.db.userdata.updateMany({}, {
      $set: {
        daily: 0,
      },
    });
    dailyReset(1000 * 60 * 60 * 24);
  }, time);

  const weeklyReset = (time) => lt.setTimeout(() => {
    client.db.userdata.updateMany({}, {
      $set: {
        weekly: 0,
      },
    });
    weeklyReset(1000 * 60 * 60 * 24 * 7);
  }, time);

  const monthlyReset = (time) => lt.setTimeout(() => {
    client.db.userdata.updateMany({}, {
      $set: {
        monthly: 0,
      },
    });
    monthlyReset(1000 * 60 * 60 * 24 * 30);
  }, time);

  await dailyReset(remainingTimeDaily);
  await weeklyReset(remainingTimeWeekly);
  await monthlyReset(remainingTimeMonthly);

  client.ready = true;
  console.log('Bot is Ready');
};
