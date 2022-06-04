const { createCanvas, registerFont, Image, CanvasRenderingContext2D } = require('canvas');
const Frame = require('canvas-to-buffer');

registerFont(`${__dirname}/../../../assets/fonts/Poppins-Black.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Bold.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Light.otf`, { family: 'PoppinsLight' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-Regular.otf`, { family: 'Poppins' });
registerFont(`${__dirname}/../../../assets/fonts/Poppins-SemiBold.otf`, { family: 'PoppinsSemiBold' });

/**
 * Create rank card.
 */

class RankCard {
    constructor() {
        this.tag = null;
        this.avatar = null;
        this.level = 0;
        this.currentXp = 0;
        this.requiredXp = 0;

        this.width = 1080;
        this.height = 325;

        this.backgroundRadius = 25;

        this.colorsObject = {
            progressBar: '#36393E',
            background: '#19191b',
            main: '#5865f2'
        };

        this.shadowObject = {
            size: 10,
            color: 'rgba(0, 0, 0, 0.2)'
        };

        this.levelObject = {
            x: 875 + this.shadowObject.size,
            y: 40 + this.shadowObject.size,
            textSize: 25,
            numberSize: 50,
            sepSize: 60
        };

        this.usernameObject = {
            x: 260 + this.shadowObject.size,
            y: 130 + this.shadowObject.size,
            usernameSize: 50,
            usernameColor: '#fff',
            font: 'bold',
            discriminatorSize: 35,
            discriminatorColor: '#A1A1A1',
            weight: 300,
            sepSize: 10
        };

        this.progressObject = {
            x: 900 + this.shadowObject.size,
            y: 150 + this.shadowObject.size,
            size: 30,
            currentColor: '#fff',
            requiredColor: '#A1A1A1'
        };

        this.progressbarObject = {
            x: 250 + this.shadowObject.size,
            y: 200 + this.shadowObject.size,
            width: 750,
            height: 35,
            radius: 25
        };

        this.avatarObject = {
            x: 45 + this.shadowObject.size,
            y: 70 + this.shadowObject.size,
            xSize: 175,
            ySize: 175
        };
    };

    /**
     * Draw the rank card shadow.
     * @private
     * @returns {CanvasRenderingContext2D}
     */

    drawShadow() {
        this.ctx.shadowColor = this.shadowObject.color;
        this.ctx.shadowBlur = this.shadowObject.size;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    
        this.ctx.save();
    
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.roundRect(this.shadowObject.size - 2, this.shadowObject.size - 2, this.width + 2, this.height + 2, 10).fill();
    
        return this.ctx;
    };

    /**
     * Draw the background.
     * @private
     * @returns {CanvasRenderingContext2D} The context
     */

    drawBackground() {
        this.ctx.fillStyle = this.colorsObject.background;
        this.ctx.roundRect(0, 0, this.width, this.height, this.backgroundRadius).fill();
    
        return this.ctx;
    };

    /**
     * Draw the level.
     * @private
     * @returns {CanvasRenderingContext2D}
     */

    drawLevel() {
        this.ctx.font = `bold ${this.levelObject.numberSize}px Poppins`;
        this.ctx.fillStyle = this.colorsObject.main;
        this.ctx.fillText(this.level, this.levelObject.x + this.levelObject.sepSize, this.levelObject.y + this.levelObject.numberSize);
    
        this.ctx.font = `bold ${this.levelObject.textSize}px PoppinsSemiBold`;
        this.ctx.fillText('level', this.levelObject.x - this.levelObject.textSize, this.levelObject.y + this.levelObject.numberSize);
    
        return this.ctx;
    };

    /**
     * Draw the user.
     * @private
     * @returns {CanvasRenderingContext2D}
     */

    drawUser() {
        if (this.tag[0].length > 32) this.tag[0] = this.tag[0].slice(0, 29) + '...';
        
        this.ctx.font = `bold ${this.usernameObject.usernameSize}px Poppins`;
        this.ctx.fillStyle = this.usernameObject.usernameColor;
        this.ctx.fillText(this.tag[0], this.usernameObject.x, this.usernameObject.y + this.usernameObject.usernameSize);
        
        const usernameLength = this.ctx.measureText(this.tag[0]).width;
    
        this.ctx.font = `300 ${this.usernameObject.discriminatorSize}px PoppinsLight`;
        this.ctx.fillStyle = this.usernameObject.discriminatorColor;
        this.ctx.fillText(this.tag[1], this.usernameObject.x + usernameLength + this.usernameObject.sepSize, this.usernameObject.y + this.usernameObject.usernameSize);
    
        return this.ctx;
    };

    /**
     * Draw the progress.
     * @private
     * @returns {CanvasRenderingContext2D}
     */

    drawProgress(ctx) {
        let decal = 0;

        if (this.ctx.measureText(this.currentXp).width > this.ctx.measureText('999').width) decal = -(this.ctx.measureText('999').width - this.ctx.measureText(this.currentXp.substring(3)).width) + 4;
    
        const secondDecal = this.ctx.measureText(' XP').width;
    
        const x = this.progressObject.x;
        const y = this.progressObject.y;
    
        this.ctx.font = `bold ${this.progressObject.size}px PoppinsLight`;
        this.ctx.fillStyle = this.progressObject.currentColor;
        this.ctx.fillText(`${this.currentXp}`, x + decal - secondDecal, y + this.progressObject.size);
        
        this.ctx.font = `${this.progressObject.size}px PoppinsLight`;
        this.ctx.fillStyle = this.progressObject.requiredColor;
        this.ctx.fillText(`/${this.requiredXp}`, x + decal - secondDecal + this.ctx.measureText(this.currentXp).width, y + this.progressObject.size);
    
        return ctx;
    };

    /**
     * Draw the progress bar.
     * @private
     * @returns {CanvasRenderingContext2D}
     */

    drawProgressBar() {
        this.ctx.fillStyle = this.colorsObject.progressBar;
        this.ctx.roundRect(this.progressbarObject.x, this.progressbarObject.y, this.progressbarObject.width, this.progressbarObject.height, this.progressbarObject.radius).fill();
    
        this.ctx.fillStyle = this.colorsObject.main;
        this.ctx.roundRect(this.progressbarObject.x, this.progressbarObject.y, this.progressbarObject.width * this.currentXp / this.requiredXp, this.progressbarObject.height, this.progressbarObject.radius).fill();
    
        return this.ctx;
    };

    /**
     * Set the tag.
     * @param {String} tag The tag
     * @returns {RankCard}
     */

    setTag(tag) {
        if (!tag) throw new RangeError('[RANKCARD] Tag not provided.');
        if (typeof tag !== 'string') throw new TypeError('[RANKCARD] Tag must be a non-empty string.');

        this.tag = [tag.split('#')[0], `#${tag.split('#')[1]}`];

        return this;
    };

    /**
     * Set the avatar.
     * @param {String} avatar The avatar
     * @returns {RankCard}
     */

    setAvatar(avatar) {
        if (!avatar) throw new RangeError('[RANKCARD] Avatar not provided.');
        if (typeof avatar !== 'string') throw new TypeError('[RANKCARD] Avatar must be a non-empty URL.');

        this.avatar = avatar;

        return this;
    };

    /**
     * Set the level.
     * @param {Number} level The level
     * @returns {RankCard}
     */

    setLevel(level) {
        if (!level && level !== 0) throw new RangeError('[RANKCARD] Level not provided.');
        if (typeof level !== 'number') throw new TypeError('[RANKCARD] Level must be a non-null number.');

        this.level = level;

        return this;
    };

    /**
     * Set the current XP.
     * @param {Number} xp The xp
     * @returns {RankCard}
     */

    setCurrentXp(xp) {
        if (!xp && xp !== 0) throw new RangeError('[RANKCARD] XP not provided.');
        if (typeof xp !== 'number') throw new TypeError('[RANKCARD] XP must be a non-null number.');

        this.currentXp = xp;

        return this;
    };

    /**
     * Set the required XP.
     * @param {Number} xp The xp
     * @returns {RankCard}
     */

    setRequiredXp(xp) {
        if (!xp && xp !== 0) throw new RangeError('[RANKCARD] XP not provided.');
        if (typeof xp !== 'number') throw new TypeError('[RANKCARD] XP must be a non-null number.');

        this.requiredXp = xp;

        return this;
    };

    /**
     * Set the color.
     * @param {String} color The color
     * @returns {RankCard}
     */

    setColor(color) {
        if (!color) throw new RangeError('[RANKCARD] Color not provided.');

        this.colorsObject.main = color;

        return this;
    };

    /**
     * Draw the rank card.
     * @returns {Buffer}
     */

    build() {
        if (!this.tag) throw new RangeError('[RANKCARD] Tag not provided.');
        if (!this.avatar) throw new RangeError('[RANKCARD] Avatar not provided.');
        if (!this.level && this.level !== 0) throw new RangeError('[RANKCARD] Level not provided.');
        if (!this.currentXp && this.currentXp !== 0) throw new RangeError('[RANKCARD] Current XP not provided.');
        if (!this.requiredXp && this.requiredXp !== 0) throw new RangeError('[RANKCARD] Required XP not provided.');

        const canvas = createCanvas(this.width + (this.shadowObject.size * 2), this.height + (this.shadowObject.size * 2));
    
        const ctx = canvas.getContext('2d');

        this.ctx = ctx;
    
        return new Promise((resolve, _) => {
            this.drawShadow();
            this.drawBackground();
            this.drawLevel();
            this.drawUser();
            this.drawProgress();
            this.drawProgressBar();
    
    
            const avatar = new Image();
    
            avatar.src = this.avatar;
    
            avatar.onload = () => {
                ctx.save();
                ctx.beginPath();
    
                ctx.arc(this.avatarObject.x + this.avatarObject.xSize / 2, this.avatarObject.y + this.avatarObject.ySize / 2, this.avatarObject.xSize / 2, 0, Math.PI * 2, false);
    
                ctx.clip();
    
                ctx.drawImage(avatar, this.avatarObject.x, this.avatarObject.y, this.avatarObject.xSize, this.avatarObject.ySize);
    
                ctx.restore();
    
                resolve((new Frame(canvas)).toBuffer());
            };
        });
    };
};

module.exports = RankCard;