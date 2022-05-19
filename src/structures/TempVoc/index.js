const { Client, VoiceChannel, GuildMember } = require('discord.js');
const Util = require('../../Util');

/**
 * Create temporary voice channel system.
 */

class TempVoc {
    constructor() {
        this.channel = null;
        this.category = null;
        this.name = '{user}\'s Channel';
        
        this.client = null;
        this.channels = new Set();
        this.started = false;
    };

    /**
     * Move a GuildMember.
     * @private
     * @param {GuildMember} member The member
     * @param {VoiceChannel} channel The channel
     * @returns {Boolean}
     */

    move(member, channel) {
        if (!member) throw new RangeError('[TEMPVOC] Member not provided.');

        if (!channel) throw new RangeError('[TEMPVOC] Channel not provided.');

        return member.voice.setChannel(channel)
        .catch();
    };

    /**
     * Delete a VoiceChannel.
     * @private
     * @param {VoiceChannel} channel The channel
     * @returns {Boolean}
     */

    delete(channel) {
        if (!channel) throw new RangeError('[TEMPVOC] Channel not provided.');

        return channel.delete()
        .catch();
    };

    /**
     * Create a VoiceChannel.
     * @private
     * @param {GuildMember} member The member
     * @returns {VoiceChannel}
     */

    create(member) {
        if (!member) throw new RangeError('[TEMPVOC] Member not provided.');

        return member.guild.channels.create(this.name.replace('{user}', member.user.username), {
            type: 'GUILD_VOICE',
            parent: this.category,
            permissionOverwrites: [{
                id: member.guild.id,
                deny: 'CONNECT'
            }, {
                id: member.user.id,
                allow: ['CONNECT', 'MANAGE_CHANNELS'],
            }]
        })
        .catch();
    };
    
    /**
     * Set the VoiceChannel ID.
     * @param {String} channel The channel
     * @returns {TempVoc}
     */

    setChannelId(channel) {
        if (!channel) throw new RangeError('[TEMPVOC] Channel not provided.');
        if (!Util.verifType(channel, 'string')) throw new TypeError('[TEMPVOC] Channel must be a non-empty string.');

        this.channel = channel;

        return this;
    };

    /**
     * Set the CategoryChannel ID.
     * @param {String} category The category
     * @returns {TempVoc}
     */

    setCategoryId(category) {
        if (!category) throw new RangeError('[TEMPVOC] Category not provided.');
        if (!Util.verifType(category, 'string')) throw new TypeError('[TEMPVOC] Category must be a non-empty string.');

        this.category = category;

        return this;
    };

    /**
     * Set the temporary VoiceChannel name.
     * @param {String} name The name
     * @returns {TempVoc}
     */

    setName(name) {
        if (!name) throw new RangeError('[TEMPVOC] Name not provided.');
        if (!Util.verifType(name, 'string')) throw new TypeError('[TEMPVOC] Name must be a non-empty string.');

        this.name = name;

        return this;
    };

    /**
     * Start the temporary VoiceChannel.
     * @param {Client} client The client
     * @returns {TempVoc}
     */

    start(client) {
        if (!client) throw new RangeError('[TEMPVOC] Client not provided.');
        if (!Util.isClient(client)) throw new Error('[TEMPVOC] Client is inaccessible.');
        if (this.started) throw new Error('[TEMPVOC] TempVoc is already started.');
        
        this.client = client;
        this.started = true;

        if (!this.channel) throw new Error('[TEMPVOC] Channel not provided.');
        if (!Util.getChannel(this.client, this.channel)) throw new TypeError('[TEMPVOC] Channel isn\'t in the cache.');

        if (!this.category) throw new Error('[TEMPVOC] Category not provided.');
        if (!Util.getChannel(this.client, this.category)) throw new TypeError('[TEMPVOC] Category isn\'t in the cache.');

        this.client.on('voiceStateUpdate', async (oldState, newState) => {
            let member;
            try {
                member = await newState.guild.members.fetch(newState.id);
            } catch {
                throw new Error('[TEMPVOC] Member couldn\'t be fetched.')
            };

            if (this.channel === newState.channelId && newState.guild.me.permissions.has('MANAGE_GUILD')) {
                const channel = await this.create(member);

                this.channels.add(`${channel?.id}`);

                this.move(member, channel);
            };

            if (this.channels.has(`${oldState.channelId}`) && oldState.channelId !== newState.channelId) {
                this.delete(oldState.channel);

                this.channels.delete(`${oldState.channelId}`);
            };
        });

        return this;
    };
};

module.exports = TempVoc;