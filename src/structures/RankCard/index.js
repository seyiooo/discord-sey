const { createCanvas, registerFont, Image, CanvasRenderingContext2D } = require('canvas');

registerFont(`${__dirname}/../../../assets/fonts/Poppins-Black.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Bold.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Light.otf`, { family: 'PoppinsLight' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Regular.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-SemiBold.otf`, { family: 'PoppinsSemiBold' });

/**
 * Create rank card.
 */

module.exports = class RankCard {
    constructor() {
        this.tag = null;
        this.avatar = null;
        this.level = 0;
        this.currentXp = 0;
        this.requiredXp = 0;

        /**
         * @private
         */
        this.width = 1080;
        /**
         * @private
         */
        this.height = 325;

        /**
         * @private
         */
        this.backgroundRadius = 40;

        /**
         * @private
         */
        this.colorsObject = {
            progressBar: '#363636',
            background: '#191919',
            main: '#5865F2'
        };

        /**
         * @private
         */
        this.shadowObject = {
            size: 15,
            color: 'rgba(0, 0, 0, 0.35)'
        };

        /**
         * @private
         */
        this.levelObject = {
            x: 960,
            y: 40,
            text: 'level',
            textSize: 25,
            numberSize: 50,
            sepSize: 40,
            spacing: 20
        };

        /**
         * @private
         */
        this.usernameObject = {
            x: 280,
            y: 140,
            usernameSize: 45,
            usernameColor: '#FFFFFF',
            font: 'bold',
            weight: 300,
            sepSize: 10
        };

        /**
         * @private
         */
        this.progressObject = {
            x: 975,
            y: 160,
            size: 25,
            currentColor: '#FFFFFF',
            requiredColor: '#A1A1A1'
        };

        /**
         * @private
         */
        this.progressbarObject = {
            x: 280,
            y: 205,
            width: 720,
            height: 35,
            radius: 25,
            minWidth: 36
        };

        /**
         * @private
         */
        this.avatarObject = {
            x: 50,
            y: this.height / 4,
            xSize: 160,
            ySize: 160
        };
    };

    /**
     * Draw the rank card shadow.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawShadow() {
        const { color, size } = this.shadowObject

        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = size;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        return this.ctx;
    };

    /**
     * Draw the background.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawBackground() {
        const { background } = this.colorsObject;
        const { size } = this.shadowObject;

        this.ctx.fillStyle = background;
        this.ctx.roundRect(size, size, this.width, this.height, this.backgroundRadius).fill();

        return this.ctx;
    };

    /**
     * Draw the level.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawLevel() {
        const { x, y, numberSize, sepSize, textSize, text, spacing } = this.levelObject;
        const { size } = this.shadowObject;
        const { main } = this.colorsObject;

        const numberWidth = this.ctx.measureText(this.level.shortNumber()).width;

        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = main;
        this.ctx.font = `bold ${numberSize}px Poppins`;
        this.ctx.fillText(this.level.shortNumber(), size + x + sepSize, size + y + numberSize);
    
        this.ctx.font = `bold ${textSize}px PoppinsSemiBold`;
        this.ctx.fillText(text, size + x + sepSize - numberWidth - spacing, size + y + numberSize);
    
        return this.ctx;
    };

    /**
     * Draw the user.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawUser() {
        const { usernameSize, usernameColor, y } = this.usernameObject;
        const { size } = this.shadowObject;
        const { x } = this.progressbarObject;


        this.ctx.font = `bold ${usernameSize}px PoppinsSemiBold`;
        const maxWidthCondition = this.ctx.measureText(this.username).width > this.ctx.measureText('@@@@@@@@@').width;
        while (this.ctx.measureText(this.username).width > this.ctx.measureText('@@@@@@@@@').width) {
            this.username = this.username.slice(0, -1);
        };
    
        this.ctx.fillStyle = usernameColor;
    
        this.ctx.textAlign = 'left';
        this.ctx.fillText(maxWidthCondition ? this.username + '...' : this.username, size + x, size + y + usernameSize);
    
        return this.ctx;
    };

    /**
     * Draw the progress.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawProgress() {
        const { x, width } = this.progressbarObject;
        const { requiredColor, size, y, currentColor } = this.progressObject;
        
        this.progressObject.currentXpText = `${this.currentXp.shortNumber()}`;
        this.progressObject.requiredXpText = `/${this.requiredXp.shortNumber()} xp`;

        this.ctx.fillStyle = requiredColor;
        this.ctx.font = `${size}px PoppinsSemiBold`;
        this.ctx.fillText(this.progressObject.requiredXpText, this.shadowObject.size + x + width, this.shadowObject.size + y + size);
    
        this.ctx.fillStyle = currentColor;
        this.ctx.font = `bold ${size}px PoppinsSemiBold`;
        this.ctx.fillText(this.progressObject.currentXpText, this.shadowObject.size + x + width - this.ctx.measureText(this.progressObject.requiredXpText).width, this.shadowObject.size + y + size);
    
        return this.ctx;
    };

    /**
     * Draw the progress bar.
     * @private
     * @returns {CanvasRenderingContext2D} The canvas context
     */

    drawProgressBar() {
        const { x, y, width, height, radius, minWidth } = this.progressbarObject;
        const { progressBar, main } = this.colorsObject;
        const { size } = this.shadowObject;

        this.ctx.fillStyle = progressBar;
        this.ctx.roundRect(size + x, size + y, width, height, radius).fill();

        this.progressbarObject.currentWidth = width * this.currentXp / this.requiredXp;
        if (this.progressbarObject.currentWidth > width) this.progressbarObject.currentWidth = width;
        if (this.progressbarObject.currentWidth < minWidth) this.progressbarObject.currentWidth = minWidth;
        
        this.ctx.fillStyle = main;
        this.ctx.roundRect(size + x, size + y, this.progressbarObject.currentWidth, height, radius).fill();

        return this.ctx;
    };

    /**
     * Set the username.
     * @param {String} username - The user's name.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the username is not provided.
     * @throws {TypeError} If the username is not a string.
     */

    setUsername(username) {
        if (!username) throw new RangeError('[RANKCARD] Username not provided.');
        if (typeof username !== 'string') throw new TypeError('[RANKCARD] Username must be a non-empty string.');

        this.username = username;

        return this;
    };

    /**
     * Set the avatar.
     * @param {String} avatar - The URL of the avatar image.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the avatar is not provided.
     * @throws {TypeError} If the avatar is not a string.
     */

    setAvatar(avatar) {
        if (!avatar) throw new RangeError('[RANKCARD] Avatar not provided.');
        if (typeof avatar !== 'string') throw new TypeError('[RANKCARD] Avatar must be a non-empty URL.');

        this.avatar = avatar;

        return this;
    };

    /**
     * Set the level.
     * @param {Number} level - The user's level.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the level is not provided.
     * @throws {TypeError} If the level is not a number.
     */

    setLevel(level) {
        if (!level && level !== 0) throw new RangeError('[RANKCARD] Level not provided.');
        if (typeof level !== 'number') throw new TypeError('[RANKCARD] Level must be a non-null number.');

        this.level = level;

        return this;
    };

    /**
     * Set the current XP.
     * @param {Number} xp - The user's current XP.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the current XP is not provided.
     * @throws {TypeError} If the current XP is not a number.
     */

    setCurrentXp(xp) {
        if (!xp && xp !== 0) throw new RangeError('[RANKCARD] XP not provided.');
        if (typeof xp !== 'number') throw new TypeError('[RANKCARD] XP must be a non-null number.');

        this.currentXp = xp;

        return this;
    };

    /**
     * Set the required XP.
     * @param {Number} xp - The XP required for the next level.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the required XP is not provided.
     * @throws {TypeError} If the required XP is not a number.
     */

    setRequiredXp(xp) {
        if (!xp && xp !== 0) throw new RangeError('[RANKCARD] XP not provided.');
        if (typeof xp !== 'number') throw new TypeError('[RANKCARD] XP must be a non-null number.');

        this.requiredXp = xp;

        return this;
    };

    /**
     * Set the color.
     * @param {String} color - The main color used for primary elements.
     * @returns {RankCard} The current instance of RankCard.
     * @throws {RangeError} If the color is not provided.
     */

    setColor(color) {
        if (!color) throw new RangeError('[RANKCARD] Color not provided.');

        this.colorsObject.main = color;

        return this;
    };

    /**
     * Build the rank card.
     * @returns {Promise<Buffer>} A promise that resolves with the rank card image buffer.
     * @throws {RangeError} If any required property is not provided.
     */

    build() {
        if (!this.username) throw new RangeError('[RANKCARD] Username not provided.');
        if (!this.avatar) throw new RangeError('[RANKCARD] Avatar not provided.');
        if (!this.level && this.level !== 0) throw new RangeError('[RANKCARD] Level not provided.');
        if (!this.currentXp && this.currentXp !== 0) throw new RangeError('[RANKCARD] Current XP not provided.');
        if (!this.requiredXp && this.requiredXp !== 0) throw new RangeError('[RANKCARD] Required XP not provided.');

        const { size } = this.shadowObject;
        const { x, width } = this.progressbarObject;
    
        const canvas = createCanvas(this.width + (size * 2), this.height + (size * 2));
        const ctx = canvas.getContext('2d');
        /**
         * @private
         */
        this.ctx = ctx;
    
        this.drawShadow();
        this.drawBackground();
        this.drawUser();
        this.drawLevel();
        this.drawProgress();
        this.drawProgressBar();
    
        this.avatarObject.x = size + (this.width - x - width);
    
        const avatar = new Image();
        avatar.src = this.avatar;
    
        return new Promise((resolve, reject) => {
            try {
                avatar.onload = () => {
                    const { xSize, ySize } = this.avatarObject;
                    const { size } = this.shadowObject;

                    this.ctx.beginPath();
                    this.ctx.arc(this.avatarObject.x + xSize / 2, (this.height / 2) - (ySize / 2) + size + ySize / 2, xSize / 2, 0, Math.PI * 2, false);
                    this.ctx.clip();
                    this.ctx.drawImage(avatar, this.avatarObject.x, (this.height / 2) - (ySize / 2) + size, xSize, ySize);
    
                    resolve(canvas.toBuffer());
                };
    
                avatar.onerror = () => reject(new Error('[RANKCARD] Failed to load image.'));
            } catch (error) {
                reject(error);
            };
        });
    }
};