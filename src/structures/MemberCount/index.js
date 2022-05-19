const { VoiceChannel, Client } = require('discord.js');
const Util = require('../../Util');

/**
 * Create membercount system.
 */

class MemberCount {
    constructor() {
        this.memberChannel = null;
        this.botChannel = null;
        this.boostChannel = null;
        
        this.client = null;
        this.started = false;
    };

    /**
     * Set the MemberChannel ID.
     * @param {String} channel The channel ID
     * @returns {MemberCount}
     */

    setMemberChannelId(channel) {
        if (!channel) throw new RangeError('[MEMBERCOUNT] MemberChannel not provided.');
        if (!Util.verifType(channel, 'string')) throw new TypeError('[MEMBERCOUNT] MemberChannel must be a non-empty string.');

        this.memberChannel = channel;

        return this;
    };

    /**
     * Set the BotChannel ID.
     * @param {String} channel The channel ID
     * @returns {MemberCount}
     */

    setBotChannelId(channel) {
        if (!channel) throw new RangeError('[MEMBERCOUNT] BotChannel not provided.');
        if (!Util.verifType(channel, 'string')) throw new TypeError('[MEMBERCOUNT] BotChannel must be a non-empty string.');

        this.botChannel = channel;

        return this;
    };

    /**
     * Set the BoostChannel ID.
     * @param {String} channel The channel ID
     * @returns {MemberCount}
     */

    setBoostChannelId(channel) {
        if (!channel) throw new RangeError('[MEMBERCOUNT] BoostChannel not provided.');
        if (!Util.verifType(channel, 'string')) throw new TypeError('[MEMBERCOUNT] BoostChannel must be a non-empty string.');

        this.boostChannel = channel;

        return this;
    };

    /**
     * Start the MemberCount.
     * @param {Client} client The client
     * @returns {MemberCount}
     */

    start(client) {
        if (!client) throw new RangeError('[MEMBERCOUNT] Client not provided.');
        if (!Util.isClient(client)) throw new Error('[MEMBERCOUNT] Client is inaccessible.');
        if (this.started) throw new Error('[MEMBERCOUNT] MemberCount is already started.');

        this.client = client;
        this.started = true;

        setInterval(() => {
            if (this.memberChannel) {
                if (!Util.getChannel(this.client, this.memberChannel)) throw new TypeError('[MEMBERCOUNT] MemberChannel isn\'t in the cache.');

                const channel = Util.getChannel(this.client, this.memberChannel);

                channel.setName(`${channel.name.replace(/[0-9]/g, '')} ${channel.guild.memberCount}`)
                .catch();
            };

            if (this.botChannel) {
                if (!Util.getChannel(this.client, this.botChannel)) throw new TypeError('[MEMBERCOUNT] BotChannel isn\'t in the cache.');

                const channel = Util.getChannel(this.client, this.botChannel);

                channel.setName(`${channel.name.replace(/[0-9]/g, '').trim()} ${channel.guild.members.cache.filter((m) => m.user.bot).size}`)
                .catch();
            };

            if (this.boostChannel) {
                if (!Util.getChannel(this.client, this.boostChannel)) throw new TypeError('[MEMBERCOUNT] BoostChannel isn\'t in the cache.');

                const channel = Util.getChannel(this.client, this.boostChannel);

                channel.setName(`${channel.name.replace(/[0-9]/g, '').trim()} ${channel.guild.premiumSubscriptionCount}`)
                .catch();
            };
        }, 60000);

        return this;
    };
};

module.exports = MemberCount;