import cron from "node-cron";
import { send } from "./discord";
import { load, scrap } from "./haapi";
import config from "./config.toml";

console.info("Dragoturkey booting up");
setTimezone(config.timezone);
await load();
setScheduler(config.schedule);

if (config.debug) {
	console.info("[DEBUG] Running tasks immediately");
	await run();
}

async function run() {
	const items = await scrap();
	for (const item of items) {
		console.info(
			`[${item.template_key}][${item.sites}] ${item.name} (${item.id})`,
		);
		for (const server of config.servers) {
      let site = item.sites.find((site) => server[site]);
      // Needed hack cause DOFUS_RETRO also has DOFUS in his sites
      if (item.sites.includes("DOFUS_RETRO")) {
        site = "DOFUS_RETRO"
      }
			if (site) {
				await send(item, server.webhook, server[site]);
			} else if (server.others) {
				await send(item, server.webhook, server.others);
			} else {
				if (config.debug) {
					console.debug(`No channel set in ${server.name} for ${item.sites}`);
				}
			}
		}
		if (items.length === 0 && config.debug) {
			console.debug("No new items");
		}
	}
}

function setTimezone(timezone = "Europe/Paris") {
	process.env.TZ = timezone;
}

function setScheduler(schedule: { name: string; cron: string }[]) {
	console.info("Setting up scheduler");
	for (const task of schedule) {
		console.info(`Task ${task.name} scheduled`);
		cron.schedule(task.cron, async () => {
			await run();
		});
	}
}
