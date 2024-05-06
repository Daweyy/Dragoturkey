import { type ColorResolvable, EmbedBuilder, WebhookClient } from "discord.js";
import { type ICmsArticle, add } from "./haapi";

// color per template
const COLORS_TEMPLATES: Record<string, ColorResolvable> = {
	NEWS: "#40bb12",
	BLOG: "#1334c6",
	CHANGELOG: "#c61313",
};

// beautify site names (if not set, raw template is used)
const SITES_TEMPLATES: Record<string, string> = {
  ALLSKREEN: "AllSkreen",
  ANKAMA_EVENTS: "Ankama Events",
  BLOG_MODERATION_DOFUS: "Blog Modération Dofus",
  DOFUS: "Dofus",
  DOFUS_PETS: "Dofus Pets",
  DOFUS_RETRO: "Dofus Retro",
  DOFUS_THEMOVIE: "Dofus le Film",
  DOFUS_TOUCH: "Dofus Touch",
  FLYN: "Flynn",
  FLYNN: "Flynn",
  HEYHEYHEY: "HeyHeyHey",
  IG_MAGAZINE: "IG Magazine",
  KROSMAGA: "Krosmaga",
  KROSMATER: "Krosmaster",
  KROSMOZ_WEBTOONS: "Webtoons",
  LABEL619: "Label 619",
  LAUNCHER: "Launcher",
  LAUNCHER_KROSMOZ: "Krosmoz",
  MANGA_AKIBA: "Manga Akiba",
  MINI_WAKFU_MAG: "Mini Wakfu Mag",
  OMG: "OneMoreGate",
  SLAGE: "Slage",
  WAKFU: "Wakfu",
  WAKFU_SERIES: "Wakfu la Série",
  WAKFU_TCG: "Wakfu TCG",
  WAVEN: "Waven",
  ZAAP_FLYNN: "Flynn",
  ZAAP_GAME_DETAILS: "Zaap Game Details",
  ZAAP_MOBILE: "Zaap Mobile",
  ZAAP_PAGE_DOFUS: "Dofus",
  ZAAP_PAGE_DOFUSCUBE: "Waven",
  ZAAP_PAGE_DOFUSRETRO: "Dofus Retro",
  ZAAP_PAGE_KROSMAGE: "Krosmaga",
  ZAAP_PAGE_WAKFU: "Wakfu",
  ZAAP_SUPERNANOBLASTER: "SuperNanoBlaster",
};

export async function send(item: ICmsArticle, url: string, threadId: string) {
	try {
		const client = new WebhookClient({ url });

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
			.setColor(
				item.template_key ? COLORS_TEMPLATES[item.template_key] : "#000000",
			)
			.setFooter({ text: `${sites.join(", ")} (${item.template_key})` });

		if (item.baseline_raw !== null) {
			embed.setDescription(item.baseline_raw.slice(0, 2000));
		}

		await client.send({
			embeds: [embed],
			threadId: threadId,
		});
		await add(+item.id);
	} catch (error) {
		console.error(`Error while sending ${item.id} to Discord: ${error}`);
	}
}
