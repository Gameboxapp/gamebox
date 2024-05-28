const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guess-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wronGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wronGuessCount = 0;
    hangmanImage.src = `images/hangman-${wronGuessCount}.svg`;
    guessesText.innerText = `${wronGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);

    // Limpiar el contenido de wordDisplay y añadir de nuevo los elementos li
    wordDisplay.innerHTML = "";
    currentWord.split("").forEach(letter => {
        let li = document.createElement("li");
        li.classList.add("letter");
        if (correctLetters.includes(letter)) {
            li.innerText = letter;
            li.classList.add("guessed");
        }
        wordDisplay.appendChild(li);
    });

    gameModal.classList.remove("show");
}


const getRandomWord = () => {
const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
currentWord = word;
console.log (word);
document.querySelector(".hint-text b").innerText = hint;
resetGame();
}
const Perdiste = (isVictory) => {
    setTimeout(() =>{
        const modalText = isVictory ? `La palabra era:`: `La palabra correcta es:`;
        gameModal.querySelector("img").src =`images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText =`${isVictory ? 'Felicidades!' : 'Perdiste'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show"); 
    },300);
}

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                let liElements = wordDisplay.querySelectorAll("li");
                liElements[index].innerText = letter;
                liElements[index].classList.add("guessed");
            }
        });
    } else {
        wronGuessCount++;
        hangmanImage.src = `images/hangman-${wronGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wronGuessCount} / ${maxGuesses}`;

    if (wronGuessCount === maxGuesses) return Perdiste(false);
    if (correctLetters.length === currentWord.length) return Perdiste(true);
} 

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("touchstart", e => initGame(e.target, String.fromCharCode(i))); // Usar touchstart en lugar de click
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
