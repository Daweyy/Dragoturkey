const TEMPLATES: String[] = ['NEWS', 'BLOG', 'CHANGELOG'];
const IGNORED_SITES: String[] = ['DOFUS_TOUCH', 'ALLSKREEN', 'KROSMOZ_WEBTOONS'];
const JSON_PATH = './data.json';
const COUNT = 15;

let knownIds: any[] = [];

export async function scrap() {
  let items: any[] = [];
  for (const template of TEMPLATES) {
    const res = await fetch(`https://haapi.ankama.com/json/Ankama/v5/Cms/Items/Get?template_key=${template}&site=ALL&lang=fr&page=1&count=${COUNT}`);
    const results = await res.json();
    for (const item of results) {
      for (const site of item.sites) {
        if (!IGNORED_SITES.includes(site) && !items.includes(item) && !knownIds.includes(+item.id)) {
          items.push(item);
        }
      }
    }
  }
  return items;
}

export async function add(id: Number) {
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
    'items': knownIds
  };
  await Bun.write(JSON_PATH, JSON.stringify(object));
  console.debug(`Saved known items.`);
}