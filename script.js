const apiUrl = "https://clients5.google.com/translate_a/t";
const form = document.getElementById("translate-form");
const userInput = document.getElementById("user-input");
const translateBtn = document.getElementById("translate-btn");
const voiceBtn = document.getElementById("voice-btn");
const playBtn = document.getElementById("play-btn");
const targetLanguages = ["en", "ko", "es"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  translateText();
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    translateText();
  }
});

translateBtn.addEventListener("click", translateText);

voiceBtn.addEventListener("click", startVoiceRecognition);

playBtn.addEventListener("click", () => {
  const koreanText = document.getElementById("translation-ko").value;
  speakText(koreanText);
});

function translateText() {
  const userInputValue = userInput.value.trim();
  if (!userInputValue) {
    alert("Please enter some text to translate.");
    return;
  }

  const sourceLanguage = "auto";
  targetLanguages.forEach((targetLanguage) => {
    const params = `client=dict-chrome-ex&sl=${sourceLanguage}&tl=${targetLanguage}&q=${userInputValue}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiUrl}?${params}`, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response && response[0] && response[0][0]) {
          const translation = response[0][0];
          document.getElementById(`translation-${targetLanguage}`).value =
            translation;
        }
      }
    };
    xhr.send();
  });
}

function startVoiceRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    translateText();
  };

  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
  };

  recognition.start();
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  window.speechSynthesis.speak(utterance);
}
