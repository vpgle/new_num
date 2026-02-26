class Level2Game {
    constructor() {
        this.size = 4;
        this.totalCells = 16;
        this.numberCount = 8;
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
        this.fakeNextBtn = document.getElementById('fakeNextBtn');
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.fakeNextBtn.addEventListener('click', () => this.showFakeMessage());
    }

    initGame() {
        this.gameStarted = false;
        this.currentIndex = 0;
        this.message.textContent = '';
        this.message.className = 'message';

        this.generateNumbers();
        this.renderBoard();
    }

    generateNumbers() {
        const allNumbers = Array.from({ length: this.totalCells }, (_, i) => i + 1);
        this.shuffleArray(allNumbers);

        const selectedNumbers = allNumbers.slice(0, this.numberCount);
        this.sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

        const positions = Array.from({ length: this.totalCells }, (_, i) => i);
        this.shuffleArray(positions);

        this.numbers = new Array(this.totalCells).fill(null);
        selectedNumbers.forEach((num, index) => {
            this.numbers[positions[index]] = num;
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';

        this.numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = num !== null ? num : '';
            cell.dataset.number = num;
            cell.dataset.index = index;

            if (num !== null) {
                cell.classList.add('has-number');
                cell.addEventListener('click', () => this.handleCellClick(cell));
            } else {
                cell.style.cursor = 'default';
                cell.style.background = '#f5f5f5';
            }

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
            cell.style.background = '';
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
    }

    showFakeMessage() {
        this.message.textContent = 'Got you！骗到你了';
        this.message.className = 'message error';

        setTimeout(() => {
            this.message.textContent = '';
            this.message.className = 'message';
        }, 2000);
    }
}

new Level2Game();