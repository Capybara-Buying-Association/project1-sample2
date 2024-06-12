export default class DOMManager {
    constructor() {
        this.checkButton = document.getElementById('check-button');
        this.hintButton = document.getElementById('hint-button');
        this.newButton = document.getElementById('new-button');
        this.wordLength = document.getElementById('word-length-slider');
        this.guessInput = document.getElementById('guess-input');
        this.wordSection = document.querySelector('#word-section');
        this.hintSection = document.querySelector('#hint-section');
        this.scoreSection = document.querySelector('#score-section');
        this.displayedWord = this.wordSection.querySelector('h3');
        this.displayedHint = this.hintSection.querySelector('p');
        this.displayedScore = this.scoreSection.querySelector('p');
    }

	clearContent() {
		this.guessInput.value = '';
		this.displayedHint.textContent = '';
	}

	disableButtons(state) {
		this.checkButton.disabled = state;
		this.hintButton.disabled = state;
		this.newButton.disabled = state;
	}

	getGuess() {
		return this.guessInput.value.toLowerCase();
	}

    loadingWord() {
		this.displayedWord.textContent = "... loading";
		this.clearContent();
		this.disableButtons(true);
    }

	updateWordColor(color) {
		this.displayedWord.classList.add('transition-color');
		this.displayedWord.style.color = color;
	
		setTimeout(() => {
			this.displayedWord.style.color = 'black';
		}, 1000);
	}

    updateHint(hint) {
        this.displayedHint.textContent = hint;
    }

    updateScore(score) {
        this.displayedScore.textContent = `Current Score: ${score}`;
    }

	updateWord(word) {
		this.displayedWord.textContent = word;
		this.disableButtons(false);
	}
}