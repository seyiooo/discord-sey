const { Message, Interaction, ComponentEmojiResolvable, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const Util = require('../../Util');

/**
 * Create pagination system.
 */

module.exports = class Pagination {
    constructor() {
        /**
         * @private
         */
        this.context = null;
        /**
         * @private
         */
        this.pagination = null;

        this.pages = [];
        this.buttons = null;
        this.labels = ['⬅️', '➡️'];
        this.timeout = null;
        this.style = ButtonStyle.Primary;

        /**
         * @private
         */
        this.index = 0;
        /**
         * @private
         */
        this.filter = (i) => i.user.id === (this.context.author?.id || this.context.user?.id);
        /**
         * @private
         */
        this.started = false;
        /**
         * @private
         */
        this.ended = false;
        /**
         * @private
         */
        this.deleted = false;

        /**
         * @private
         */
        this.util = new Util();
    };

    /**
     * Get the current embed.
     * @private
     * @returns {EmbedBuilder} The current embed.
     */

    get currentEmbed() {
        return this.pages[this.index];
    };

    /**
     * Check if the message is editable.
     * @private
     * @returns {boolean} Whether the message is editable.
     */

    get isEditable() {
        return this.pagination.editable;
    };

    /**
     * Check if the message is deletable.
     * @private
     * @returns {boolean} Whether the message is deletable.
     */

    get isDeletable() {
        return this.pagination.deletable;
    };

    /**
     * Fix the footers of all pages.
     * @private
     * @returns {Pagination} The current pagination instance.
     */

    async _fixPages() {
        if (this.deleted) return;

        for (const p of this.pages) {
            p.setFooter({ text: `Page: ${this.index + 1}/${this.pages.length}${this.ended ? '・Time elapsed' : ''}` })
        };

        return this;
    };

    /**
     * Fix the buttons states.
     * @private
     * @returns {Pagination} The current pagination instance.
     */

    async _fixButtons() {
        if (this.ended || this.deleted) return;

        if (this.secondaryLabels) {
            this.buttons.components[0].setDisabled(this.index === 0);
            this.buttons.components[1].setDisabled(this.index === 0);
            this.buttons.components[2].setDisabled(this.index === this.pages.length - 1);
            this.buttons.components[3].setDisabled(this.index === this.pages.length - 1);
        } else {
            this.buttons.components[0].setDisabled(this.index === 0);
            this.buttons.components[1].setDisabled(this.index === this.pages.length - 1);
        };

        return this;
    };

    /**
     * Update the pagination.
     * @returns {Promise<Message>} The updated message.
     */

    async update() {
        if (this.deleted) return;
        
        await this._fixPages();
        await this._fixButtons();

        if (this.isEditable) return this.pagination.edit({ embeds: [this.currentEmbed], components: [this.buttons] }).catch(console.error);
    };

    /**
     * Display the first page.
     * @returns {Promise<Message>} The updated message.
     */

    first() {
        this.index = 0;

        return this.update();
    };

    /**
     * Display the previous page.
     * @returns {Promise<Message>} The updated message.
     */

    previous() {
        if (this.index > 0) --this.index;

        return this.update();
    };

    /**
     * Display the next page.
     * @returns {Promise<Message>} The updated message.
     */

    next() {
        if (this.index < this.pages.length - 1) ++this.index;

        return this.update();
    };

    /**
     * Display the last page.
     * @returns {Promise<Message>} The updated message.
     */

    last() {
        this.index = this.pages.length - 1;

        return this.update();
    };

    /**
     * End the pagination.
     * @returns {Promise<Message>} The updated message.
     */

    end() {
        if (this.ended) throw new Error('[PAGINATION] Pagination is already ended.');

        this.ended = true;

        this.buttons.components.forEach((b) => b.setDisabled(true));

        return this.update();
    };

    /**
     * Delete the pagination.
     * @returns {Promise<Message>} The deleted message.
     */

    delete() {
        if (this.deleted) throw new Error('[PAGINATION] Pagination is already deleted.');

        this.deleted = true;
        this.ended = true;

        if (this.isDeletable) return this.pagination.delete().catch(console.error);
    };

    /**
     * Set the pages.
     * @param {EmbedBuilder[]} pages The pages.
     * @returns {Pagination} The current pagination instance.
     */

    setPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length) throw new TypeError('[PAGINATION] Pages must be a non-empty array of MessageEmbed.');

        this.pages = pages;

        return this;
    };

    /**
     * Add a page.
     * @param {EmbedBuilder} page The page.
     * @returns {Pagination} The current pagination instance.
     */

    addPage(page) {
        if (!page) throw new RangeError('[PAGINATION] Page not provided.');

        this.setPages([...this.pages, page]);

        return this;
    };

    /**
     * Add multiple pages.
     * @param {EmbedBuilder[]} pages The pages.
     * @returns {Pagination} The current pagination instance.
     */

    addPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length) throw new TypeError('[PAGINATION] Pages must be a non-empty array of MessageEmbed.');

        for (const p of pages) {
            this.addPage(p);
        };

        return this;
    };

    /**
     * Set the labels for navigation buttons.
     * @param {string[]} labels The labels for next and previous page.
     * @param {string[]} [secondaryLabels] The labels for first and last page.
     * @returns {Pagination} The current pagination instance.
     */

    setLabels(labels, secondaryLabels) {
        if (!labels) throw new RangeError('[PAGINATION] Emojis not provided.');
        if (!Array.isArray(labels) || labels.length !== 2 || !this.util.verifTypeArray(labels, 'string')) throw new TypeError('[PAGINATION] Emojis must be an array of exactly 2 strings.');
        if (secondaryLabels && (!Array.isArray(secondaryLabels) || secondaryLabels.length !== 2 || !this.util.verifTypeArray(secondaryLabels, 'string'))) throw new TypeError('[PAGINATION] Secondary emojis must be an array of exactly 2 strings.');

        this.labels = labels;
        this.secondaryLabels = secondaryLabels;

        return this;
    };

    /**
     * Set the timeout for the pagination.
     * @param {number} timeout The timeout.
     * @returns {Pagination} The current pagination instance.
     */

    setTimeout(timeout) {
        if (timeout === undefined) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout = timeout;

        return this;
    };

    /**
     * Add to the timeout for the pagination.
     * @param {number} timeout The timeout.
     * @returns {Pagination} The current pagination instance.
     */

    addTimeout(timeout) {
        if (timeout === undefined) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout += timeout;

        return this;
    };

    /**
     * Set the style of the buttons.
     * @param {ButtonStyle} style The button style.
     * @returns {Pagination} The current pagination instance.
     */

    setStyle(style) {
        if (!style) throw new RangeError('[PAGINATION] Style not provided.');
        if (![ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger].includes(style)) throw new TypeError('[PAGINATION] Invalid style. Must be a value of ButtonStyle from discord.js.');

        this.style = style;

        return this;
    };

    /**
     * Start the pagination.
     * @param {Message|Interaction} ctx The context.
     * @returns {Pagination} The current pagination instance.
     */
    
    async start(ctx) {
        if (!ctx) throw new RangeError('[PAGINATION] Context not provided.');
        if (!ctx.channel) throw new RangeError('[PAGINATION] Context channel isn\'t in the cache.');
        if (!this.pages.length) throw new RangeError('[PAGINATION] Pages not provided.');
        if (this.started) throw new Error('[PAGINATION] Pagination is already started.');

        await this._fixPages();
        this.context = ctx;
        this.started = true;

        this.buttons = new ActionRowBuilder()

        if (this.secondaryLabels) this.buttons.addComponents(
            new ButtonBuilder()
            .setLabel(this.secondaryLabels[0])
            .setCustomId('first')
            .setStyle(this.style)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel(this.labels[0])
            .setCustomId('previous')
            .setStyle(this.style)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel(this.labels[1])
            .setCustomId('next')
            .setStyle(this.style)
            .setDisabled(this.pages.length <= 1),
            new ButtonBuilder()
            .setLabel(this.secondaryLabels[1])
            .setCustomId('last')
            .setStyle(this.style)
            .setDisabled(this.pages.length <= 1)
        );
        else this.buttons.addComponents(
            new ButtonBuilder()
            .setLabel(this.labels[0])
            .setCustomId('previous')
            .setStyle(this.style)
            .setDisabled(true),
            new ButtonBuilder()
            .setLabel(this.labels[1])
            .setCustomId('next')
            .setStyle(this.style)
            .setDisabled(this.pages.length <= 1)
        );

        const msg = await this.context.reply({ embeds: [this.pages[this.index]], components: [this.buttons], fetchReply: true }).catch(console.error);
        
        this.pagination = msg;
        
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: this.filter,
            time: this.timeout
        });
        
        collector.on('collect', (i) => {
            if (this.deleted || this.ended) return;
            
            i.deferUpdate().catch(console.error);
    
            switch (i.customId) {
                case 'first':
                    this.first();
                    break;
                case 'previous':
                    this.previous();
                    break;
                case 'next':
                    this.next();
                    break;
                case 'last':
                    this.last();
                    break;
            };
        });

        collector.on('end', () => {
            this.end();
        });
        
        return this;
    };
};