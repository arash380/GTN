const G6_LEVEL_LENGTH = 17000;
const NUMBER_OF_DIGITS = 10;
const  G6_NUM_COUNT = 899999999999999;
const G6_NUM_START = 100000000000000;

class Game6 extends Phaser.Scene {
    constructor() {
        super('Game6');
    }

    init() {
        this.correctAnswerCount = 0;
        this.gamesPlayedCount = 0;
        this.newBarEnd = 390;
        this.randomNumberCount = 0;
        this.lineIsFlashing = false;
        this.lineFlashingHasStarted = false;
        this.flashInterval;
    }

    preload() {
        this.load.image('check', '../../assets/G6/check.png');
        this.load.html('inputForm', '../../assets/G6/inputForm.html');
        this.load.image('gameBorder', '../../assets/gameBorder.png');
        this.load.image('mistake', '../../assets/mistake.png');
    }

    create() {
        // Blurring the background
        this.blur = this.add.rectangle(0, 0, 1600, 1216, 0x000000, 0.5);

        this.container = this.add.container(220, 60);

        this.gameBorder = this.add.image(0, 0, 'gameBorder');
        this.gameBorder.setDisplaySize(375.6, 484.8);
        this.gameBorder.setOrigin(0, 0);
        this.container.add(this.gameBorder);

        this.scoreText = this.add.text(160, 55, this.correctAnswerCount + "/" + this.gamesPlayedCount);
        this.scoreText.setFontSize(30);
        this.scoreText.setFontFamily('cursive');
        this.scoreText.setFill('#00FF00');
        this.scoreText.setStroke('#FFFFFF', 1);
        this.container.add(this.scoreText);

        this.gameText = this.add.text(80, 110, 'Enter how many time(s)\n   the shown digit has\nappeared in this number.');
        this.gameText.setFontSize(20);
        this.gameText.setFontFamily('cursive');
        this.gameText.setFill('#E05A00');
        this.gameText.setStroke('#000000', 0.8);
        this.container.add(this.gameText);

        this.timerLine = this.add.line(0, 22, TIME_BAR_START, 190, TIME_BAR_END, 190, 0x00FF00);
        this.timerLine.setLineWidth(4);
        this.container.add(this.timerLine);

        this.mistakeImage = this.add.image(275, 55, 'mistake');
        this.mistakeImage.setDisplaySize(40, 40);
        this.mistakeImage.setOrigin(0, 0);
        this.container.add(this.mistakeImage);

        // Creating the input form
        this.inputBox = this.add.dom(194, 315).createFromCache('inputForm');
        this.container.add(this.inputBox);

        // Checking the input when clicking enter
        this.input.keyboard.on('keydown-ENTER', function () {
            this.gamesPlayedCount++;
            if (this.inputBox.getChildByName('inputBox').value == this.randomNumberCount) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.inputBox.getChildByName('inputBox').value = '';
            this.checkIfDone();
            this.pickRandomNum();
        }.bind(this));

        this.check = this.add.image(195, 375, 'check');
        this.check.setDisplaySize(90, 39.6);
        this.check.setInteractive({
            cursor: 'pointer'
        }).on('pointerup', function () {
            this.gamesPlayedCount++;
            if (this.inputBox.getChildByName('inputBox').value == this.randomNumberCount) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.inputBox.getChildByName('inputBox').value = '';
            this.checkIfDone();
            this.pickRandomNum();
        }.bind(this));

        this.container.add(this.check);
        // The timer and the line that indicates how much time is left 
        let timerInterval = setInterval(function () {
            this.newBarEnd = this.newBarEnd - (TIME_BAR_LENGTH / (G6_LEVEL_LENGTH / TIMER_UPDATE_TIME));
            this.timerLine.setTo(TIME_BAR_START, 190, this.newBarEnd, 190);

            if (this.newBarEnd < TIMER_RED_COLOR_ZONE) {
                this.timerLine.setStrokeStyle(null, 0xFF0000);
            }

            if (this.newBarEnd < TIMER_FLASH_ZONE && !this.lineFlashingHasStarted) {
                this.startLineFlash();
            }

            if (this.newBarEnd < TIME_BAR_LENGTH) {
                clearInterval(this.flashInterval);
                this.timerLine.alpha = 0;
                clearInterval(timerInterval);

                // Mini game is lost.
                console.log('LOST');
            }
        }.bind(this), TIMER_UPDATE_TIME);

        this.numText = this.add.text(78, 218, '');
        this.digitText = this.add.text(185, 250, '');
        this.pickRandomNum();
    }

    /**
     * Picks random numbers and digits.
     */
    pickRandomNum() {
        this.num = Math.floor(Math.random() * G6_NUM_COUNT) + G6_NUM_START;
        this.digit = Math.floor(Math.random() * NUMBER_OF_DIGITS);

        this.randomNumberCount = 0;
        this.checkDigitCount();

        this.numText.setFontSize(26);
        this.numText.setFontFamily('cursive');
        this.numText.setFill('#e5c062');
        this.numText.setStroke('#000000', 0.8);
        this.numText.setText(this.num);
        this.container.add(this.numText);

        this.digitText.setFontSize(36);
        this.digitText.setFontFamily('cursive');
        this.digitText.setFill('#FF0000');
        this.digitText.setStroke('#000000', 0.8);
        this.digitText.setText(this.digit);
        this.container.add(this.digitText);
    }

    /**
     * Checks how many times the random digit appears in the random number.
     */
    checkDigitCount() {
        this.numString = this.num.toString();
        for (let i = 0; i < this.numString.length; i++) {
            if (parseInt(this.numString[i]) == this.digit) {
                this.randomNumberCount++;
            }
        }
    }

    /**
     * Flashed the timer line
     */
    startLineFlash() {
        this.lineFlashingHasStarted = true;
        this.flashInterval = setInterval(function () {
            if (this.lineIsFlashing) {
                this.timerLine.alpha = 0;
                this.lineIsFlashing = false;
            } else {
                this.timerLine.alpha = 1;
                this.lineIsFlashing = true;
            }
            
        }.bind(this), FLASH_UPDATE_TIME);
    }

    /**
     * Check if the mini game done.
     */
    checkIfDone() {
        if (this.correctAnswerCount == 5) {
            // Mini game is won.
            console.log('WON');
        }

        if (this.correctAnswerCount + 2 <= this.gamesPlayedCount) {
            // Mini game id lost.
            console.log('LOST');
        }
    }
}