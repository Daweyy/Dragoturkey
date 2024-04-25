import { type ColorResolvable, EmbedBuilder, WebhookClient } from "discord.js";
import { add } from "./haapi";

const client = new WebhookClient({
	url: process.env.DISCORD_WEBHOOK_URL || "",
});

//in case you want to change the colors
const COLORS_TEMPLATES: Record<string, ColorResolvable> = {
	NEWS: "#40bb12",
	BLOG: "#1334c6",
	CHANGELOG: "#c61313",
};

//because we want beautiful names
const SITES_TEMPLATES: Record<string, string> = {
	DOFUS_TOUCH: "Dofus Touch",
	WAKFU: "Wakfu",
	ZAAP_PAGE_WAKFU: "Wakfu",
	DOFUS: "Dofus",
	ZAAP_PAGE_DOFUS: "Dofus",
	ZAAP_PAGE_DOFUSCUBE: "Waven",
	WAVEN: "Waven",
	LAUNCHER: "Launcher",
	OMG: "OneMoreGate",
	ZAAP_PAGE_DOFUSRETRO: "Dofus Retro",
	ALLSKREEN: "AllSkreen",
	KROSMOZ_WEBTOONS: "Webtoons",
	LAUNCHER_KROSMOZ: "Krosmoz",
	KROSMAGA: "Krosmaga",
	ZAAP_PAGE_KROSMAGE: "Krosmaga",
	ZAAP_MOBILE: "Zaap Mobile",
	ZAAP_GAME_DETAILS: "Zaap Game Details",
	ZAAP_SUPERNANOBLASTER: "SuperNanoBlaster",
	ZAAP_FLYNN: "Flynn",
	KROSMATER: "Krosmaster",
	LABEL619: "Label 619",
	HEYHEYHEY: "HeyHeyHey",
	DOFUS_PETS: "Dofus Pets",
	DOFUS_THEMOVIE: "Dofus le Film",
	BLOG_MODERATION_DOFUS: "Blog Modération Dofus",
	IG_MAGAZINE: "IG Magazine",
	WAKFU_SERIES: "Wakfu la Série",
	FLYN: "Flynn",
	ANKAMA_EVENTS: "Ankama Events",
	SLAGE: "Slage",
	MINI_WAKFU_MAG: "Mini Wakfu Mag",
	MANGA_AKIBA: "Manga Akiba",
	WAKFU_TCG: "Wakfu TCG",
};

export async function send(item: {
	name: string;
	canonical_url: string;
	image_url: string;
	template_key: string;
	timestamp: number;
	baseline_raw: string;
	id: number;
	sites: string[];
}) {
	try {
		const sites: string[] = [];
		for (const site of item.sites) {
			if (!sites.includes(SITES_TEMPLATES[site] || site)) {
				sites.push(SITES_TEMPLATES[site] || site);
			}
		}
		const embed = new EmbedBuilder()
			.setTimestamp(item.timestamp * 1000)
			.setTitle(item.name || "Untitled")
			.setURL(item.canonical_url)
			.setImage(item.image_url)
			.setColor(COLORS_TEMPLATES[item.template_key])
			.setFooter({ text: `${sites.join(", ")} (${item.template_key})` });

		if (item.baseline_raw !== null) {
			embed.setDescription(item.baseline_raw.slice(0, 2000));
		}

		await client.send({
			embeds: [embed],
		});
		await add(item.id);
	} catch (error) {
		console.error(`Error while sending ${item.id} to Discord: ${error}`);
	}
}
