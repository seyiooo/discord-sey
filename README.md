# Discord-Sey
An easy multi-tool package for Discord.JS v13.

# Pagination
Create a customizable MessageEmbeds pagination.

## Quick Start
You just have to import the functions as well:
```js
// Import the functions
const { Pagination } = require('discord-sey');
```

### Example
```js
// Import the functions
const { Client, MessageEmbed } = require('discord.js');
const { Pagination } = require('discord-sey');

// Create a Client
const client = new Client({
    intents: 32767,
    partials: [
        'MESSAGE',
        'CHANNEL'
    ]
});

// Register the messageCreate event
client.on('messageCreate', message => {
    const embeds = [
        new MessageEmbed() // The first page
        .setTitle('Page 1'),
        new MessageEmbed() // The second page
        .setTitle('Page 2')
    ];
    
    const pages = new Pagination()
    .setPages(embeds) // The pages (required)
    .addPage(new MessageEmbed().setTitle('Page 3')) // Add one page (optional)
    .addPages([new MessageEmbed().setTitle('Page 4'), new MessageEmbed().setTitle('Page 5')]) // Add more pages (optional)
    .setEmojis(['⏪', '⏩']) // The previous and next buttons (optional)
    .setTimeout(60000) // 2 minutes timeout (optional)
    .addTimeout(60000) // Add timeout (optional)
    .setStyle('SECONDARY') // The buttons style (optional)
    .start(message) // Create the pagination (required)
    .catch((e) => console.log(e)); // Log errors in the console (recommended)
});

// Log-in the Client
client.login('TOKEN');
```
