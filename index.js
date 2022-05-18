const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

class Pagination {
    constructor() {
        this.message = null;
        this.pagination = null;

        this.pages = [];
        this.buttons = null;
        this.emojis = ['⬅️', '➡️'];
        this.timeout = null;
        this.style = 'PRIMARY';

        this.index = 0;
        this.filter = (i) => i.user.id === this.message.author.id;
        this.ended = false;
        this.deleted = false;
    };

    /**
     * @private
     * @returns {MessageEmbed}
     */

    get currentEmbed() {
        return this.pages[this.index];
    };

    /**
     * @private
     * @returns {Boolean}
     */

    get isEditable() {
        return this.pagination.editable;
    };

    /**
     * @private
     * @returns {Boolean}
     */

    get isDeletable() {
        return this.pagination.deletable;
    };

    /**
     * Check if an array belongs to a certain instance.
     * @private
     * @param {Array} array The array
     * @param {Function} instance The instance
     * @returns {Boolean}
     */

    verifInstanceArray(array, instance) {
        if (!array) throw new RangeError('[PAGINATION] Array not provided');
        if (!instance) throw new RangeError('[PAGINATION] Instance not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[PAGINATION] Array must be a non-empty array.');

        const result = array.every((e) => {
            if (e instanceof instance) return true;
            else return false;
        });

        return result;
    };

    /**
     * Check if an array belongs to a certain type.
     * @private
     * @param {Array} array The array
     * @param {String} type The type
     * @returns {Boolean}
     */

    verifTypeArray(array, type) {
        if (!array) throw new RangeError('[PAGINATION] Array not provided');
        if (!type) throw new RangeError('[PAGINATION] Type not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[PAGINATION] Array must be a non-empty array.');

        const result = array.every((e) => {
            if (typeof e === type) return true;
            else return false;
        });

        return result;
    };

    /**
     * Fix footers.
     * @private
     * @returns {Pagination}
     */

    _fixPages() {
        this.pages.forEach((p) => p.setFooter({ text: `Page: ${this.index + 1}/${this.pages.length}` }));

        return this;
    };

    /**
     * Fix buttons.
     * @private
     * @returns {Pagination}
     */

    _fixButtons() {
        if (!this.index) this.buttons.components[0].setDisabled(true)
        else this.buttons.components[0].setDisabled(false);

        if (this.index === this.pages.length - 1) this.buttons.components[1].setDisabled(true)
        else this.buttons.components[1].setDisabled(false);

        return this;
    };

    /**
     * Update the pagination.
     * @returns {Message}
     */

    update() {
        if (this.deleted || this.ended) return;
        
        this._fixPages();
        this._fixButtons();

        if (this.isEditable) return this.pagination.edit({embeds: [this.currentEmbed], components: [this.buttons]});
    };

    /**
     * Display the previous page.
     * @returns {Message}
     */

    previous() {
        --this.index;

        return this.update();
    };

    /**
     * Display the next page.
     * @returns {Message}
     */

    next() {
        ++this.index;

        return this.update();
    };

    /**
     * End the pagination.
     * @returns {Pagination}
     */

    end() {
        if (this.ended) throw new Error('[PAGINATION] Pagination is already ended.');

        this.ended = true;

        this.buttons.components.forEach((c) => c.setDisabled(true));

        this.update();

        return this;
    };

    /**
     * Delete the pagination.
     * @returns {Message}
     */

    delete() {
        if (this.deleted) throw new Error('[PAGINATION] Pagination is already deleted.');

        this.deleted = true;
        this.ended = true;

        if (this.isDeletable) return this.pagination.delete();
    };

    /**
     * Set the pages.
     * @param {Array} pages The pages
     * @returns {Pagination}
     */

    setPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length || !this.verifInstanceArray(pages, MessageEmbed)) throw new TypeError('[PAGINATION] Pages must be a non-empty array of MessageEmbed.');

        this.pages = pages;

        return this;
    };

    /**
     * Add a page.
     * @param {MessageEmbed} page The page
     * @returns {Pagination}
     */

    addPage(page) {
        if (!page) throw new RangeError('[PAGINATION] Page not provided.');
        if (!this.verifInstanceArray([page], MessageEmbed)) throw new TypeError('[PAGINATION] Page must be a MessageEmbed.');

        this.setPages([...this.pages, page]);

        return this;
    };

    /**
     * Add pages.
     * @param {Array} pages The pages
     * @returns {Pagination}
     */

    addPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length || !this.verifInstanceArray(pages, MessageEmbed)) throw new TypeError('[PAGINATION] Pages must be a non-empty array of MessageEmbed.');

        pages.forEach((p) => this.addPage(p));

        return this;
    };

    /**
     * Set the emojis.
     * @param {String[]} emojis The emojis
     * @returns {Pagination}
     */

    setEmojis(emojis) {
        if (!emojis) throw new RangeError('[PAGINATION] Emojis not provided.');
        if (!Array.isArray(emojis) || !emojis.length || !this.verifTypeArray(emojis, 'string') || !emojis[0] || !emojis[1]) throw new TypeError('[PAGINATION] Emojis must be a non-empty array of string.');
        if (emojis[3]) throw new TypeError('[PAGINATION] Exactly 2 emojis required.');

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
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout = timeout;
        
        return this;
    };

    /**
     * Add timeout.
     * @param {Number} timeout The timeout
     * @returns {Pagination}
     */

    addTimeout(timeout) {
        if (!timeout) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout += timeout;
        
        return this;
    };

    /**
     * Set the buttons style.
     * @param {String} style The style
     * @returns {Pagination}
     */

    setStyle(style) {
        if (!style) throw new RangeError('[PAGINATION] Style not provided.');
        if (!this.verifTypeArray([style], 'string')) throw new TypeError('[PAGINATION] Style must be a non-empty string. ("PRIMARY", "SECONDARY", "SUCCESS", "DANGER")');
        if (!['PRIMAY', 'SECONDARY', 'SUCCESS', 'DANGER'].includes(style.toUpperCase())) throw new TypeError('[PAGINATION] Style must be a non-empty string. ("PRIMARY", "SECONDARY", "SUCCESS", "DANGER")');

        this.style = style.toUpperCase();

        return this;
    };

    /**
     * Start the pagination.
     * @param {Message} message The message
     * @returns {Pagination}
     */
    
    async start(message) {
        if (!this.verifInstanceArray([message], Message)) throw new RangeError('[PAGINATION] Message not provided.');
        if (!message.channel) throw new RangeError('[PAGINATION] The message channel is inaccessible.');
        if (!this.pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (this.started) throw new Error('[PAGINATION] Pagination is already started.');

        this._fixPages();
        this.message = message;
        this.started = true;
    
        this.buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setEmoji(this.emojis[0])
            .setCustomId('left')
            .setStyle(this.style)
            .setDisabled(true),
            new MessageButton()
            .setEmoji(this.emojis[1])
            .setCustomId('right')
            .setStyle(this.style)
        );
    
        const msg = await this.message.channel.send({embeds: [this.pages[this.index]], components: [this.buttons]});
        
        this.pagination = msg;

        if (!this.pagination) throw new Error('[PAGINATION] Couldn\'t fetch message.');

        const collector = msg.createMessageComponentCollector({
            filter: this.filter,
            time: this.timeout
        });
    
        collector.on('collect', i => {
            if (this.deleted || this.ended) return;
            
            i.deferUpdate();
    
            switch (i.customId) {
                case 'left':
                    this.previous();
                break;
                case 'right':
                    this.next();
                break;
            };
        });
    
        return this;
    };
};

module.exports = {
    Pagination
};
