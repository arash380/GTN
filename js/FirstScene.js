const QUESTION_PICK_MULTIPLIER = 10;
const ANSWER_PICK_MULTIPLIER = 1000;
const OPTION_1 = "Check if the number\neven or odd.";
const OPTION_2 = "Check if the number is\nprime or not.";
const OPTION_3 = "The multiplication\nof the digits.";
const OPTION_4 = "The sum of the digits.";
const OPTION_5 = "Narrow down the range\nthat the number is in.";
const OPTION_6 = "Check if the user's input\nis one of the digits.";
const OPTION_7 = "Check if the number is\nin the inputed range.";
const OPTION_8 = "Check if the number\n   is divisible by\nthe inputted number.";
const OPTION_9 = "Check if the number\nis smaller or bigger\nthan the inputed number.";
const OPTION_10 = "Check how many similiar\ndigits the number has.";


let pick1;
let pick2;
let pick3;
let displayOptionsCount = 0;
let shownOption1;
let shownOption2;
let shownOption3;

class FirstScene extends Phaser.Scene {
    constructor() {
        super('FirstScene');
    }

    preload() {
        this.load.image('image1', '../assets/1.png');
        this.load.image('image2', '../assets/2.png');
        this.load.image('image3', '../assets/3.png');
    }

    create() {
        this.questionPicker();

        let answer = Math.floor(Math.random() * ANSWER_PICK_MULTIPLIER);
        console.log("Answer: " + answer);

        this.image1 = this.add.image(150, 350, 'image1');
        this.image1.setDisplaySize(64, 64);
        this.image1.setInteractive().on('pointerup', function() {
            this.scene.launch('Game' + pick1);
        }.bind(this));

        this.image2 = this.add.image(400, 350, 'image2');
        this.image2.setDisplaySize(64, 64);
        this.image2.setInteractive().on('pointerup', function() {
            this.scene.launch('Game' + pick2);
        }.bind(this));

        this.image3 = this.add.image(650, 350, 'image3');
        this.image3.setDisplaySize(64, 64);
        this.image3.setInteractive().on('pointerup', function() {
            this.scene.launch('Game' + pick3);
        }.bind(this));

        // The loop used to display all the three options 
        for (let i = 0; i<= 2; i++) {
            this.displayOptions();
        }
    }

    /**
     * Picks the options that the user can choose
     */
    questionPicker() {
        pick1 = Math.floor(Math.random() * QUESTION_PICK_MULTIPLIER + 1);

        pick2 = Math.floor(Math.random() * QUESTION_PICK_MULTIPLIER + 1);
        while (!this.validPick(pick2)) {
            pick2 = Math.floor(Math.random() * QUESTION_PICK_MULTIPLIER + 1);
        }

        pick3 = Math.floor(Math.random() * QUESTION_PICK_MULTIPLIER + 1);
        while (!this.validPick(pick3)) {
            pick3 = Math.floor(Math.random() * QUESTION_PICK_MULTIPLIER + 1);
        }
    }

    /**
     * Checks if the picked options are valid or not
     * 
     * @param pick the pick that is being checked
     * @return true if the pick is valid, false otherwise
     */
    validPick(pick) {
        let pickCountCheck = 0;
        if (pick == pick1) {
            pickCountCheck++;
        }
        if (pick == pick2) {
            pickCountCheck++;
        }
        if (pick == pick3) {
            pickCountCheck++;
        }
        if (pickCountCheck > 1) {
            return false;
        }
        return true;
    }

    /**
     * Displays the options that the user have
     */
    displayOptions() {
        switch(displayOptionsCount) {
            case 0:
                shownOption1 = this.add.text(85, 150, eval("OPTION_" + pick1));
                displayOptionsCount++;
                break;
            case 1:
                shownOption2 = this.add.text(335, 150, eval("OPTION_" + pick2));
                displayOptionsCount++;
                break;
            default:
                shownOption3 = this.add.text(585, 150, eval("OPTION_" + pick3));
                displayOptionsCount++;
                break;
        }
    }
}