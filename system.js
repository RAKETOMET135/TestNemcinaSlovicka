class userStats{
    constructor(){
        this.correct = 0
        this.incorrect = 0
        this.hint = 0
        this.streak = 0
    }
}

class word{
    constructor(czWord, deWord, altWord, alt2Word, priority){
        this.czWord = czWord
        this.deWord = deWord
        this.alts = [altWord, alt2Word]
        this.correct = 0
        this.incorrect = 0
        this.timesDisplayed = 0
        this.timesHintUsed = 0
        this.chance = 0
        this.streak = 0
        this.maxStreak = 0

        if (priority){
            this.priority = priority
        }
        else{
            this.priority = 1
        }

        for (let index = 0; index < 2; index++){
            let possibleAnswers = []
            let correctWordString

            if (index === 0){
                for (let i = 0; i < this.alts.length; i++){
                    const alt = this.alts[i]
        
                    if (!alt) continue
                    if (alt === "") continue
        
                    possibleAnswers.push(alt)
                }
        
                correctWordString = this.deWord
            }
            else{
                correctWordString = this.czWord
            }
        
            let currentlyBuildedWord = ""
            for (let i = 0; i < correctWordString.length; i++){
                const letter = correctWordString.slice(i, i +1)
        
                if (letter === ","){
                    possibleAnswers.push(currentlyBuildedWord)
                    currentlyBuildedWord = ""
                    continue
                }
        
                if (letter === " "){
                    if (correctWordString.slice(i -1, i) === "," || correctWordString.slice(i +1, i +2) === "("){
                        continue
                    }
                }
        
                if (letter === "("){
                    possibleAnswers.push(currentlyBuildedWord)
                    currentlyBuildedWord = ""
                    continue
                }
        
                if (letter === ")"){
                    possibleAnswers.push(currentlyBuildedWord)
                    currentlyBuildedWord = ""
                    continue
                }
        
                currentlyBuildedWord += letter
        
                if (i === correctWordString.length -1) possibleAnswers.push(currentlyBuildedWord)
            }

            if (index === 0){
                this.dePossibleAnswers = possibleAnswers
            }
            else{
                this.czPossibleAnswers = possibleAnswers
            }
        }
    }
}

class hoverElement{
    constructor(text, width, element){
        this.text = text
        this.width = width
        this.element = element
    }
}

const elements = document.querySelectorAll("body *")
const category = document.querySelector("#category")
const displayedWord = document.querySelector("#given-word")
const submitButton = document.querySelector("#submit")
const inputText = document.querySelector("#input-text")
const skipCorrectAnswerButton = document.querySelector("#skip-answer")
const upperCaseButton = document.querySelector("#upper-case")
const flipWordsButton = document.querySelector("#flip-words")
const tutorialText = document.querySelector("#tutorial")
const hintButtons = [document.querySelector("#hint"), document.querySelector("#hint-mobile")]
const correctAnswersText = document.querySelector("#correct-answers")
const incorrectAnswersText = document.querySelector("#incorrect-answers")
const streakText = document.querySelector("#streak")
const streakImage = document.querySelector("#streak-image")
const correctImage = document.querySelector("#correct-image")
const incorrectImage = document.querySelector("#incorrect-image")
const aButton = document.querySelector("#a")
const uButton = document.querySelector("#u")
const oButton = document.querySelector("#o")
const ssButton = document.querySelector("#ss")
const warningText = document.querySelector(".warning-text")
const voiceButton = document.querySelector("#voice")
const voiceButtonImage = document.querySelector(".voice-image")
const voiceRepeatButton = document.querySelector("#voice-repeat")
const voiceRepeatButtonImage = document.querySelector(".voice-repeat-image")
const wordListButton = document.querySelector("#word-list-button")
const allWordsSeenMark = document.querySelector("#all-words-seen")
const hoverElements = [
    new hoverElement(["Další", "Zkontrolovat"], ["60px", "110px"], [submitButton]),
    new hoverElement(["Nápověda"], ["90px"], hintButtons), 
    new hoverElement(["Přeskočit správnou odpověď"], ["220px"], [skipCorrectAnswerButton]),
    new hoverElement(["Prohodit slova"], ["120px"], [flipWordsButton]), 
    new hoverElement(["Velká písmena", "Malá písmena"], ["120px", "115px"], [upperCaseButton]),
    new hoverElement(["Přidat A s přehláskou"], ["165px"], [aButton]),
    new hoverElement(["Přidat O s přehláskou"], ["165px"], [oButton]),
    new hoverElement(["Přidat U s přehláskou"], ["165px"], [uButton]),
    new hoverElement(["Přidat ostré S"], ["115px"], [ssButton]),
    new hoverElement(["Předčítat slovíčka", "Nepředčítat slovíčka"], ["145px", "165px"], [voiceButton]),
    new hoverElement(["Zopakovat slovo"], ["125px"], [voiceRepeatButton])
]
const tutorialInfoText = ["Slovo, které je napsané v češtině, napiš do boxu německy. Cílem je naučit se německá slovíčka.", 
                            "Slovo, které je napsané v němčině, napiš do boxu česky. Cílem je naučit se německá slovíčka."]
const tutorialInfoTextTTS = ["Slovo, které slyšíš v češtině, napiš do boxu německy. Cílem je naučit se německá slovíčka.",
                                "Slovo, které slyšíš v němčině, napiš do boxu česky. Cílem je naučit se německá slovíčka."]

let hoverTextYOffset = -25
let language = "de"
let currentLoadedFileName = ""
let hint = ""
let skipCorrectWord = false
let upperCase = false
let inputFocus = false
let lowDetail = false
let stats = new userStats()

let isWordInspect = false
let altHolded = false

let currentHoverText

let words = []
let currentWord
let prevWord
let lastIncorrectWord

let tts = false
let speachText = new SpeechSynthesisUtterance()

let isOnLoadDisplay = false

function LoadFile(fileName){
    Reset()
    fileName = "Lekce/" + fileName

    let http = new XMLHttpRequest()
    http.open("get", fileName, true)
    http.send()
    http.onload = function(){
        if (this.readyState == 4 && this.status == 200){
            data = JSON.parse(this.responseText)
            for(let fileWord of data.words){
                words.push(new word(fileWord.cz, fileWord.de, fileWord.alt, fileWord.alt2, fileWord.priority))
            }
            OnFileLoaded()
        }
    }

    currentLoadedFileName = fileName

    return
}

function Reset(){
    words = []
    hint = ""
    isWordInspect = false
    currentWord = null
    prevWord = null
    stats = new userStats()
}

function ResetInputText(){
    inputText.readOnly = false
    inputText.value = ""
    if (!lowDetail){
        inputText.style.color = "white"
    }
    else{
        inputText.style.color = "black"
    }
}

function SayWord(usedWord){
    window.speechSynthesis.cancel()

    if (language === "de"){
        speachText.text = usedWord.czWord
        speachText.lang = "cs-CS"
    }
    else{
        speachText.text = usedWord.deWord
        speachText.lang = "de-DE"
    }

    window.speechSynthesis.speak(speachText)
}

function DisplayWord(){
    let pickedWord

    let totalWordChance = 0
    let usedWordChance = 0

    for (let i = 0; i < words.length; i++){
        const thisWord = words[i]

        let wordUserSuccess = 1000 - (Math.abs(thisWord.incorrect - thisWord.correct) *50)

        if (thisWord.correct > thisWord.incorrect) wordUserSuccess = 1000
        if (wordUserSuccess < 1) wordUserSuccess = 10

        const wordDisplaySuccess = thisWord.timesDisplayed + 1

        let wordChance = 100000 / wordUserSuccess / wordDisplaySuccess

        if (thisWord === prevWord){
            wordChance = 0
        }
        else if (prevWord){
            if (thisWord.czWord === prevWord.czWord){
                wordChance = 0
            }
        }

        wordChance *= thisWord.priority

        thisWord.chance = wordChance
        totalWordChance += wordChance
    }

    const chosedNumber = Math.floor(Math.random() * totalWordChance +1)

    for (let i = 0; i < words.length; i++){
        const thisWord = words[i]

        if (thisWord.chance === 0) continue

        if (chosedNumber > usedWordChance && chosedNumber <= usedWordChance + thisWord.chance){
            pickedWord = thisWord

            break
        }

        usedWordChance += thisWord.chance
    }

    let chanceForIncorrect = Math.floor(Math.random() * 2)
    if (chanceForIncorrect === 0){
        let allIncorrectWords = []

        for (let i = 0; i < words.length; i++){
            const thisWord = words[i]

            if (thisWord.incorrect > thisWord.correct && currentWord !== thisWord){
                allIncorrectWords.push(thisWord)
            }
        }

        if (allIncorrectWords.length > 0) pickedWord = allIncorrectWords[Math.floor(Math.random() * allIncorrectWords.length)]
    }

    if (!tts){
        if (language === "de"){
            displayedWord.innerText = pickedWord.czWord
        }
        else{
            displayedWord.innerText = pickedWord.deWord
        }
    }
    else{
        if (!isWordInspect){
            SayWord(pickedWord)
        }
    }

    currentWord = pickedWord
    prevWord = pickedWord

    hint = ""

    ResetInputText()

    if (isOnLoadDisplay){
        isOnLoadDisplay = false
    }
    else{
        pickedWord.timesDisplayed += 1
    }
}

function SubmitUserInput(){
    if (isWordInspect){
        isWordInspect = false
        submitButton.innerText = "✓"
        if (currentHoverText){
            if (currentHoverText.innerText === "Další"){
                currentHoverText.innerText = "Zkontrolovat"
                currentHoverText.style.width = "110px"
            }
        }
        DisplayWord()
        return
    }
    submitButton.innerText = "➔"
    if (currentHoverText){
        if (currentHoverText.innerText === "Zkontrolovat"){
            currentHoverText.innerText = "Další"
            currentHoverText.style.width = "60px"
        }
    }

    window.speechSynthesis.cancel()

    const userInput = inputText.value

    inputText.readOnly = true

    let possibleAnswers = []
    let userAnswers = []

    if (language === "de"){
        possibleAnswers = currentWord.dePossibleAnswers
    }
    else{
        possibleAnswers = currentWord.czPossibleAnswers
    }

    let currentlyBuildedWord = ""
    for (let i = 0; i < userInput.length; i++){
        const letter = userInput.slice(i, i +1)

        if (letter === ","){
            userAnswers.push(currentlyBuildedWord)
            currentlyBuildedWord = ""
            continue
        }

        if (letter === " "){
            if (userInput.slice(i -1, i) === "," || userInput.slice(i +1, i +2) === "("){
                continue
            }
        }

        if (letter === "("){
            userAnswers.push(currentlyBuildedWord)
            currentlyBuildedWord = ""
            continue
        }

        if (letter === ")"){
            userAnswers.push(currentlyBuildedWord)
            currentlyBuildedWord = ""
            continue
        }

        currentlyBuildedWord += letter

        if (i === userInput.length -1) userAnswers.push(currentlyBuildedWord)
    }

    let allAnsweredWordsCorrect = true
    for (let i = 0; i < userAnswers.length; i++){
        const userAnswer = userAnswers[i]
        let isCorrect = false

        for (let j = 0; j < possibleAnswers.length; j++){
            const possibleAnswer = possibleAnswers[j]

            if (possibleAnswer === userAnswer){
                isCorrect = true
                break
            }
        }

        if (!isCorrect) allAnsweredWordsCorrect = false
    }

    if (userAnswers.length < 1) allAnsweredWordsCorrect = false

    ChangeAllSeenMarkState()

    if (allAnsweredWordsCorrect){
        OnCorrectAnswer()
    }
    else{
        OnIncorrectAnswer()
    }
}

function ChangeAllSeenMarkState(){
    let allWordsSeen = true

    for (let i = 0; i < words.length; i++){
        const thisWord = words[i]

        if (thisWord.timesDisplayed < 1) allWordsSeen = false
    }

    if (allWordsSeen){
        allWordsSeenMark.style.visibility = "visible"
    }
    else{
        allWordsSeenMark.style.visibility = "hidden"
    }

    allWordsSeenMark.style.width = "10px"
    allWordsSeenMark.style.height = "10px"
}

function IsSmallScreenDevice(){
    var narrowDevice = false
    if (window.screen.width <= 1000){
        narrowDevice = true
    }
    return narrowDevice
}

function InsertAtCursor(inputElement, letter) {
    if (document.selection) {
        inputElement.focus()
        let selected = document.selection.createRange()
        selected.text = letter
        selected.moveStart("character", letter.length)
        selected.select()
    }
    else if (inputElement.selectionStart || inputElement.selectionStart == '0') {
        let startPos = inputElement.selectionStart
        let endPos = inputElement.selectionEnd
        inputElement.value = inputElement.value.substring(0, startPos)
            + letter
            + inputElement.value.substring(endPos, inputElement.value.length)
        inputElement.selectionStart = startPos + letter.length
        inputElement.selectionEnd = startPos + letter.length
    } else {
        inputElement.value += letter
    }
}

function Hint(){
    if (isWordInspect) return

    inputText.style.color = "blue"

    let correctAnswer
    if (language === "de"){
        correctAnswer = currentWord.dePossibleAnswers[0]
    }
    else{
        correctAnswer = currentWord.czPossibleAnswers[0]
    }

    if (hint.length === 0){
        const before = correctAnswer.slice(0, 4)

        if (before === "der " || before === "die " || before === "das "){
            hint = before
        }
        else{
            hint = correctAnswer.slice(0, 1)
        }
    }
    else{
        hint = correctAnswer.slice(0, hint.length +1)
    }

    inputText.value = hint
    inputText.focus()
}

function DisplayUserStats(){
    correctAnswersText.innerText = stats.correct
    incorrectAnswersText.innerText = stats.incorrect
    streakText.innerText = stats.streak

    const streakScale = 1 * (stats.streak/30) +1
    streakImage.style.transform = "scale(" + streakScale + ", " + streakScale + ")"
}

async function DynamicAnswer(ansColor){
    if (lowDetail) return

    const inputTextDiv = document.querySelector(".input-word")

    for (let e of document.getElementsByClassName("text")){
        if (e.id === "correct-answers" || e.id === "incorrect-answers" || e.id === "streak" || e.id === "input-text"){
            continue
        }

        e.style.color = ansColor
        e.style.borderColor = ansColor
    }
    inputTextDiv.style.borderColor = ansColor
    for (let r of document.getElementsByClassName("selection")){
        r.style.borderColor = ansColor
    }

    const caBorder = document.getElementById("ca-border")
    const iaBorder = document.getElementById("ia-border")
    if (ansColor === "green"){
        caBorder.style.animation = "pulse"
        caBorder.style.animationDuration = "0.15s"
        caBorder.style.background = "rgb(2, 0, 36)"
        caBorder.style.background = "linear-gradient(45deg, rgb(39, 177, 5) 0%, rgb(35, 141, 8) 18%, rgb(39, 177, 5) 45%, rgb(31, 126, 7) 79%, rgb(39, 177, 5) 100%)"
    }
    else if (ansColor === "red"){
        iaBorder.style.animation = "pulse2"
        iaBorder.style.animationDuration = "0.15s"
        iaBorder.style.background = "rgb(2, 0, 36)"
        iaBorder.style.background = "linear-gradient(45deg, rgb(190, 25, 0) 0%, rgb(185, 5, 5) 18%, rgb(185, 20, 5) 45%, rgb(185, 20, 5) 79%, rgb(185, 20, 5) 100%"
    }

    await Wait(0.15)
    if (lowDetail) return

    caBorder.style.animation = "none"
    caBorder.style.background = "transparent"
    iaBorder.style.animation = "none"
    iaBorder.style.background = "transparent"
    
    for (let e of document.getElementsByClassName("text")){
        if (e.id === "correct-answers" || e.id === "incorrect-answers" || e.id === "streak" || e.id === "input-text"){
            continue
        }

        e.style.color = "#ffffff"
        e.style.borderColor = "#ffffff"
    }
    for (let r of document.getElementsByClassName("selection")){
        r.style.borderColor = "white"
    }
    inputTextDiv.style.borderColor = "white"
}

async function ColorChange(element, color){
    let oldColor = element.style.color
    element.style.color = color
    element.style.transform = "scale(1.5)"

    await Wait(0.2)

    element.style.transform = "scale(1)"
    element.style.color = oldColor
}

async function Wait(seconds){
    return new Promise((resolve) => setTimeout(resolve, seconds*1000))
}

function CreateHoverText(){
    let hoverText = document.createElement("div")
    let htStyle = hoverText.style
    htStyle.position = "absolute"
    htStyle.color = "#ffffff"
    htStyle.fontFamily = "Roboto"
    htStyle.fontSize = "15px"
    htStyle.height = "20px"
    htStyle.background = "rgb(2, 0, 36)"
    htStyle.background = "linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(30,30,30,1) 18%, rgba(50,50,50,1) 45%, rgba(30,30,30,1) 79%, rgba(0,0,0,1) 100%)"
    htStyle.backgroundSize = "200% 200%"
    htStyle.animation = "gradient-animation"
    htStyle.animationDuration = "10s"
    htStyle.animationFillMode = "ease"
    htStyle.animationIterationCount = "infinite"
    htStyle.textAlign = "center"
    htStyle.transform = "translate(-45%)"
    htStyle.border = "white solid 1px"
    htStyle.borderRadius = "10px"

    return hoverText
}

function UpdateHoverText(thisHoverElement, thisElement, hoverText){
    let isDefualtHoverText = true

    if (thisElement === submitButton){
        if (thisElement.innerText !== "➔"){
            hoverText.innerText = thisHoverElement.text[1]
            hoverText.style.width = thisHoverElement.width[1]
            isDefualtHoverText = false
        }
    }
    else if (thisElement === upperCaseButton){
        if (upperCase){
            hoverText.innerText = thisHoverElement.text[1]
            hoverText.style.width = thisHoverElement.width[1]
            isDefualtHoverText = false
        }
    }
    else if (thisElement === voiceButton){
        if (tts){
            hoverText.innerText = thisHoverElement.text[1]
            hoverText.style.width = thisHoverElement.width[1]
            isDefualtHoverText = false
        }
    }
 
    if (isDefualtHoverText){
        hoverText.innerText = thisHoverElement.text[0]
        hoverText.style.width = thisHoverElement.width[0]
    }
}

function SwitchTTS(){
    tts = !tts
    if (currentHoverText){
        if (currentHoverText.innerText === "Předčítat slovíčka"){
            currentHoverText.innerText = "Nepředčítat slovíčka"
            currentHoverText.style.width = "165px"
        }
        else if (currentHoverText.innerText === "Nepředčítat slovíčka"){
            currentHoverText.innerText = "Předčítat slovíčka"
            currentHoverText.style.width = "145px"
        }
    }

    if (tts){
        displayedWord.innerText = ""
        voiceButtonImage.src = "Images/NoVoiceIcon.png"
        voiceRepeatButton.style.visibility = "visible"

        if (!isWordInspect){
            SayWord(currentWord)
        }

        if (language === "de"){
            tutorialText.innerText = tutorialInfoTextTTS[0]
        }
        else{
            tutorialText.innerText = tutorialInfoTextTTS[1]
        }
    }
    else{
        if (language === "de"){
            displayedWord.innerText = currentWord.czWord
        }
        else{
            displayedWord.innerText = currentWord.deWord
        }
        voiceButtonImage.src = "Images/VoiceIcon.png"
        voiceRepeatButton.style.visibility = "hidden"

        window.speechSynthesis.cancel()

        if (language === "de"){
            tutorialText.innerText = tutorialInfoText[0]
        }
        else{
            tutorialText.innerText = tutorialInfoText[1]
        }
    }
}

function UpperCase(isFocus){
    upperCase = !upperCase

    if (upperCase){
        aButton.innerText = "Ä"
        uButton.innerText = "Ü"
        oButton.innerText = "Ö"

        if (currentHoverText){
            currentHoverText.innerText = "Malá písmena"
        }
    }
    else{
        aButton.innerText = "ä"
        uButton.innerText = "ü"
        oButton.innerText = "ö"

        if (currentHoverText){
            currentHoverText.innerText = "Velká písmena"
        }
    }

    if (isFocus){
        inputText.focus()
    }
}

function SkipCorrectAnswer(){
    skipCorrectWord = !skipCorrectWord

    if (skipCorrectWord){
        skipCorrectAnswerButton.innerText = "||"
    }
    else{
        skipCorrectAnswerButton.innerText = "≪"
    }
}

function CreateWordDataObject(){
    let wordDataObject = {
        wordsList: words,
        wordCategory: currentLoadedFileName,
        wordStreak: stats.streak,
        wordHint: stats.hint,
        wordDisplayed: currentWord,
        isTTS: tts,
        isUpperCase: upperCase,
        language: language,
        skipCorrectWord: skipCorrectWord,
        isWordInspect: isWordInspect,
        userText: inputText.value,
        userTextColor: inputText.style.color,
        hint: hint,
        wordCorrect: stats.correct,
        wordIncorrect: stats.incorrect,
        prevWord: prevWord,
        isLDM: lowDetail
    }

    sessionStorage.setItem("wordData", JSON.stringify(wordDataObject))
}

function ShowWordList(){
    CreateWordDataObject()

    window.location.href = "words_list.html"
}

function OnFileLoaded(){
    const wordData = JSON.parse(sessionStorage.getItem("wordData"))
    let isSessionData = false
    let userText = ""

    if (wordData){
        if (wordData.wordsList){
            words = wordData.wordsList

            stats.correct = wordData.wordCorrect
            stats.incorrect = wordData.wordIncorrect
            stats.streak = wordData.wordStreak
            stats.hint = wordData.wordHint
        }

        if (wordData.language){
            language = wordData.language
        }

        if (wordData.isWordInspect){
            isWordInspect = wordData.isWordInspect
        }

        if (wordData.userText){
            userText = wordData.userText
        }

        if (wordData.prevWord){
            prevWord = wordData.prevWord
        }

        category.value = wordData.wordCategory.slice(6, wordData.wordCategory.length - 5)
        currentLoadedFileName = wordData.wordCategory

        isSessionData = true

        if (wordData.wordDisplayed){
            isOnLoadDisplay = true
        }
    }

    DisplayWord()

    if (isSessionData){
        if (wordData.isTTS){
            SwitchTTS()
        }
        if (wordData.isUpperCase){
            UpperCase(false)
        }
        if (wordData.skipCorrectWord){
            SkipCorrectAnswer()
        }

        if (wordData.wordDisplayed){
            if (!tts){
                if (language === "de"){
                    displayedWord.innerText = wordData.wordDisplayed.czWord
                }
                else{
                    displayedWord.innerText = wordData.wordDisplayed.deWord
                }
            }
            else{
                if (!isWordInspect){
                    SayWord(wordData.wordDisplayed)
                }
            }
        
            currentWord = wordData.wordDisplayed
            prevWord = wordData.wordDisplayed
        
            ResetInputText()
        }

        inputText.value = userText

        if (wordData.userTextColor){
            inputText.style.color = wordData.userTextColor
        }
        if (isWordInspect){
            inputText.readOnly = true
            submitButton.innerText = "➔"
            if (currentHoverText){
                if (currentHoverText.innerText === "Zkontrolovat"){
                    currentHoverText.innerText = "Další"
                    currentHoverText.style.width = "60px"
                }
            }
        }
        if (wordData.hint){
            hint = wordData.hint
        }

        if (wordData.isLDM){
            LowDetailMode()
        }
    }

    DisplayUserStats()
    ChangeAllSeenMarkState()
}

function OnCorrectAnswer(){
    isWordInspect = true
    if (hint === ""){
        stats.correct += 1
        stats.streak += 1
        for (let i = 0; i < words.length; i++){
            const thisWord = words[i]

            if (thisWord.czWord === currentWord.czWord){
                words[i].correct += 1
                words[i].streak += 1

                if (words[i].maxStreak < words[i].streak){
                    words[i].maxStreak = words[i].streak
                } 
            }
        }

        DynamicAnswer("green")
        ColorChange(correctAnswersText, "green")
        ColorChange(streakText, "orange")
    }
    else{
        stats.hint += 1
        for (let i = 0; i < words.length; i++){
            const thisWord = words[i]

            if (thisWord.czWord === currentWord.czWord){
                words[i].timesHintUsed += 1
            }
        }

        DynamicAnswer("blue")
    }

    if (skipCorrectWord){
        isWordInspect = false
        submitButton.innerText = "✓"
        if (currentHoverText){
            if (currentHoverText.innerText === "Další"){
                currentHoverText.innerText = "Zkontrolovat"
                currentHoverText.style.width = "110px"
            }
        }
        DisplayWord()
    }
    else{
        inputText.style.color = "green"
    }

    DisplayUserStats()
}

function OnIncorrectAnswer(){
    for (let i = 0; i < words.length; i++){
        const thisWord = words[i]

        if (thisWord.czWord === currentWord.czWord){
            words[i].incorrect += 1
            words[i].streak = 0
        }
    }
    isWordInspect = true
    stats.incorrect += 1
    stats.streak = 0
    lastIncorrectWord = currentWord

    inputText.style.color = "red"

    DynamicAnswer("red")
    ColorChange(incorrectAnswersText, "red")

    if (!IsSmallScreenDevice()){
        if (language === "de"){
            inputText.value = inputText.value + " => " + currentWord.deWord
        }
        else{
            inputText.value = inputText.value + " => " + currentWord.czWord
        }
    }
    else{
        if (language === "de"){
            inputText.value = currentWord.deWord
        }
        else{
            inputText.value = currentWord.czWord
        }
    }

    DisplayUserStats()
}

function OnKeyDown(e){
    if (e.key === "Enter"){
        SubmitUserInput()
    }
    if (e.key === "Alt"){
        altHolded = true
    }

    if (e.key === "a" && altHolded){
        InsertAtCursor(inputText, "ä")
    }
    else if (e.key === "A" && altHolded){
        InsertAtCursor(inputText, "Ä")
    }
    else if (e.key === "o" && altHolded){
        InsertAtCursor(inputText, "ö")
    }
    else if (e.key === "O" && altHolded){
        InsertAtCursor(inputText, "Ö")
    }
    else if (e.key === "u" && altHolded){
        InsertAtCursor(inputText, "ü")
    }
    else if (e.key === "U" && altHolded){
        InsertAtCursor(inputText, "Ü")
    }
    else if (e.key === "s" && altHolded || e.key === "S" && altHolded){
        InsertAtCursor(inputText, "ß")
    }

}

function OnKeyUp(e){
    if (e.key === "Alt"){
        altHolded = false
    }

}

function LowDetailMode(){
    if (!lowDetail){
        lowDetail = true

        const cssLink = document.querySelector('link[href="styl.css"]')
        if (cssLink) {
            cssLink.remove()
        }
        document.body.background = ""
        streakImage.src = ""
        correctImage.src = ""
        incorrectImage.src = ""
        streakText.style.color = "orange"
        correctAnswersText.style.color = "green"
        incorrectAnswersText.style.color = "red"
        if (inputText.style.color === "white"){
            inputText.style.color = "black"
        }
        const inputTextDiv = document.querySelector(".input-word")
        for (let e of document.getElementsByClassName("text")){
            if (e.id === "correct-answers" || e.id === "incorrect-answers" || e.id === "streak" || e.id === "input-text"){
                continue
            }
    
            e.style.color = "black"
            e.style.borderColor = "black"
        }
        for (let r of document.getElementsByClassName("selection")){
            r.style.borderColor = "black"
        }
        inputTextDiv.style.borderColor = "black"
        voiceButtonImage.style.width = "32px"
        voiceButtonImage.style.height = "32px"
        voiceRepeatButtonImage.style.width = "32px"
        voiceRepeatButtonImage.style.height = "32px"
    }
    else{
        lowDetail = false

        const cssLink = document.createElement("link")
        cssLink.rel = "stylesheet"
        cssLink.href = "styl.css"
        document.head.append(cssLink)
        document.body.background = "Images/GalaxyBackground.jpg"
        streakImage.src = "Images/Streak.png"
        correctImage.src = "Images/Correct.png"
        incorrectImage.src = "Images/Incorrect.png"
        streakText.style.color = "white"
        correctAnswersText.style.color = "white"
        incorrectAnswersText.style.color = "white"
        if (inputText.style.color === "black"){
            inputText.style.color = "white"
        }
        const inputTextDiv = document.querySelector(".input-word")
        for (let e of document.getElementsByClassName("text")){
            if (e.id === "correct-answers" || e.id === "incorrect-answers" || e.id === "streak" || e.id === "input-text"){
                continue
            }
    
            e.style.color = "white"
            e.style.borderColor = "white"
        }
        for (let r of document.getElementsByClassName("selection")){
            r.style.borderColor = "white"
        }
        inputTextDiv.style.borderColor = "white"
    }
}

function OnWebsiteStart(){
    flipWordsButton.innerText = "<->"
    speachText.volume = 1
    voiceRepeatButton.style.visibility = "hidden"
    if (language === "de"){
        tutorialText.innerText = tutorialInfoText[0]
    }
    else{
        tutorialText.innerText = tutorialInfoText[1]
    }

    LoadFile(category.value + ".json")

    let notificationData = window.localStorage.getItem("notification_window")

    //if (notificationData === null){
        window.localStorage.setItem("notification_window", true)

        const notificationWindow = document.querySelector("#notification")
        notificationWindow.style.visibility = "visible"

        const notificationConfirm = document.querySelector("#notification-confirm")
        notificationConfirm.addEventListener("click", () => {
            window.location.href = "https://raketomet135.github.io/NemcinaSlovicka/default/default.html"
        })

        const notificationClose = document.querySelector("#notification-close")
        notificationClose.addEventListener("click", () => {
            notificationWindow.style.visibility = "hidden"
        })
    //}
}

OnWebsiteStart()

submitButton.addEventListener("click", SubmitUserInput)
warningText.addEventListener("click", LowDetailMode)
skipCorrectAnswerButton.addEventListener("click", SkipCorrectAnswer)
voiceButton.addEventListener("click", SwitchTTS)
wordListButton.addEventListener("click", ShowWordList)
window.addEventListener("beforeunload", CreateWordDataObject)
inputText.addEventListener("keydown", (e) =>{
    OnKeyDown(e)
})
inputText.addEventListener("keyup", (e) =>{
    OnKeyUp(e)
})
inputText.addEventListener("click", () =>{
    altHolded = false
})
inputText.addEventListener("onfocus", () =>{
    inputFocus = true
})
inputText.addEventListener("onblur", () =>{
    inputFocus = false
    altHolded = false
})
category.addEventListener("change", () =>{
    if (currentLoadedFileName !== category.value + ".json"){
        sessionStorage.clear()

        LoadFile(category.value + ".json")
    }
})
upperCaseButton.addEventListener("click", () =>{
   UpperCase(true)
})
aButton.addEventListener("click", () =>{
    let letter = "ä"
    if (upperCase) letter = "Ä"

    InsertAtCursor(inputText, letter)

    inputText.focus()
})
uButton.addEventListener("click", () =>{
    let letter = "ü"
    if (upperCase) letter = "Ü"

    InsertAtCursor(inputText, letter)

    inputText.focus()
})
oButton.addEventListener("click", () =>{
    let letter = "ö"
    if (upperCase) letter = "Ö"

    InsertAtCursor(inputText, letter)

    inputText.focus()
})
ssButton.addEventListener("click", () =>{
    let letter = "ß"

    InsertAtCursor(inputText, letter)

    inputText.focus()
})
flipWordsButton.addEventListener("click", () =>{
    if (!tts){
        if (language === "de") {
            language = "cz"
            tutorialText.innerText = tutorialInfoText[1]
        }
        else{
            language = "de"
            tutorialText.innerText = tutorialInfoText[0]
        }
    }
    else{
        if (language === "de"){
            language = "cz"
            tutorialText.innerText = tutorialInfoTextTTS[1]
        }   
        else{
            language = "de"
            tutorialText.innerText = tutorialInfoTextTTS[0]
        }
    }

    if (!isWordInspect){
        for (let i = 0; i < words.length; i++){
            const thisWord = words[i]
    
            if (thisWord.czWord === currentWord.czWord){
                words[i].timesDisplayed -= 1
            }
        }
    }

    isWordInspect = false
    inputText.style.color = "white"

    DisplayWord()
})
displayedWord.addEventListener("click", () =>{
    if (tts){
        SayWord(currentWord)
    }
})
voiceRepeatButton.addEventListener("click", () =>{
    if (tts){
        SayWord(currentWord)
    
        inputText.focus()
    }
})
for (let i = 0; i < hintButtons.length; i++){
    const hintButton = hintButtons[i]

    hintButton.addEventListener("click", Hint)
}
for (let i = 0; i < hoverElements.length; i++) {
    const thisHoverElement = hoverElements[i]

    for (let j = 0; j < thisHoverElement.element.length; j++) {
        const thisElement = thisHoverElement.element[j]

        thisElement.addEventListener("mouseover", (e) => {
            if (window.screen.width <= 1000) return

            const x = e.clientX
            const y = e.clientY

            let hoverText = CreateHoverText()

            UpdateHoverText(thisHoverElement, thisElement, hoverText)

            hoverText.style.left = x + "px"
            hoverText.style.top = (y + hoverTextYOffset) + "px"

            currentHoverText = hoverText
            document.body.append(hoverText)
        })
        thisElement.addEventListener("mousemove", (e) => {
            const x = e.clientX
            const y = e.clientY

            if (currentHoverText) {
                currentHoverText.style.left = x + "px"
                currentHoverText.style.top = (y + hoverTextYOffset) + "px"
            }
        })
        thisElement.addEventListener("mouseout", () => {
            if (currentHoverText) {
                currentHoverText.remove()
            }
        })
    }
}