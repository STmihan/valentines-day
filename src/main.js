import "./style.css";


const answersContainerElement = document.querySelector(".answers");
const contentContainerElement = document.querySelector(".content");
const startScreenElement = document.querySelector(".start-screen");
const messagesScreenElement = document.querySelector(".messages-screen");
const openMessagesScreenButtonElement = document.querySelector("#openMessagesScreenButton");
openMessagesScreenButtonElement.addEventListener("click", openMessagesScreen);

const dialogue = [
    {
        messages: [
            "Привет",
            "Хотел сказать тебе кое-что очень очень важное",
        ],
        answers: [
            "Что?",
            "Да?",
            "Ммм?",
        ]
    },
    {
        messages: [
            "img:sticker.gif",
            "Ты cамая классная",
            "Ты самая красивая",
            "С тобой всегда невероятно приятно и комфортно",
            "С Днём Святого Валентина тебя! ❤️",
        ],
        answers: [
            "Спасибки 😊",
            "Нет ты 😘",
            "UwU ❤️",
        ]
    },
]

function scrollDown() {
    contentContainerElement.scrollTo({
        top: contentContainerElement.scrollHeight,
        behavior: "smooth",
    });
}

async function sendMessage(message, isAnswer = false) {
    playSound(!isAnswer ? "ding-new" : "newMessage-new");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("from-top");
    messageElement.classList.add(isAnswer ? "message-out" : "message-in");
    if (message.startsWith("img:")) {
        const img = document.createElement("img");
        img.src = message.replace("img:", "");
        messageElement.appendChild(img);
    } else {
        const p = document.createElement("p");
        p.textContent = message;
        messageElement.appendChild(p);
    }
    contentContainerElement.appendChild(messageElement);
    scrollDown();
    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function sendAnswer(answer) {
    hideAnswers();
    await sendMessage(answer, true);
}

function showAnswers(answers) {
    answersContainerElement.classList.remove("hidden");
    answers.forEach(answer => {
        const answerElement = document.createElement("button");
        answerElement.classList.add("answer");
        const span = document.createElement("span");
        span.textContent = answer;
        answerElement.appendChild(span);
        answerElement.addEventListener("click", async () => {
            await sendAnswer(answer);
            await nextBranch();
        });
        answersContainerElement.appendChild(answerElement);
    });
    scrollDown();
}

function hideAnswers() {
    answersContainerElement.classList.add("hidden");
    answersContainerElement.innerHTML = "";
}

async function nextBranch() {
    currentDialogue++;
    if (currentDialogue >= dialogue.length) {
        hideAnswers();
        const p = document.createElement("p");
        p.textContent = "Насть ❤️ ❤️ ❤️";
        contentContainerElement.appendChild(p);
        scrollDown();
    } else {
        for (const message of dialogue[currentDialogue].messages) {
            await sendMessage(message);
        }
        showAnswers(dialogue[currentDialogue].answers);
    }
}

function openMessagesScreen() {
    startScreenElement.classList.add("hidden");
    messagesScreenElement.classList.remove("hidden");
    nextBranch();
}

async function playSound(sound) {
    const audio = new Audio(`./sounds/${sound}.mp3`);
    audio.volume = 0.1;
    await audio.play();
}

let currentDialogue = -1;
