class NumberGame {
    constructor() {
        this.size = 3;
        this.numbers = [];
        this.sortedNumbers = [];
        this.currentIndex = 0;
        this.gameStarted = false;

        this.initElements();
        this.initEventListeners();
        this.initGame();
    }

    initElements() {
        this.gameBoard = document.getElementById('gameBoard');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.message = document.getElementById('message');
        this.sizeBtns = document.querySelectorAll('.size-btn');
    }

    initEventListeners() {
        this.sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.size = parseInt(btn.dataset.size);
                this.initGame();
            });
        });

        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }

    initGame() {
        this.gameStarted = false;
        this.currentIndex = 0;
        this.message.textContent = '';
        this.message.className = 'message';

        const totalCells = this.size * this.size;
        this.numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
        this.shuffleArray(this.numbers);
        this.sortedNumbers = [...this.numbers].sort((a, b) => a - b);

        this.renderBoard();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board size-${this.size}`;

        this.numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = num;
            cell.dataset.number = num;
            cell.dataset.index = index;

            cell.addEventListener('click', () => this.handleCellClick(cell));

            this.gameBoard.appendChild(cell);
        });
    }

    startGame() {
        if (this.gameStarted) return;

        this.gameStarted = true;
        this.currentIndex = 0;
        this.message.textContent = '';
        this.message.className = 'message';

        const cells = this.gameBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('correct', 'wrong');
            cell.classList.add('hidden');
        });
    }

    handleCellClick(cell) {
        if (!this.gameStarted) {
            this.message.textContent = '请先点击"开始游戏"';
            this.message.className = 'message error';
            return;
        }

        if (cell.classList.contains('correct')) return;

        const clickedNumber = parseInt(cell.dataset.number);
        const expectedNumber = this.sortedNumbers[this.currentIndex];

        if (clickedNumber === expectedNumber) {
            cell.classList.remove('hidden');
            cell.classList.add('correct');
            this.currentIndex++;

            if (this.currentIndex === this.sortedNumbers.length) {
                this.message.textContent = '恭喜你！全部正确！';
                this.message.className = 'message success';
                this.gameStarted = false;
            }
        } else {
            this.message.textContent = `错误！应该点击 ${expectedNumber}`;
            this.message.className = 'message error';

            const cells = this.gameBoard.querySelectorAll('.cell');
            cells.forEach(c => {
                c.classList.remove('hidden');
                if (c === cell) {
                    c.classList.add('wrong');
                }
            });

            this.gameStarted = false;

            setTimeout(() => {
                cell.classList.remove('wrong');
            }, 500);
        }
    }

    resetGame() {
        this.initGame();
        this.startBtn.disabled = false;
    }
}

new NumberGame();