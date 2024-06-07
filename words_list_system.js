const wordsList = document.querySelector("#word-list")
const returnButton = document.querySelector("#return-button")
const resetButton = document.querySelector("#reset-button")
const displayStats = document.querySelector("#display-stats")

let hoverInfoMain
let yOffset = -25

function RemoveListWords(){
    while (wordsList.firstChild){
        wordsList.firstChild.remove()
    }
}

function AddListWords(){
    const wordData = JSON.parse(sessionStorage.getItem("wordData"))

    for (let i = 0; i < wordData.wordsList.length; i++){
        const thisWord = wordData.wordsList[i]

        let wordElement = document.createElement("li")
        wordsList.append(wordElement)

        wordElement.classList.add("text")
        wordElement.classList.add("none-select")

        let zima3 = document.createElement("br")
        wordElement.append(zima3)

        let czSpan = document.createElement("span")
        wordElement.append(czSpan)
        czSpan.style.color = "purple"
        czSpan.style.fontWeight = "bold"
        czSpan.innerText = "CZ: "
        let czWordSpan = document.createElement("span")
        wordElement.append(czWordSpan)
        czWordSpan.style.color = "white"
        czWordSpan.innerText = thisWord.czWord

        let zima = document.createElement("br")
        wordElement.append(zima)

        let deSpan = document.createElement("span")
        wordElement.append(deSpan)
        deSpan.style.color = "purple"
        deSpan.style.fontWeight = "bold"
        deSpan.innerText = " DE: "
        let deWordSpan = document.createElement("span")
        wordElement.append(deWordSpan)
        deWordSpan.style.color = "white"
        deWordSpan.innerText = thisWord.deWord

        let zima2 = document.createElement("br")
        wordElement.append(zima2)

        let correctStart = document.createElement("span")
        wordElement.append(correctStart)
        correctStart.style.color = "green"
        correctStart.style.fontWeight = "bold"
        correctStart.innerText = " ("

        let correctImage = document.createElement("img")
        wordElement.append(correctImage)
        correctImage.src = "Images/Correct.png"
        correctImage.style.width = "16px"
        correctImage.style.height = "16px"
        correctImage.style.marginLeft = "5px"
        correctImage.style.position = "relative"
        correctImage.style.top = "2.5px"

        let correct = document.createElement("span")
        wordElement.append(correct)
        correct.style.color = "green"
        correct.style.fontWeight = "bold"
        correct.innerText = " " + thisWord.correct + " )"


        let incorrectStart = document.createElement("span")
        wordElement.append(incorrectStart)
        incorrectStart.style.color = "red"
        incorrectStart.style.fontWeight = "bold"
        incorrectStart.innerText = " ("

        let incorrectImage = document.createElement("img")
        wordElement.append(incorrectImage)
        incorrectImage.src = "Images/Incorrect.png"
        incorrectImage.style.width = "16px"
        incorrectImage.style.height = "16px"
        incorrectImage.style.marginLeft = "5px"
        incorrectImage.style.position = "relative"
        incorrectImage.style.top = "2.5px"

        let incorrect = document.createElement("span")
        wordElement.append(incorrect)
        incorrect.style.color = "red"
        incorrect.style.fontWeight = "bold"
        incorrect.innerText = " " + thisWord.incorrect + " )"


        let hintStart = document.createElement("span")
        wordElement.append(hintStart)
        hintStart.style.color = "blue"
        hintStart.style.fontWeight = "bold"
        hintStart.innerText = " ("

        let hintImage = document.createElement("img")
        wordElement.append(hintImage)
        hintImage.src = "Images/QuestionMarkIcon.png"
        hintImage.style.width = "16px"
        hintImage.style.height = "16px"
        hintImage.style.marginLeft = "5px"
        hintImage.style.position = "relative"
        hintImage.style.top = "2.5px"

        let hint = document.createElement("span")
        wordElement.append(hint)
        hint.style.color = "blue"
        hint.style.fontWeight = "bold"
        hint.innerText = " " + thisWord.timesHintUsed + " )"


        let eyeStart = document.createElement("span")
        wordElement.append(eyeStart)
        eyeStart.style.color = "yellow"
        eyeStart.style.fontWeight = "bold"
        eyeStart.innerText = " ("

        let eyeImage = document.createElement("img")
        wordElement.append(eyeImage)
        eyeImage.src = "Images/EyeIcon.png"
        eyeImage.style.width = "16px"
        eyeImage.style.height = "16px"
        eyeImage.style.marginLeft = "5px"
        eyeImage.style.position = "relative"
        eyeImage.style.top = "2.5px"

        let eye = document.createElement("span")
        wordElement.append(eye)
        eye.style.color = "yellow"
        eye.style.fontWeight = "bold"
        eye.innerText = " " + thisWord.timesDisplayed + " )"

        if (wordData.isLDM || document.body.background === ""){
            czWordSpan.style.color = "black"
            deWordSpan.style.color = "black"
        }

        if (thisWord.timesDisplayed < 1){
            for (let j = 0; j < wordElement.childNodes.length; j++){
                const textElement = wordElement.childNodes[j]

                textElement.style.opacity = "0.1"
            }
        }
    }
}

function DisplayUserStats(){
    let totalCorrectWords = 0
    let totalIncorrectWords = 0
    let totalHintUsedWords = 0
    let toatlDisplayedWords = 0

    const wordData = JSON.parse(sessionStorage.getItem("wordData"))
    const wordList = wordData.wordsList

    for (let i = 0; i < wordList.length; i++){
        const thisWord = wordList[i]

        totalCorrectWords += thisWord.correct
        totalIncorrectWords += thisWord.incorrect
        totalHintUsedWords += thisWord.timesHintUsed
        toatlDisplayedWords += thisWord.timesDisplayed
    }

    while (displayStats.firstChild) displayStats.firstChild.remove()

    let c = document.createElement("span")
    displayStats.append(c)
    c.innerText = "( "
    c.style.color = "green"
    c.style.fontWeight = "bold"

    let cImg = document.createElement("img")
    displayStats.append(cImg)
    cImg.src = "Images/Correct.png"
    cImg.style.width = "16px"
    cImg.style.height = "16px"
    cImg.style.position = "relative"
    cImg.style.top = "2.5px"

    let c2 = document.createElement("span")
    displayStats.append(c2)
    c2.innerText = " " + totalCorrectWords + " ) "
    c2.style.color = "green"
    c2.style.fontWeight = "bold"


    let i = document.createElement("span")
    displayStats.append(i)
    i.innerText = "( "
    i.style.color = "red"
    i.style.fontWeight = "bold"

    let iImg = document.createElement("img")
    displayStats.append(iImg)
    iImg.src = "Images/Incorrect.png"
    iImg.style.width = "16px"
    iImg.style.height = "16px"
    iImg.style.position = "relative"
    iImg.style.top = "2.5px"

    let i2 = document.createElement("span")
    displayStats.append(i2)
    i2.innerText = " " + totalIncorrectWords + " ) "
    i2.style.color = "red"
    i2.style.fontWeight = "bold"


    let h = document.createElement("span")
    displayStats.append(h)
    h.innerText = "( "
    h.style.color = "blue"
    h.style.fontWeight = "bold"

    let hImg = document.createElement("img")
    displayStats.append(hImg)
    hImg.src = "Images/QuestionMarkIcon.png"
    hImg.style.width = "16px"
    hImg.style.height = "16px"
    hImg.style.position = "relative"
    hImg.style.top = "2.5px"

    let h2 = document.createElement("span")
    displayStats.append(h2)
    h2.innerText = " " + totalHintUsedWords + " ) "
    h2.style.color = "blue"
    h2.style.fontWeight = "bold"


    let d = document.createElement("span")
    displayStats.append(d)
    d.innerText = "( "
    d.style.color = "yellow"
    d.style.fontWeight = "bold"

    let dImg = document.createElement("img")
    displayStats.append(dImg)
    dImg.src = "Images/EyeIcon.png"
    dImg.style.width = "16px"
    dImg.style.height = "16px"
    dImg.style.position = "relative"
    dImg.style.top = "2.5px"

    let d2 = document.createElement("span")
    displayStats.append(d2)
    d2.innerText = " " + toatlDisplayedWords + " ) "
    d2.style.color = "yellow"
    d2.style.fontWeight = "bold"

    let isMobileDevice = false
    if (window.screen.width < 1000) isMobileDevice = true

    for (let i = 0; i < displayStats.childNodes.length; i++){
        const childNode = displayStats.childNodes[i]

        if (isMobileDevice){
            childNode.style.fontSize = "10px"
            childNode.classList.add("text")
        }
        else{
            childNode.style.fontSize = "20px"
            childNode.classList.add("text")
        }
    }
}

function OnStart(){
    RemoveListWords()

    const wordData = JSON.parse(sessionStorage.getItem("wordData"))

    if (!wordData) window.location.href = "index.html"
    if (!wordData.wordsList) window.location.href = "index.html"
    if (wordData.wordsList.length < 1) window.location.href = "index.html"

    if (wordData.isLDM){
        const cssLink = document.querySelector('link[href="styl.css"]')
        if (cssLink) {
            cssLink.remove()
        }
        document.body.background = ""
        resetButton.style.width = "50px"
        resetButton.style.height = "50px"
        returnButton.style.width = "50px"
        returnButton.style.height = "50px"
        const rImg = document.querySelector(".reset-image")
        const rImg2 = document.querySelector(".return-image")
        rImg.style.width = "32px"
        rImg.style.height = "32px"
        rImg2.style.width = "32px"
        rImg2.style.height = "32px"
    }

    AddListWords()
    DisplayUserStats()
}

OnStart()

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

returnButton.addEventListener("click", () =>{
    window.location.href = "index.html"
})

resetButton.addEventListener("click", () =>{
    RemoveListWords()

    const wordData = JSON.parse(sessionStorage.getItem("wordData"))

    let wordList = wordData.wordsList

    for (let i = 0; i < wordList.length; i++){
        wordList[i].correct = 0
        wordList[i].incorrect = 0
        wordList[i].timesDisplayed = 0
        wordList[i].timesHintUsed = 0
        wordList[i].streak = 0
        wordList[i].maxStreak = 0
    }

    let wordDataObject = {
        wordsList: wordList,
        wordCategory: wordData.wordCategory,
        wordStreak: 0,
        wordHint: 0,
        wordDisplayed: null,
        isTTS: wordData.isTTS,
        isUpperCase: wordData.isUpperCase,
        language: wordData.language,
        skipCorrectWord: wordData.skipCorrectWord,
        isWordInspect: false,
        userText: "",
        userTextColor: "white",
        hint: "",
        wordCorrect: 0,
        wordIncorrect: 0,
        prevWord: wordData.prevWord,
        isLDM: wordData.isLDM
    }

    sessionStorage.setItem("wordData", JSON.stringify(wordDataObject))

    AddListWords()
    DisplayUserStats()
})


returnButton.addEventListener("mouseover", (e) => {
    if (window.screen.width <= 1000) return

    let x = e.clientX
    let y = e.clientY

    let hoverInfo = CreateHoverText()
    hoverInfo.innerText = "Zpátky"
    hoverInfo.style.width = "70px"
    hoverInfo.style.left = x + "px"
    hoverInfo.style.top = (y + yOffset) + "px"
    hoverInfoMain = hoverInfo

    document.body.appendChild(hoverInfo)
})
returnButton.addEventListener("mousemove", (e) => {
    let x = e.clientX
    let y = e.clientY

    if (hoverInfoMain) {
        hoverInfoMain.style.left = x + "px"
        hoverInfoMain.style.top = (y + yOffset) + "px"
    }
})
returnButton.addEventListener("mouseout", () => {
    if (hoverInfoMain) {
        hoverInfoMain.remove()
    }
})

resetButton.addEventListener("mouseover", (e) => {
    if (window.screen.width <= 1000) return

    let x = e.clientX
    let y = e.clientY

    let hoverInfo = CreateHoverText()
    hoverInfo.innerText = "Resetovat data"
    hoverInfo.style.width = "120px"
    hoverInfo.style.left = x + "px"
    hoverInfo.style.top = (y + yOffset) + "px"
    hoverInfoMain = hoverInfo

    document.body.appendChild(hoverInfo)
})
resetButton.addEventListener("mousemove", (e) => {
    let x = e.clientX
    let y = e.clientY

    if (hoverInfoMain) {
        hoverInfoMain.style.left = x + "px"
        hoverInfoMain.style.top = (y + yOffset) + "px"
    }
})
resetButton.addEventListener("mouseout", () => {
    if (hoverInfoMain) {
        hoverInfoMain.remove()
    }
})