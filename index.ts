import { scrap, load } from './haapi';
import { send } from './discord';
import cron from 'node-cron';

console.info('Dragoturkey is starting ...');
await load();
console.info('Loaded known items.');
Bun.env.TZ = 'Europe/Paris';

cron.schedule('* 6-21 * * 1-5', async () => {
  console.log('Every minute between 6:00 and 21:00 on Monday to Friday');
  await run();
});
cron.schedule('*/5 1,2,3,4,5,22,23 * * 1-5', async () => {
  console.log('Every 5 minutes between 1:00 and 5:00 and between 22:00 and 23:00 on Monday to Friday');
  await run();
});
cron.schedule('*/5 * * * 6,7', async () => {
  console.log('Every 5 minutes on Saturday and Sunday');
  await run();
});
console.info('Tasks.');

async function run() {
  const items = await scrap();
  items.forEach(async (item: any) => {
    await send(item);
    console.log(`[${item.template_key}][${item.sites}] ${item.name} (${item.id})`);
  });
  if (items.length === 0) {
    console.debug(`No new items.`);
  }
}