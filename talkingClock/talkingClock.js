const { spawnSync, exec } = require('child_process');
const toDayTime = time => (
  {
    hours: time.getHours() % 12 || 12,
    minutes: time.getMinutes()
  });

const main = () => {
  const now = new Date();
  const { hours, minutes } = toDayTime(now);
  const announcement = `The time is ${hours} ${minutes}`;
  say(announcement);
};

function say(announcement) {
  spawnSync('say', { input: announcement });
}
// main();

