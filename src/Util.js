const { Client } = require('discord.js');

class Util {

    /**
     * Check if all elements in an array are instances of a certain class.
     * @param {Array} array The array to check.
     * @param {Function} instance The class constructor to check against.
     * @returns {boolean} True if all elements are instances of the class, false otherwise.
     * @throws {RangeError} If the array or instance is not provided.
     * @throws {TypeError} If the array is not a non-empty array.
     */

    verifInstanceArray(array, instance) {
        if (!array) throw new RangeError('[UTIL] Array not provided.');
        if (!instance) throw new RangeError('[UTIL] Instance not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[UTIL] Array must be a non-empty array.');

        return array.every((e) => e instanceof instance);
    };

    /**
     * Check if all elements in an array are of a certain type.
     * @param {Array} array The array to check.
     * @param {string} type The type to check against.
     * @returns {boolean} True if all elements are of the specified type, false otherwise.
     * @throws {RangeError} If the array or type is not provided.
     * @throws {TypeError} If the array is not a non-empty array.
     */

    verifTypeArray(array, type) {
        if (!array) throw new RangeError('[UTIL] Array not provided.');
        if (!type) throw new RangeError('[UTIL] Type not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[UTIL] Array must be a non-empty array.');

        return array.every((e) => typeof e === type);
    };

    /**
     * Check if an object is of a certain type.
     * @param {Object} object The object to check.
     * @param {string} type The type to check against.
     * @returns {boolean} True if the object is of the specified type, false otherwise.
     * @throws {RangeError} If the object or type is not provided.
     */
    
    verifType(object, type) {
        if (object === undefined || object === null) throw new RangeError('[UTIL] Object not provided.');
        if (!type) throw new RangeError('[UTIL] Type not provided.');

        return typeof object === type;
    };

    /**
     * Check if an object is a Discord Client.
     * @param {Client} client The object to check.
     * @returns {boolean} True if the object is a Discord Client, false otherwise.
     */
    
    isClient(client) {
        return client instanceof Client;
    };

    /**
     * Get a Channel by its ID.
     * @param {Client} client The Discord client.
     * @param {string} id The ID of the channel.
     * @returns {Channel|null} The channel if found, otherwise null.
     * @throws {RangeError} If the client or ID is not provided.
     * @throws {TypeError} If the client is inaccessible or ID is not a string.
     */
    
    getChannel(client, id) {
        if (!client) throw new RangeError('[UTIL] Client not provided.');
        if (!id) throw new RangeError('[UTIL] ID not provided.');

        if (!client.user) throw new TypeError('[UTIL] Client is inaccessible.');
        if (typeof id !== 'string' || !id.length) throw new TypeError('[UTIL] ID must be a non-empty string.');

        return client.channels.cache.get(id) || null;
    };
};

module.exports = Util;