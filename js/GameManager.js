const HINT_PENALTY = 2;
const DEFAULT_WORD_LENGTH= 6;

const COLORS = {
    BLUE: 'blue',
    GREEN: 'green',
    RED: 'red'
};

export default class GameManager {
	constructor(domManager) {
		this.domManager = domManager;
		this.score = 0;
		this.wordLength = DEFAULT_WORD_LENGTH;
		this.word = ''
		this.scrambledWord = ''
		this.hint = ''
	}	

	async checkWord(){
		if (this.domManager.getGuess() === this.word) {
			this.setScore(this.word.length);
			this.domManager.updateWord(this.word);
			this.domManager.updateWordColor(COLORS.GREEN);
			this.domManager.checkButton.disabled = true;
		}
		else{
			this.domManager.updateWordColor(COLORS.RED);
		}
	}

	async fetchDefinition(retryCount = 0) {
		try {
			const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			this.hint = data[0].meanings[0].definitions[0].definition;
		} catch (error) {
			console.error(error);
			if (retryCount >= 5) { 
				console.error('Failed to fetch definition:', error);
			} else {
				await this.fetchRandomWord();
				await this.fetchDefinition(retryCount + 1); 
			}
		}
	}
	
	async fetchRandomWord() {
		try {
			const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${this.wordLength}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			this.word = data[0];
		} catch (error) {
			console.error('Failed to fetch new word:', error);
		}
	}
	
	async fetchNewWord() {
		await this.fetchRandomWord();
		await this.fetchDefinition();
	}

	async startGame() {
		this.domManager.loadingWord();
		await this.fetchNewWord();
		this.shuffleWord();
		this.domManager.updateWord(this.scrambledWord);
	}

	async newWord(){
		this.domManager.updateWord(this.word);
		this.domManager.updateWordColor(COLORS.BLUE);
		this.domManager.clearContent();
		this.wordLength = this.domManager.wordLength.value;
		await this.fetchNewWord();
		this.shuffleWord();
		this.domManager.updateWord(this.scrambledWord);
		this.domManager.disableButtons(false);
	}

	giveHint(){
		this.domManager.updateHint(this.hint);
		this.domManager.hintButton.disabled = true;
		this.setScore(-HINT_PENALTY);
	}

	setScore(value) {
		this.score += value;
		this.domManager.updateScore(this.score);
	}

	shuffleWord() {
		let shuffled = this.word.split('');
		do {
			for (let i = shuffled.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
		} while (shuffled.join('') === this.word);
	
		this.scrambledWord = shuffled.join('');
	}
}