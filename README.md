# Dragoturkey
A news aggregator using Ankama Games's API.

New items will be posted on your Webhook

About config.toml :
- Webhook must be set on a [Discord Forum Channel](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ)
- As many distincts servers as you want can be set
- Create a forum post for each template you wanna follow (and one for others if you want it)
- Set their IDs and names (template list in discord.ts)
- Feel free to customize schedules

First launch will post all items, then only new ones will be posted.


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

This project was created with [Bun](https://bun.sh) a fast all-in-one JavaScript runtime.