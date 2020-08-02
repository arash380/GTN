const G2_NUMBER_MULTIPLIER = 100;

class Game2 extends Phaser.Scene {
    constructor() {
        super('Game2');
    }

    init() {
        this.correctAnswerCount = 0;
        this.gamesPlayedCount = 0;
        this.newBarEnd = 390;
        this.lineIsFlashing = false;
        this.lineFlashingHasStarted = false;
        this.numIsPrime;
        this.flashInterval;
        this.tempNum;
    }

    preload() {
        this.load.image('prime', '../../assets/G2/prime.png');
        this.load.image('not_prime', '../../assets/G2/not_prime.png');
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

        this.gameText = this.add.text(72, 110, ' Indicate whether these\nnumbers are prime or not.');
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

        this.prime = this.add.image(130, 350, 'prime');
        this.prime.setDisplaySize(90, 39.6);
        this.prime.setInteractive({
            cursor: 'pointer'
        }).on('pointerup', function () {
            this.gamesPlayedCount++;
            if (this.numIsPrime) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.checkIfDone();
            this.pickRandomNum();
        }.bind(this));

        this.container.add(this.prime);

        this.notPrime = this.add.image(260, 350, 'not_prime');
        this.notPrime.setDisplaySize(90, 39.6);
        this.notPrime.setInteractive({
            cursor: 'pointer'
        }).on('pointerup', function () {
            this.gamesPlayedCount++;
            if (!this.numIsPrime) {
                this.correctAnswerCount++;
            } else {
                this.mistakeImage.alpha = 0;
                this.scoreText.setFill('#FF0000');
            }
            this.scoreText.setText(this.correctAnswerCount + "/" + this.gamesPlayedCount);
            this.checkIfDone();
            this.pickRandomNum();
        }.bind(this));

        this.container.add(this.notPrime);

        // The timer and the line that indicates how much time is left 
        let timerInterval = setInterval(function () {
            this.newBarEnd = this.newBarEnd - (TIME_BAR_LENGTH / (LEVEL_LENGTH / TIMER_UPDATE_TIME));
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

        this.numText = this.add.text(182, 225, '');
        this.pickRandomNum();
        this.createNumCircle();
    }

    /**
     * Picks a random number.
     */
    pickRandomNum() {
        this.num = Math.floor(Math.random() * G2_NUMBER_MULTIPLIER);
        while (this.num == this.tempNum) {
            this.num = Math.floor(Math.random() * G2_NUMBER_MULTIPLIER);
        }
        this.tempNum = this.num;
        this.numText.setText(this.num);
        this.numText.setFontSize(45);
        this.numText.setFontFamily('cursive');
        this.numText.setFill('#E05A00');
        this.numText.setStroke('#000000', 0.8);
        this.container.add(this.numText);

        /*
        Changing the x value of the numText
        based on the number of the digits
        // */
        switch(this.num.toString().length) {
            case 1:
                this.numText.setX(182);
                break;
            case 2:
                this.numText.setX(168);
                break;
        }

        if (this.isPrime()) {
            this.numIsPrime = true;
        } else {
            this.numIsPrime = false;
        }
    }

    /**
     * Checks if the random number is prime or not.
     * 
     * @returns true if the number is prime, false otherwise. 
     */
    isPrime() {
        for (let i = 2; i < this.num; i++)
            if (this.num % i === 0) return false;
        return this.num > 1;
    }

    /**
     * Creates a circle around the number.
     */
    createNumCircle() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, 0xFF0000);
        this.graphics.strokeCircle(194, 250, 40);
        this.container.add(this.graphics);
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