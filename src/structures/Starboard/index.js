const { Message, MessageEmbed, MessageReaction, TextChannel, Client } = require('discord.js');
const Util = require('../../Util');

/**
 * Create starboard system.
 */

class Starboard {
    constructor() {
        this.client = null;
        this.channel = null;
        this.emoji = '⭐';
        this.number = 5;
        this.embed = new MessageEmbed().setDescription('{description}');

        this.started = false;
    };

    /**
     * Send the starboard message.
     * @private
     * @param {MessageReaction} reaction The reaction
     * @returns {Message}
     */

    send(reaction) {
        if (!reaction) throw new RangeError('[STARBOARD] Reaction not provided.');

        return this.client.channels.cache.get(this.channel).send({embeds: [this.embed
        .setAuthor({ name: reaction.message.author.tag, iconURL: reaction.message.author.displayAvatarURL({ dynamic: true })})
        .setDescription(this.embed.description ? this.embed.description.replace('{description}', reaction.message.content.slice(0, 2048 - this.embed.description.length)) : reaction.message.content.slice(0, 2048))
        .setImage(reaction.message.attachments.first() ? reaction.message.attachments.first().proxyURL : null)
        ]})
        .catch();
    };

    /**
     * Set the TextChannel ID.
     * @param {String} channel 
     * @returns {Starboard}
     */

    setChannelId(channel) {
        if (!channel) throw new RangeError('[STARBOARD] Channel not provided.');
        if (!Util.verifType(channel, 'string')) throw new TypeError('[STARBOARD] Channel must be a non-empty string.');

        this.channel = channel;

        return this;
    };

    /**
     * Set the embed.
     * @param {MessageEmbed} embed The embed
     * @returns {Starboard}
     */

    setEmbed(embed) {
        if (!embed) throw new RangeError('[STARBOARD] Embed not provided.');

        this.embed = embed;

        return this;
    };

    /**
     * Set the emoji.
     * @param {String} emoji The emoji
     * @returns {Starboard}
     */

    setEmoji(emoji) {
        if (!emoji) throw new RangeError('[STARBOARD] Emoji not provided.');
        if (!Util.verifType(emoji, 'string')) throw new TypeError('[STARBOARD] Emoji must be a non-empty string.');

        this.emoji = emoji;

        return this;
    };

    /**
     * Set the required number of emojis.
     * @param {Number} number The number
     * @returns {Starboard}
     */

    setNumber(number) {
        if (!number) throw new RangeError('[STARBOARD] Number not provided.');
        if (!Util.verifType(number, 'number')) throw new TypeError('[STARBOARD] Number must be a non-null number.');

        this.number = number;

        return this;
    }

    /**
     * Start the starboard. 
     * @param {Client} client The client
     * @returns {Starboard}
     */

    start(client) {
        if (!client) throw new RangeError('[STARBOARD] Client not provided.');
        if (!Util.isClient(client)) throw new Error('[STARBOARD] Client is inaccessible.');
        if (this.started) throw new Error('[STARBOARD] Starboard is already started.');

        this.client = client;
        this.started = true;

        if (!this.channel) throw new Error('[STARBOARD] Channel not provided.');
        if (!Util.getChannel(this.client, this.channel)) throw new TypeError('[STARBOARD] Channel isn\'t in the cache.');


        this.client.on('messageReactionAdd', (reaction, user) => {
            if (!user.bot && !reaction.message.author.bot && reaction.message.reactions.cache.filter((r) => r.name === this.reaction).size === this.number) {
                this.send(reaction);
            };
        });

        return this;
    };
};

module.exports = Starboard;