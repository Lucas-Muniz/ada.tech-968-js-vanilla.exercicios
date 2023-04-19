import { suporte, head, body, rightArm, leftArm, rightLeg, leftLeg } from './hangman-drawing-canvas.js';
import { getNewWord, getNewWordObject } from './api-dicionario-aberto.js';

let numberOfWrongGuesses = 0;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function normalize(str){
  function toNormalForm(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return toNormalForm(str).toUpperCase();
}

function createLetterBoxes(word){
  const wordContainer = document.querySelector("#word-container");

  const numberOfLetters = word.length;
  const normalizedWord = normalize(word);

  for(let letter = 0; letter < numberOfLetters; letter++){
    const spanItem = document.createElement("span");
    spanItem.classList.add("letter-item");
    //spanItem.textContent = normalizedWord[letter];
    wordContainer.append(spanItem);
  }
}

function createMapOfLetters(word){
  let mapLettersPositions = new Map();
  const numberOfLetters = word.length;
  const normalizedWord = normalize(word);

  for(let letterPosition = 0; letterPosition < numberOfLetters; letterPosition++){
    let letter = normalizedWord[letterPosition];
    if (mapLettersPositions.has(letter)){
      let vectorPositions = mapLettersPositions.get(letter);
      vectorPositions.push(letterPosition);
      mapLettersPositions.set(letter, vectorPositions);
    } else {
      mapLettersPositions.set(letter, [letterPosition]);
    }
  }
  return mapLettersPositions;
}

function checkLetterPosition(letter, mapLettersPositions){
  if(mapLettersPositions.has(letter)){
    return mapLettersPositions.get(letter);
  } 
  return [];
}

function updateWordContainer(word, positions){
  const wordContainer = document.querySelector("#word-container");
  const letterItens = wordContainer.getElementsByClassName("letter-item");
  for(let position of positions){
    letterItens[position].textContent = word[position];
    //letterItens.classList.remove("letter-item");
    letterItens[position].classList.add("correct-letter-item");
  }
}

function drawHangman(){
  const context = document.querySelector("canvas").getContext("2d");
  numberOfWrongGuesses++;
  switch(numberOfWrongGuesses){
    case 0:
      break;
    case 1:
      head(context);
      break;
    case 2:
      body(context);
      break;
    case 3:
      rightArm(context);
      break;
    case 4:
      leftArm(context);
      break;
    case 5:
      rightLeg(context);
      break;
    case 6:
      leftLeg(context);
      break;
    default:
      console.log("Você perdeu o jogo")
  }
}

function deactivateVirtualKeyboard(){
  let letterButtons = document.getElementsByClassName("letter-button");
  for(let button of letterButtons){
    button.disabled = true;
  }
}

function deactivateGame(){
  deactivateVirtualKeyboard();
  let resetButton = document.querySelector("#reset-button");
  //resetButton.textContent = "Reiniciar o jogo";
}

function highlightMissedWords(wordUpperCase){
  let letterItens = document.getElementsByClassName("letter-item");
  for(let position = 0; position < wordUpperCase.length; position++){
    let letter = letterItens[position];
    if(!letter.classList.contains("correct-letter-item")){
      letter.textContent = wordUpperCase[position];
      letter.style.color = "red";
    }
  }
}

function stopGame(wordUpperCase){
  let spanLoseMessage = document.querySelector("#game-result");
  spanLoseMessage.textContent = "Você perdeu! :( ";
  spanLoseMessage.style.color = "red";
  spanLoseMessage.style.fontSize = "25px";
  deactivateGame();
  highlightMissedWords(wordUpperCase);
}

function winGame(){
  let spanLoseMessage = document.querySelector("#game-result");
  spanLoseMessage.textContent = "Você ganhou! :) ";
  spanLoseMessage.style.color = "green";
  spanLoseMessage.style.fontSize = "25px";
  deactivateGame();
}


function createVirtualKeyboard(wordUpperCase, mapLettersPositions){
  let keyboardContainer = document.querySelector('#virtual-keyboard-container');

  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
                    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
                    'Y', 'Z'];

  keyboardContainer.classList.add("keyboard-container");

  for (let letter = 0; letter < alphabet.length; letter++){
      let letterButton = document.createElement("button");
      letterButton.textContent = alphabet[letter];
      letterButton.classList.add("letter-button");
      letterButton.addEventListener("click", (event) => {
        let positions = checkLetterPosition(event.target.textContent, mapLettersPositions);
        if (positions.length > 0){
          updateWordContainer(wordUpperCase, positions);
          numberOfLetters -= positions.length; 
          event.target.classList.add("correct-letter-button");
        } else {
          drawHangman();
          event.target.classList.add("incorrect-letter-button");
        }
        event.target.disabled = true;
        if (numberOfLetters === 0){
          console.log("numberOfLetters", numberOfLetters);
          winGame();
        } else if (numberOfWrongGuesses >= 6){
          console.log("numberOfWrongGuesses", numberOfWrongGuesses);
          stopGame(wordUpperCase);
        }
      });
      keyboardContainer.append(letterButton);
  }
}

// function setTip(tipText){
//   let spanTip = document.querySelector("#tip"); 
//   let buttonTip = document.querySelector("#word-tip-button"); 
//   buttonTip.addEventListener("click", () => {
//     spanTip.textContent = "Dica: " + tipText;
//   });
// }

function setTip(wordObject){
  let spanTip = document.querySelector("#tip"); 
  let buttonTip = document.querySelector("#word-tip-button"); 
  console.log(wordObject);
  spanTip.innerHTML = "";
  buttonTip.addEventListener("click", () => {
    if(wordObject.synonym.length !== 0){
      if (wordObject.synonym.length === 1){
        spanTip.innerHTML = `<b>Dica:</b> </br> [Sinônimo] ` + wordObject.synonym;
      } else {
        spanTip.innerHTML += `<b>Dica:</b> </br> [Sinônimos] `;
        for(let synonym of wordObject.synonym){
          spanTip.innerHTML += `${synonym}` + `, `;
        }
      }
    } else {
      spanTip.innerHTML = `<b>Dica:</b> </br> [Definição] ` + wordObject.definition;
    }
  });
}

let numberOfLetters;

async function init(){
  suporte(context);

  let wordObject = await getNewWordObject();

  let word = wordObject.word;
  setTip(wordObject);

  numberOfLetters = word.length;
  numberOfWrongGuesses = 0;
  let wordUpperCase = word.toUpperCase();
  createLetterBoxes(word);

  let mapLettersPositions = createMapOfLetters(word);
  
  
  createVirtualKeyboard(wordUpperCase, mapLettersPositions);

  console.log(createMapOfLetters(word));
}

async function resetGame(){
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const wordContainer = document.querySelector("#word-container");
  wordContainer.innerHTML = "";
  const keyboardContainer = document.querySelector('#virtual-keyboard-container');
  keyboardContainer.innerHTML = "";
  const spanLoseMessage = document.querySelector("#game-result");
  spanLoseMessage.innerHTML = "";
  let spanTip = document.querySelector("#tip"); 
  spanTip.innerHTML = "";
  spanTip.textContent = "";
  await init();
}

let resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", async function (){
  await resetGame();
});


await init();