const TEMPLATES: string[] = ["NEWS", "BLOG", "CHANGELOG"];
const IGNORED_SITES: string[] = [
	"DOFUS_TOUCH",
	"ALLSKREEN",
	"KROSMOZ_WEBTOONS",
]; //full list of SITES_TEMPLATES in discord.ts
const JSON_PATH = "./data.json";
const COUNT = 15; //currently has to be less than 20 because haapi limitations

let knownIds: number[] = [];

export async function scrap() {
	const items: any[] = []; //FIXME
	for (const template of TEMPLATES) {
    // Using wildcard for site since "ALL" has a weird behavior
		const res = await fetch(`https://haapi.ankama.com/json/Ankama/v5/Cms/Items/Get?template_key=${template}&site=*&lang=fr&page=1&count=${COUNT}`);

		if (!res.ok) {
      // some providers are banned since 26.02.2024 => 403, might help to identify
			console.error(`Error while fetching: ${res.statusText} (${res.status})`);
			return [];
		}

		const results = await res.json();

		for (const item of results) { //FIXME
			for (const site of item.sites) {
				if (
					!IGNORED_SITES.includes(site) &&
					!items.includes(item) &&
					!knownIds.includes(+item.id)
				) {
					items.push(item);
				}
			}
		}
	}
	return items;
}

export async function add(id: number) {
	if (!knownIds.includes(+id)) {
		knownIds.push(+id);
		await save();
	}
}

export async function load() {
	const file = Bun.file(JSON_PATH);
	if (await file.exists()) {
		try {
			const content = await file.json();
			knownIds = content.items;
		} catch (error) {
			console.error(`Error while parsing JSON file: ${error}`);
			await save();
		}
	}
}

async function save() {
	const object = {
		items: knownIds,
	};
	await Bun.write(JSON_PATH, JSON.stringify(object));
	if (Bun.env.DEBUG) console.debug("Saved known items.");
}
