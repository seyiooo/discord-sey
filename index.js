class Pagination {
    constructor() {
        this.pages = null;
        this.emojis = ['⬅️', '➡️'];
        this.timeout = null;
    };

    /**
     * Set the pages.
     * @param {Object[]} pages The pages
     * @returns {Pagination}
     */

    setPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (typeof pages !== 'object' || pages.length === 0) throw new TypeError('[PAGINATION] Pages must be a non-empty array.');

        this.pages = pages;

        return this;
    };

    /**
     * Set the emojis.
     * @param {String[]} emojis The emojis
     * @returns {Pagination}
     */

    setEmojis(emojis) {
        if (!emojis) throw new RangeError('[PAGINATION] Emojis not provided.');
        if (typeof emojis !== 'object' || !emojis[0] || !emojis[1]) throw new TypeError('[PAGINATION] Emojis must be a non-empty array.');
        if (emojis.length !== 2) throw new TypeError('[PAGINATION] 2 emojis required.');

        this.emojis = emojis;

        return this;
    };

    /**
     * Set the timeout.
     * @param {Number} timeout The timeout
     * @returns {Pagination}
     */

    setTimeout(timeout) {
        if (!timeout) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (typeof timeout !== 'number') throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout = timeout;
        
        return this;
    };
};

/**
 * Create a pagination.
 * @param {Message} message The message
 * @param {Pagination} pagination The pages
 * @returns {Message}
 */

async function createPagination(message, pagination) {
    if (!message || !pagination) throw new RangeError('[createPagination] Missing options.');
    if (typeof message !== 'object') throw new TypeError('[createPagination] "message" must be an object.');
    if (typeof pagination !== 'object') throw new TypeError('[createPagination] "pagination" must be an object.');
    if (!message.channel) throw new Error('[createPagination] The channel is inaccessible.');
    if (!pagination.pages) throw new Error('[createPagination] Pages not provided.')

    const buttons = new this.ActionRow();
    buttons.components.push(new MessageButton()
    .setEmoji(pagination.emojis[0])
    .setCustomId('left')
    .setStyle('PRIMARY')
    .setDisabled(true));
    buttons.components.push(new MessageButton()
    .setEmoji(pagination.emojis[1])
    .setCustomId('right')
    .setStyle('PRIMARY'));

    let page = 1;

    if (page === pagination.pages.length) buttons.components[1].setDisabled(true);

    const msg = await message.channel.send({embeds: [pagination.pages[page - 1].setFooter({ text: `Page: ${page}/${pagination.pages.length}` })], components: [buttons]});

    const filter = (i) => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
        filter,
        time: pagination.timeout
    });

    collector.on('collect', i => {
        i.deferUpdate();

        switch (i.customId) {
            case 'left':
                --page;
            break;
            case 'right':
                ++page;
            break;
        };

        if (page === 1) buttons.components[0].setDisabled(true)
        else buttons.components[0].setDisabled(false);
        if (page === pagination.pages.length) buttons.components[1].setDisabled(true)
        else buttons.components[1].setDisabled(false);

        msg.edit({embeds: [pagination.pages[page - 1].setFooter({ text: `Page: ${page}/${pagination.pages.length}` })], components: [buttons]});
    });

    return msg;
}

module.exports = { Pagination, createPagination };