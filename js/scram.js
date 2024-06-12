import GameManager from './GameManager.js';
import DOMManager from './DOMManager.js';

const domManager = new DOMManager();
const game = new GameManager(domManager);

game.startGame();

domManager.newButton.addEventListener('click', async () => {
    await game.newWord();
})

domManager.checkButton.addEventListener('click', () => {
	game.checkWord();
})

domManager.hintButton.addEventListener('click', () => {
	game.giveHint();
})