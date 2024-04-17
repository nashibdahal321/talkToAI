const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//     // SpeechRecognition API is supported
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
// } else {
//     // SpeechRecognition API is not supported
//     console.error('SpeechRecognition API is not supported in this browser.');
// }


recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Capture the DOM reference for the button UI, and listen for the click event to initiate speech recognition
// document.getElementById('speechButton').addEventListener('click', () => {
//     console.log('Speech start')
//     recognition.start();
// });

// Attach event listener to a parent element
document.getElementById('speechButton').addEventListener('click', function(event) {
    // Check if the clicked element is the speechButton
    console.log("Speech start: click event fired");
    recognition.start();
    // if (event.target && event.target.id === 'speechButton') {
    //     console.log('Speech start');
    //     recognition.start();
    // }
});


recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
  });

// Use the Result event to retrieve what was said in text
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    outputYou.textContent = text;
    console.log('Confidence: ' + e.results[last][0].confidence);
    socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
    console.log("Speech ended.")
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    outputBot.textContent = 'Error: ' + e.error;
});
  

// Give AI the voice with SpeechSynthesis interface
function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

 // Send back the voice to the browser
 socket.on('bot reply', function(replyText) {
    synthVoice(replyText);
    if(replyText == '') replyText = '(No answer...)';
    outputBot.textContent = replyText;
})
