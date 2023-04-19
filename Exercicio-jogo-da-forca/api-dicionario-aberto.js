const baseUrlDicioAberto = "https://api.dicionario-aberto.net";

const baseUrlDicioAPI = "https://dicio-api-ten.vercel.app/v2";

async function getRandomWord() {
    const response = await fetch(`${baseUrlDicioAberto}/random`);
    const data = await response.json();
    return data;
}

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


export async function getNewWord() {
    let newWord = await getRandomWord();
    let meaning = await getWordDefinitionDicioAPI(newWord.word);
    while (meaning.error !== undefined) {
        newWord = await getRandomWord();
        meaning = await getWordDefinitionDicioAPI(newWord.word);
    }
    return { word: newWord.word, tip: meaning[0].meanings[0] };
}

export async function getNewWordObject() {
    let newWord = await getRandomWord();
    let meaning = await getWordDefinitionDicioAPI(newWord.word);
    let synonym = await getWordSynonymsDicioAPI(newWord.word);
    while (meaning.error !== undefined || meaning === undefined) {
        newWord = await getRandomWord();
        meaning = await getWordDefinitionDicioAPI(newWord.word);
        synonym = await getWordSynonymsDicioAPI(newWord.word);
    }
    console.log("meaning[0].meanings[0]", meaning[0].meanings[0]);
    return { word: newWord.word, definition: meaning[0].meanings[0], synonym: synonym };
}