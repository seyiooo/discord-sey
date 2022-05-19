const { Client } = require('discord.js');

class Util {
    /**
    * Check if an array belongs to a certain instance.
    * @param {Array} array The array
    * @param {Function} instance The instance
    * @returns {Boolean}
    */

    static verifInstanceArray(array, instance) {
        if (!array) throw new RangeError('[UTIL] Array not provided');
        if (!instance) throw new RangeError('[UTIL] Instance not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[UTIL] Array must be a non-empty array.');

        const result = array.every((e) => {
            if (e instanceof instance) return true;
            else return false;
        });

        return result;
    };

    /**
     * Check if an array belongs to a certain type.
     * @param {Array} array The array
     * @param {String} type The type
     * @returns {Boolean}
     */

    static verifTypeArray(array, type) {
        if (!array) throw new RangeError('[UTIL] Array not provided');
        if (!type) throw new RangeError('[UTIL] Type not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[UTIL] Array must be a non-empty array.');

        const result = array.every((e) => {
            if (typeof e === type) return true;
            else return false;
        });

        return result;
    };

    /**
     * Check if an object belongs to a certain type.
     * @param {Object} object The object
     * @param {String} type The type
     * @returns {Boolean}
     */

    static verifType(object, type) {
        if (!object) throw new RangeError('[UTIL] Object not provided');
        if (!type) throw new RangeError('[UTIL] Type not provided.');

        const result = typeof object === type;

        return result;
    };

    /**
     * Check if an object is a Client.
     * @param {Client} client The object
     * @returns {Boolean}
     */

    static isClient(client) {
        const result = client.user || client.ws || client.guilds.cache || client.channels.cache;

        return result;
    };

    /**
     * Get a Channel.
     * @param {String} id The id
     * @returns {Channel}
     */

    static getChannel(client, id) {
        if (!client) throw new RangeError('[UTIL] Client not provided.');
        if (!id) throw new RangeError('[UTIL] ID not provided.');

        if (!client.user) throw new TypeError('[UTIL] Client is inaccessible.');
        if (!this.verifType(id, 'string')) throw new TypeError('[UTIL] ID must be a non-empty string.');

        return client.channels.cache.get(id);
    };
};

module.exports = Util;