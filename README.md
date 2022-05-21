<div align="center"><h1>Discord-Sey</h1></div>
An easy multi-tool package for Discord.JS v13 !
The package is not finished, if you find a bug, contact sey.#4485 !

# Summary
- [Install](#install)
- [MemberCount](#membercount)
- [Pagination](#pagination)
- [Starboard](#starboard)
- [TempVoc](#tempvoc)

# Requirements
- [Node](https://nodejs.org/en/) - 16.15.0
- [NPM](https://www.npmjs.com/) - 8.5.5

# Installation
To install the package, execute this command in the terminal:
```bash
npm install discord-sey
```

# MemberCount
Create a customizable MemberCount !

## Quick Start
You just have to import the functions as well:
```js
// Import the functions
const { MemberCount } = require('discord-sey');
```

### Example
```js
// Import the functions
const { Client } = require('discord.js');
const { MemberCount } = require('discord-sey');

// Create a Client
const client = new Client({
    intents: 32767,
    partials: [
        'MESSAGE',
        'CHANNEL'
    ]
});

// Register the ready event
client.on('ready', () => {
    new MemberCount()
    .setMemberChannelId('id') // Set the MemberChannel ID (optional)
    .setBotChannelId('id') // Set the BotChannel ID (optional)
    .setBoostChannelId('id') // Set the BoostChannel ID (optional)
    .start(client) // Create the MemberCount (required)
});

// Log-in the Client
client.login('TOKEN');
```

# Pagination
Create a customizable MessageEmbeds pagination !

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
    .setPages(embeds) // Set the pages (required)
    .addPage(new MessageEmbed().setTitle('Page 3')) // Add one page (optional)
    .addPages([new MessageEmbed().setTitle('Page 4'), new MessageEmbed().setTitle('Page 5')]) // Add more pages (optional)
    .setEmojis(['⏪', '⏩']) // Set the previous and next buttons (optional, default: ['⬅️', '➡️'])
    .setTimeout(60000) // 2 minutes timeout (optional, default: null)
    .addTimeout(60000) // Add timeout (optional)
    .setStyle('SECONDARY') // Set the buttons style (optional, default: "PRIMARY")
    .start(message) // Create the pagination (required)
});

// You also can do the same thing with interactionCreate event
client.on('interactionCreate', interaction => {
    const embeds = [
        new MessageEmbed() // The first page
        .setTitle('Page 1'),
        new MessageEmbed() // The second page
        .setTitle('Page 2')
    ];
    
    const pages = new Pagination()
    .setPages(embeds) // Set the pages (required)
    .addPage(new MessageEmbed().setTitle('Page 3')) // Add one page (optional)
    .addPages([new MessageEmbed().setTitle('Page 4'), new MessageEmbed().setTitle('Page 5')]) // Add more pages (optional)
    .setEmojis(['⏪', '⏩']) // Set the previous and next buttons (optional, default: ['⬅️', '➡️'])
    .setTimeout(60000) // One minute timeout (optional, default: null)
    .addTimeout(60000) // Add timeout (optional)
    .setStyle('SECONDARY') // Set the buttons style (optional, default: "PRIMARY")
    .start(interaction) // Create the pagination (required)

    if (message.content.startsWith('!previous')) pages.previous(); // Pagination by commands (optional)

    if (message.content.startsWith('!next')) pages.next(); // Pagination by commands (optional)

    if (message.content.startsWith('!end')) pages.end(); // End the pagination (optional)

    if (message.content.startsWith('!delete')) pages.delete(); // Delete the pagination (optional)
});

// Log-in the Client
client.login('TOKEN');
```

# Starboard
Create a customizable Starboard !

## Quick Start
You just have to import the functions as well:
```js
// Import the functions
const { Starboard } = require('discord-sey');
```

### Example
```js
// Import the functions
const { Client, MessageEmbed } = require('discord.js');
const { Starboard } = require('discord-sey');

// Create a Client
const client = new Client({
    intents: 32767,
    partials: [
        'MESSAGE',
        'CHANNEL'
    ]
});

// Register the ready event
client.on('ready', () => {
    const embed = new MessageEmbed() // The embed
    .setTitle('Starboard')
    .setDescription('➡️ {description}') // {description} represent the message content
    
    new Starboard()
    .setChannelId('id') // Set the channel ID (required)
    .setEmbed(embed) // Set the embed (optional)
    .setEmoji('🌟') // Set the emoji (optional, default: "⭐")
    .setNumber(10) // Set the required number of emojis (optional, default: 5)
    .start(client) // Create the starboard (required)
});

// Log-in the Client
client.login('TOKEN');
```

# TempVoc
Create a customizable TempVoc !

## Quick Start
You just have to import the functions as well:
```js
// Import the functions
const { TempVoc } = require('discord-sey');
```

### Example
```js
// Import the functions
const { Client } = require('discord.js');
const { TempVoc } = require('discord-sey');

// Create a Client
const client = new Client({
    intents: 32767,
    partials: [
        'MESSAGE',
        'CHANNEL'
    ]
});

// Register the ready event
client.on('ready', () => {
    const name = '{user}\'s Lounge'; // {user} represent the username

    new TempVoc()
    .setChannelId('id') // Set the channel ID (required)
    .setCategoryId('id') // Set the category ID (required)
    .setName(name) // Set the embed (optional, default: "{user}'s Channel")
    .start(client) // Create the starboard (required)
});

// Log-in the Client
client.login('TOKEN');
```
