const G5_LEVEL_LENGTH = 23000;

class Game5 extends Phaser.Scene {
    constructor() {
        super('Game5');
    }

    init() {
        this.correctAnswerCount = 0;
        this.gamesPlayedCount = 0;
        this.newBarEnd = 390;
        this.inequalityIsTrue;
        this.lineIsFlashing = false;
        this.lineFlashingHasStarted = false;
        this.flashInterval;
    }

    preload() {
        this.load.image('true', '../../assets/G5/true.png');
        this.load.image('false', '../../assets/G5/false.png');
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

        this.gameText = this.add.text(72, 110, '   Indicate whether this\ninequality is true or false.');
        this.gameText.setFontSize(20);
        this.gameText.setFontFamily('cursive');
        this.gameText.setFill('#E05A00');
        this.gameText.setStroke('#000000', 0.8);
        this.container.add(this.gameText);

        this.timerLine = this.add.line(0, 0, TIME_BAR_START, 190, TIME_BAR_END, 190, 0x00FF00);
        this.timerLine.setLineWidth(4);
        this.container.add(this.timerLine);

        this.mistakeImage = this.add.image(275, 55, 'mistake');
        this.mistakeImage.setDisplaySize(40, 40);
        this.mistakeImage.setOrigin(0, 0);
        this.container.add(this.mistakeImage);

        this.true = this.add.image(130, 350, 'true');
        this.true.setDisplaySize(90, 39.6);
        this.true.setInteractive({
            cursor: 'pointer'
        }).on('pointerup', function () {
            this.gamesPlayedCount++;
            if (this.inequalityIsTrue) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.checkIfDone();
            this.pickRandomRange();
        }.bind(this));

        this.container.add(this.true);

        this.false = this.add.image(260, 350, 'false');
        this.false.setDisplaySize(90, 39.6);
        this.false.setInteractive({
            cursor: 'pointer'
        }).on('pointerup', function () {
            this.gamesPlayedCount++;
            if (!this.inequalityIsTrue) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.checkIfDone();
            this.pickRandomRange();
        }.bind(this));

        this.container.add(this.false);

        // The timer and the line that indicates how much time is left 
        let timerInterval = setInterval(function () {
            this.newBarEnd = this.newBarEnd - (TIME_BAR_LENGTH / (G5_LEVEL_LENGTH / TIMER_UPDATE_TIME));
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

        this.rangeText = this.add.text(85, 220, '');
        this.pickRandomRange();
    }

    /**
     * Picks random ranges.
     * The points may swap if the first point is bigger than the second one.
     */
    pickRandomRange() {
        this.point1 = {
            part_1: Math.floor(Math.random() * 11) + 40,
            part_2: Math.floor(Math.random() * 6) + 4
        };
        this.point2 = {
            part_1: Math.floor(Math.random() * 11) + 90,
            part_2: Math.floor(Math.random() * 6) + 10
        };
        if (this.point1.part_1 / this.point1.part_2 > this.point2.part_1 / this.point2.part_2) {
            let temp = {
                part_1: this.point1.part_1,
                part_2: this.point1.part_2
            }
            this.point1 = {
                part_1: this.point2.part_1,
                part_2: this.point2.part_2
            }

            this.point2 = {
                part_1: temp.part_1,
                part_2: temp.part_2
            }
        }

        this.testNum = Math.floor(Math.random() * 7) + 4;
        this.checkAns();

        this.rangeText.setText(this.point1.part_1 + "/" + this.point1.part_2 + "  < "
                             + this.testNum + " <  " + this.point2.part_1 + "/" + this.point2.part_2);
        this.rangeText.setFontSize(26);
        this.rangeText.setFontFamily('cursive');
        this.rangeText.setFill('#E05A00');
        this.rangeText.setStroke('#000000', 0.8);
        this.container.add(this.rangeText);
    }

    /**
     * Checks if the equation is correct or not and sets the boolean.
     */
    checkAns() {
        let p1 = this.point1.part_1 / this.point1.part_2;
        let p2 = this.point2.part_1 / this.point2.part_2;
        if (p1 < this.testNum && this.testNum < p2) {
            this.inequalityIsTrue = true;
        } else {
            this.inequalityIsTrue = false;
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