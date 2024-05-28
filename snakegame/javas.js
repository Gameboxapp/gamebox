const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
// Obteniendo la puntuación más alta del almacenamiento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Puntos altos: ${highScore}`;

const updateFoodPosition = () => {
    // Pasando un valor aleatorio de 1 a 30 como posición de la comida
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Limpiando el temporizador y mostrando la carta de Game Over
    clearInterval(setIntervalId);
    document.getElementById("final-score").innerText = score;
    document.getElementById("final-high-score").innerText = highScore;
    document.getElementById("game-over-card").style.display = "block";
}

const changeDirection = e => {
    // Cambiando el valor de la velocidad según la tecla presionada
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Llamando a changeDirection en cada clic de tecla y pasando el valor del conjunto de datos de la tecla como un objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    // Comprobando si la serpiente ha alcanzado la comida
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Agregando la posición de la comida al array del cuerpo de la serpiente
        score++; // Incrementar la puntuación en 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntos: ${score}`;
        highScoreElement.innerText = `Puntos altos: ${highScore}`;
    }
    // Actualizando la posición de la cabeza de la serpiente según la velocidad actual
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Desplazando los valores de los elementos en el cuerpo de la serpiente hacia adelante en uno
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Estableciendo el primer elemento del cuerpo de la serpiente en la posición actual de la serpiente
    // Comprobando si la cabeza de la serpiente está fuera del muro, si es así, estableciendo gameOver a true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        // Agregando un div para cada parte del cuerpo de la serpiente
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Comprobando si la cabeza de la serpiente golpeó el cuerpo, si es así, establecer gameOver a true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 180); // Culebra más lenta
document.addEventListener("keyup", changeDirection);