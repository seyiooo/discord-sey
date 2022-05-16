# Discord-Sey
An easy multi-tool package for Discord.JS v13.

# Pagination
## Quick Start
You just have to import the functions as well:
```js
const { Pagination, createPagination } = require('discord-sey');
// Import functions
```

### Example
```js
const { Client, MessageEmbed } = require('discord.js');
const { Pagination, createPagination } = require('discord-sey');

const client = new Client({
    intents: 32767,
    partials: [
        'MESSAGE',
        'CHANNEL'
    ]
});

client.on('message', message => {
    const embeds = [
        new MessageEmbed() // The first page
        .setTitle('Page 1'),
        new MessageEmbed() // The second page
        .setTitle('Page 2')
    ];
    
    const pages = new Pagination()
    .setPages(embeds) // The pages
    .setEmojis(['⏪', '⏩']) // The previous and next buttons (optional)
    .setTimeout(60000); // 2 minutes timeout (optional)
    
    createPagination(message, pages); // Create the pagination
});
```
