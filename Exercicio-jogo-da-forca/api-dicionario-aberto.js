const baseUrlDicioAberto = "https://api.dicionario-aberto.net";

const baseUrlPapalavras = "http://papalavras-server.herokuapp.com/words";

const baseUrlDicioAPI = "https://dicio-api-ten.vercel.app/v2";

async function getRandomWord() {
    const response = await fetch(`${baseUrlDicioAberto}/random`);
    const data = await response.json();
    return data;
}

// async function getRandomWord1() {
//     const response = await fetch(`${baseUrlPapalavras}/random/`);
//     const data = await response.json();
//     return data;
// }


async function getWordDefinitionDicioAberto(word) {
    const response = await fetch(`${baseUrl}/word/${word}`);
    const data = await response.json();
    return data;
}

async function getWordDefinitionDicioAPI(word) {
    const response = await fetch(`${baseUrlDicioAPI}/${word}`);
    const data = await response.json();
    return data;
}

async function getWordSynonymsDicioAPI(word) {
    const response = await fetch(`${baseUrlDicioAPI}/sinonimos/${word}`);
    const data = await response.json();
    return data;
}

// let word = await getRandomWord();

// console.log("Word: ", word);

// let meaning = await getWordDefinitionDicioAPI(word.word);

// console.log("Meaning: ", meaning);
// console.log("Type: ", typeof meaning);
// console.log("Type: ", meaning.error);
// console.log("Type: ", meaning.meanings);


export async function getNewWord(){
    let newWord = await getRandomWord();
    let meaning = await getWordDefinitionDicioAPI(newWord.word);
    //let synonym = await getWordSynonymsDicioAPI(newWord.word);
    while(meaning.error !== undefined){
        newWord = await getRandomWord();
        meaning = await getWordDefinitionDicioAPI(newWord.word);
        //synonym = await getWordSynonymsDicioAPI(newWord.word);
    }
    return {word: newWord.word, tip: meaning[0].meanings[0]};
    //return {word: newWord.word, tip: meaning[0].meanings[0], synonym: synonym};
}

export async function getNewWordObject(){
    let newWord = await getRandomWord();
    let meaning = await getWordDefinitionDicioAPI(newWord.word);
    let synonym = await getWordSynonymsDicioAPI(newWord.word);
    while(meaning.error !== undefined){
        newWord = await getRandomWord();
        meaning = await getWordDefinitionDicioAPI(newWord.word);
        synonym = await getWordSynonymsDicioAPI(newWord.word);
    }
    return {word: newWord.word, definition: meaning[0].meanings[0], synonym: synonym};
}

//console.log(await getNewWord())
// https://github.com/ThiagoNelsi/dicio-api
// https://api.dicionario-aberto.net/index.html
// https://github.com/viniciusmesquitac/papalavras-server

// let word = await getRandomWord();
// console.log("Word: ", word);
// let meaning = await getWordDefinitionDicioAPI(word.word);
// let synonym = await getWordSynonymsDicioAPI(word.word);
// console.log("Meaning: ", meaning);
// console.log("Synonym: ", synonym);

let wordObject = await getNewWordObject();
console.log(wordObject);
