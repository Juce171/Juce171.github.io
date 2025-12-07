document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const resultBox = document.getElementById("formResult");
    const successPopup = document.getElementById("successPopup");

    const fields = {
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address"),
        q1: document.getElementById("q1"),
        q2: document.getElementById("q2"),
        q3: document.getElementById("q3"),
    };

    // VALIDATORIAI
    const validators = {
        firstName: v => /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž-]+$/.test(v),
        lastName: v => /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž-]+$/.test(v),
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        address: v => v.length > 0,
        q1: v => v >= 1 && v <= 10,
        q2: v => v >= 1 && v <= 10,
        q3: v => v >= 1 && v <= 10,
    };

    // REAL-TIME VALIDACIJA
    Object.keys(fields).forEach(key => {
        if (key === "phone") return; // telefonas turi savo logiką

        fields[key].addEventListener("input", () => {
            validateField(fields[key], validators[key]);
            checkFormStatus();
        });
    });

    // TELEFONO FORMATAVIMAS
    fields.phone.addEventListener("input", () => {
        let digits = fields.phone.value.replace(/\D/g, "");
        digits = digits.substring(0, 11);

        let formatted = "+370";

        if (digits.length > 3) formatted += " " + digits[3];
        if (digits.length > 4) formatted += digits[4] + digits[5] || "";
        if (digits.length > 6) formatted += " " + digits.substring(6);

        fields.phone.value = formatted;

        checkFormStatus();
    });

    function validateField(input, validatorFn) {
        const value = input.value.trim();
        const valid = validatorFn(value);

        removeError(input);

        if (!valid) {
            input.classList.add("input-error");
            const err = document.createElement("div");
            err.classList.add("error-msg");
            err.innerText = "Neteisingai įvestas laukas";
            input.insertAdjacentElement("afterend", err);
        }
    }

    function removeError(input) {
        input.classList.remove("input-error");
        if (input.nextElementSibling?.classList.contains("error-msg")) {
            input.nextElementSibling.remove();
        }
    }

    // SUBMIT MYGTUKO VALDYMAS
    function checkFormStatus() {
        const anyEmpty = Object.values(fields).some(input => input.value.trim() === "");
        const anyErrors = document.querySelectorAll(".input-error").length > 0;

        submitBtn.disabled = anyEmpty || anyErrors;
    }

    checkFormStatus(); // pradžioje išjungiam

    // SUBMIT ĮVYKIS
    form.addEventListener("submit", function (event) {
    event.preventDefault();

    // SURINKTI DUOMENIS Į OBJEKTĄ
    const formData = {
        firstName: fields.firstName.value,
        lastName: fields.lastName.value,
        email: fields.email.value,
        phone: fields.phone.value,
        address: fields.address.value,
        ratings: {
            q1: Number(fields.q1.value),
            q2: Number(fields.q2.value),
            q3: Number(fields.q3.value)
        }
    };

    // 4.1 ✔ IŠVESTI OBJEKTĄ Į KONSOLĘ
    console.log("Formos duomenys:", formData);

    // VIDURKIS
    const avg =
        ((formData.ratings.q1 +
          formData.ratings.q2 +
          formData.ratings.q3) / 3).toFixed(1);

    // ATVAIZDAVIMAS PO FORMA
    resultBox.innerHTML = `
        <h3>Jūsų pateikti duomenys:</h3>
        <p><strong>Vardas:</strong> ${formData.firstName}</p>
        <p><strong>Pavardė:</strong> ${formData.lastName}</p>
        <p><strong>El. paštas:</strong> ${formData.email}</p>
        <p><strong>Telefonas:</strong> ${formData.phone}</p>
        <p><strong>Adresas:</strong> ${formData.address}</p>

        <h4>Vidurkis:</h4>
        <p><strong>${formData.firstName} ${formData.lastName}: ${avg}</strong></p>
    `;

    // POP-UP
    successPopup.style.display = "block";
    setTimeout(() => successPopup.style.display = "none", 2500);
    });

    // ----------------- VARIABLES -----------------
    const items = ["🍎","🍌","🍒","🍇","🥝","🍑"]; // unique cards
    let gameArray = [];
    let firstCard = null, secondCard = null;
    let moves = 0, pairs = 0;
    let level = "easy";

    // Timer
    let timerInterval;
    let seconds = 0;

    // Best scores from localStorage
    let bestScores = {
        easy: localStorage.getItem("best_easy") || null,
        hard: localStorage.getItem("best_hard") || null
    };

    // DOM Elements
    const board = document.getElementById("game-board");
    const movesEl = document.getElementById("moves");
    const pairsEl = document.getElementById("pairs");
    const winMessage = document.getElementById("win-message");
    const timerEl = document.getElementById("timer");
    const startBtn = document.getElementById("start-btn");
    const resetBtn = document.getElementById("reset-btn");

    // Difficulty radio buttons
    const difficultyRadios = document.querySelectorAll("input[name='level']");

    // Best score display
    function updateBestScores() {
        const easyScoreEl = document.getElementById("best-easy");
        const hardScoreEl = document.getElementById("best-hard");

        if (easyScoreEl) easyScoreEl.textContent = bestScores.easy ? bestScores.easy : "-";
        if (hardScoreEl) hardScoreEl.textContent = bestScores.hard ? bestScores.hard : "-";
    }
    updateBestScores();

    // ----------------- TIMER -----------------
    function startTimer() {
        seconds = 0;
        timerEl.textContent = "0:00";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            timerEl.textContent = `${min}:${sec.toString().padStart(2,"0")}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // ----------------- START GAME -----------------
    function startGame() {
        // get selected level
        level = document.querySelector("input[name='level']:checked").value;

        // define board size
        const rows = level === "easy" ? 3 : 4;
        const cols = level === "easy" ? 4 : 6;

        // prepare cards array and shuffle
        gameArray = [...items, ...items].sort(() => Math.random() - 0.5);

        // reset variables
        firstCard = null;
        secondCard = null;
        moves = 0;
        pairs = 0;

        movesEl.textContent = moves;
        pairsEl.textContent = pairs;
        winMessage.style.display = "none";

        // render board
        renderBoard(rows, cols);
    }

    function renderBoard(r, c) {
        board.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
        board.innerHTML = "";
        gameArray.forEach((item, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.value = item;
            card.addEventListener("click", flipCard);
            board.appendChild(card);
        });
    }

    // ----------------- FLIP LOGIC -----------------
    function flipCard() {
        if (this.classList.contains("flipped") || secondCard) return;

        this.textContent = this.dataset.value;
        this.classList.add("flipped");

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++;
        movesEl.textContent = moves;

        // check match
        if (firstCard.dataset.value === secondCard.dataset.value) {
            pairs++;
            pairsEl.textContent = pairs;

            firstCard = secondCard = null;

            // check win
            if (pairs === items.length) {
                winMessage.textContent = "Laimėjote!";
                winMessage.style.display = "block";
                stopTimer();
                checkBestScore(level, moves);
            }

        } else {
            setTimeout(() => {
                firstCard.textContent = "";
                secondCard.textContent = "";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                firstCard = secondCard = null;
            }, 1000);
        }
    }

    // ----------------- BEST SCORE -----------------
    function checkBestScore(level, moves) {
        if (!bestScores[level] || moves < bestScores[level]) {
            bestScores[level] = moves;
            localStorage.setItem(`best_${level}`, moves);
            updateBestScores();
        }
    }

    // ----------------- BUTTONS -----------------
   let gameStarted = false; // track if a game has started

    
    startBtn.addEventListener("click", () => {
        if (!gameStarted) {
            startGame();   
            startTimer();  
            gameStarted = true;
        }
    });

   
    resetBtn.addEventListener("click", () => {
        startGame();       
        startTimer();      
        firstCard = null;  
        secondCard = null;
        gameStarted = true; 
        winMessage.style.display = "none"; 
    });


});
