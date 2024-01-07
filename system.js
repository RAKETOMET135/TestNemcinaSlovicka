//variables
//elements
var submitButton = document.getElementById("Submit")
var hintButton = document.getElementById("Hint")
var streakBar = document.getElementById("Streak")
var caBar = document.getElementById("CorrectAnswers")
var iaBar = document.getElementById("IncorrectAnswers")
var flipWords = document.getElementById("FlipWords")
var streakImage = document.getElementById("StreakImage")
//arrays
let czWords = []
let deWords = []
let altWords = []
let incorrectWords = []
let wordFrequency = []
//numbers
var choseWordId = 0
var lastWordId = -1 //0 is first index of array (if word 0 rolled then it can still be chosed)
var streak = 0
var correctAnswers = 0
var incorrectAnswers = 0
var hintState = 0
var totalWords = 0
//bools
var upperCase = false
var inputFocus = false
var checkMode = false
var defualtMode = true
var skipAnswer = false
var altHolded = false
var shiftHolded = false
var submitHovered = false


//startup
//change text that you can't in html
flipWords.innerText = "<->"

//Loads latest json file with words
LoadFile("lekce9.json")

//adds event listeners to body (used for abbreviations)
document.body.addEventListener("keydown", (key) =>{
    OnKeyDown(key)
})
document.body.addEventListener("keyup", (key) =>{
    OnKeyUp(key)
})


//functions
//special function that designs the website to christmas theme (can be called on startup)
function ChristmasDesign(){
    //background
    var backgroundImages = 4
    var bg_rn = Math.floor(Math.random() * (backgroundImages))
    bg_rn += 1
    
    var backgroundName = "Background_" + bg_rn + ".jpg"

    document.body.background = "Images/ChristmasImages/" + backgroundName

    //buttons
    var buttons = []
    for (var button of document.getElementsByClassName("EBtn")){
        buttons.push(button)
    }
    for (var button of document.getElementsByClassName("ALT")){
        buttons.push(button)
    }
    buttons.push(document.getElementById("HintMobile"))

    for (var button of buttons){
        button.style.backgroundImage = "url(Images/ChristmasImages/ButtonBackground.jpg)"
        button.onmouseenter = function(){
             this.style.backgroundImage = "url(Images/ChristmasImages/ButtonHoverBackground.jpg)"
        }
        button.onmouseleave = function(){
            this.style.backgroundImage = "url(Images/ChristmasImages/ButtonBackground.jpg)"
        }
    }

    submitButton.style.backgroundImage = "url(Images/ChristmasImages/ButtonHoverBackground.jpg)"

    //other
    var givenWords = document.getElementsByClassName("GivenWord")
    for (var givenWord of givenWords){
        givenWord.style.backgroundImage = "url(Images/ChristmasImages/GivenWordBackground.jpg)"
    }
    var cetegory = document.getElementById("Category")
    category.style.backgroundImage = "url(Images/ChristmasImages/ButtonBackground.jpg)"
    var inputText = document.getElementById("InputText")
    inputText.style.backgroundImage = "url(Images/ChristmasImages/InputWordBackground.jpg)"

    //decorations
    //checks if user is not using phone or device with small screen width
    if (!CheckUserScreenWidth()){
        //creates christmas tree gif
        var christmasTree = document.createElement("img")
        christmasTree.src = "Images/ChristmasImages/ChristmasTree.gif"
        document.body.appendChild(christmasTree)
        christmasTree.style.width = "200px"
        christmasTree.style.height = "200px"
        christmasTree.style.position = "Absolute"
        christmasTree.style.right = "5%"
        christmasTree.style.top = "35%"

        //creates candy cane gif
        var candyCane = document.createElement("img")
        candyCane.src = "Images/ChristmasImages/CandyCane.gif"
        document.body.appendChild(candyCane)
        candyCane.style.width = "200px"
        candyCane.style.height = "200px"
        candyCane.style.position = "Absolute"
        candyCane.style.left = "5%"
        candyCane.style.top = "35%"
    }
}

//button hover info
//checks if user is not using phone or device with small screen width
if (!CheckUserScreenWidth()){
    //main variables for hover events
    var hoverInfoMain = null
    var yOffset = -25

    //function that creates html element with design and returns it
    function CreateHintElement() {
        var e = document.createElement('div');
        e.style.position = "absolute"
        e.style.color = "#ffffff"
        e.style.fontFamily = "Roboto"
        e.style.fontSize = "15px"
        e.style.height = "20px"
        e.style.background = "rgb(2, 0, 36)"
        e.style.background = "linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(30,30,30,1) 18%, rgba(50,50,50,1) 45%, rgba(30,30,30,1) 79%, rgba(0,0,0,1) 100%)"
        e.style.backgroundSize = "200% 200%"
        e.style.animation = "gradient-animation"
        e.style.animationDuration = "10s"
        e.style.animationFillMode = "ease"
        e.style.animationIterationCount = "infinite"
        e.style.textAlign = "center"
        e.style.transform = "translate(-45%)"
        e.style.border = "white solid 1px"
        e.style.borderRadius = "10px"

        return e
    }

    //submit element hover event
    document.getElementById('Submit').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()

        if (submitButton.innerText == "➔"){
            hoverInfo.innerText = "Další"
            hoverInfo.style.width = "60px"
        }
        else{
            hoverInfo.innerText = "Zkontrolovat"
            hoverInfo.style.width = "110px"
        }

        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo
        submitHovered = true

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('Submit').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('Submit').addEventListener('mouseout', function () {
        submitHovered = false

        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //hintMobile element hover event
    document.getElementById('HintMobile').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Nápověda"
        hoverInfo.style.width = "90px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('HintMobile').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('HintMobile').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //skipAnswer element hover event
    document.getElementById('SkipAnswer').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Přeskočit správnou odpověď"
        hoverInfo.style.width = "220px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('SkipAnswer').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('SkipAnswer').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //flipWords element hover event
    document.getElementById('FlipWords').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Prohodit slova"
        hoverInfo.style.width = "120px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('FlipWords').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('FlipWords').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //upperCase element hover event
    document.getElementById('UpperCase').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()

        if (!upperCase){
            hoverInfo.innerText = "Velká písmena"
            hoverInfo.style.width = "120px"    
        }
        else{
            hoverInfo.innerText = "Malá písmena"
            hoverInfo.style.width = "115px"    
        }
    
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('UpperCase').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('UpperCase').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //A element hover event
    document.getElementById('A').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Přidat A s přehláskou"
        hoverInfo.style.width = "165px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('A').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('A').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //O element hover event
    document.getElementById('O').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Přidat O s přehláskou"
        hoverInfo.style.width = "165px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('O').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('O').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //U element hover event
    document.getElementById('U').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Přidat U s přehláskou"
        hoverInfo.style.width = "165px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('U').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('U').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

    //S element hover event
    document.getElementById('SS').addEventListener('mouseover', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        var hoverInfo = CreateHintElement()
        hoverInfo.innerText = "Přidat ostré S"
        hoverInfo.style.width = "115px"
        hoverInfo.style.left = `${x}px`;
        hoverInfo.style.top = `${y + yOffset}px`;
        hoverInfoMain = hoverInfo

        document.body.appendChild(hoverInfo);
    });
    document.getElementById('SS').addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (hoverInfoMain) {
            hoverInfoMain.style.left = `${x}px`;
            hoverInfoMain.style.top = `${y + yOffset}px`;
        }
    })
    document.getElementById('SS').addEventListener('mouseout', function () {
        if (hoverInfoMain) {
            hoverInfoMain.remove();
        }
    });
    //

}

//function that brings the website to defualt state
function Reset(){
    streak = 0; correctAnswers = 0; incorrectAnswers = 0; UpdateBars()
    checkMode = false
    czWords = []
    deWords = []
    incorrectWords = []
    wordFrequency = []
    altWords = []
    lastWordId = -1
    choseWordId = 0
    hintState = 0
    submitButton.innerText = "✓"
    var inputWord = document.getElementById("InputText")
    inputWord.value = ""
    inputWord.style.color = "white"
    inputWord.readOnly = false
    streakImage.style.transform = "scale(1, 1)"

    return
}

//function that updates hover info text of submit button
function UpdateSubmitHoverInfo(){
    if (submitHovered && hoverInfoMain){
        if (submitButton.innerText == "➔"){
            hoverInfoMain.innerText = "Další"
            hoverInfoMain.style.width = "60px"
        }
        else{
            hoverInfoMain.innerText = "Zkontrolovat"
            hoverInfoMain.style.width = "110px"
        }
    }
}

//function that loads file based on string fileName from folder Lekce
function LoadFile(fileName){
    Reset()
    fileName = "Lekce/" + fileName

    let http = new XMLHttpRequest();
    http.open('get', fileName, true)
    http.send()
    http.onload = function(){
        if (this.readyState == 4 && this.status == 200){
            data = JSON.parse(this.responseText)
            for(var word of data.words){
                czWords.push(word.cz)
                deWords.push(word.de)
                if (word.alt){
                    altWords.push(word.alt)
                }
                else{
                    altWords.push("")
                }
                wordFrequency.push(0)
            }
            OnStartup()
        }
    }
    return
}

//function that is not used
async function AutoFocus(){
    return

    if (!inputFocus){
        return
    }
    var input = document.getElementById("InputText")
    input.focus()
    await Wait(0.5)
    inputFocus = true
    return
}

//function that changes UI when answer submitted based on given ansColor
async function DynamicAnswer(ansColor){
    //changes element colors and borderColors
    for (var e of document.getElementsByClassName("Text")){
        if (e.id == "CorrectAnswers" || e.id == "IncorrectAnswers" || e.id == "Streak" || e.id == "InputText"){
            continue
        }

        e.style.color = ansColor
        e.style.borderColor = ansColor
    }
    document.getElementById("InputText").style.borderColor = ansColor
    for (var r of document.getElementsByClassName("Selection")){
        r.style.borderColor = ansColor
    }

    //runs animation for correct/incorrect answer
    var CABorder = document.getElementById("CABorder")
    var IABorder = document.getElementById("IABorder")
    if (ansColor == "rgb(0, 255, 100)"){
        CABorder.style.animation = "pulse"
        CABorder.style.animationDuration = "0.15s"
        CABorder.style.background = "rgb(2, 0, 36)"
        CABorder.style.background = "linear-gradient(45deg, rgb(39, 177, 5) 0%, rgb(35, 141, 8) 18%, rgb(39, 177, 5) 45%, rgb(31, 126, 7) 79%, rgb(39, 177, 5) 100%)"
    }
    else if (ansColor == "rgb(255, 0, 0)"){
        IABorder.style.animation = "pulse2"
        IABorder.style.animationDuration = "0.15s"
        IABorder.style.background = "rgb(2, 0, 36)"
        IABorder.style.background = "linear-gradient(45deg, rgb(190, 25, 0) 0%, rgb(185, 5, 5) 18%, rgb(185, 20, 5) 45%, rgb(185, 20, 5) 79%, rgb(185, 20, 5) 100%"
    }

    //time until the change gets removed
    await Wait(0.15)

    //removes the animation so it can be played later again
    CABorder.style.animation = "none"
    CABorder.style.background = "transparent"
    IABorder.style.animation = "none"
    IABorder.style.background = "transparent"
    
    //changes element colors and borderColors to defualt
    for (var e of document.getElementsByClassName("Text")){
        if (e.id == "CorrectAnswers" || e.id == "IncorrectAnswers" || e.id == "Streak" || e.id == "InputText"){
            continue
        }

        e.style.color = "#ffffff"
        e.style.borderColor = "#ffffff"
    }
    for (var r of document.getElementsByClassName("Selection")){
        r.style.borderColor = "white"
    }
    if (inputFocus){
        document.getElementById("InputText").style.borderColor = "yellow"
    }
    else{
        document.getElementById("InputText").style.borderColor = "white"
    }
}

//function that changes element color to white and then to black
async function OnClickColor(element){
    element.style.backgroundColor = "#ffffff"
    element.style.color = "transparent"

    await Wait(0.2)

    element.style.backgroundColor = "#000000"
    element.style.color = "#ffffff"
}

//function that changes given element color based on color given for specific time
async function ColorChange(element, color){
    var oldColor = element.style.color
    element.style.color = color
    element.style.transform = "scale(1.5)"

    await Wait(0.2)

    element.style.transform = "scale(1)"
    element.style.color = oldColor
}

//helper function to make wait
async function Wait(seconds){
    return new Promise((resolve) => setTimeout(resolve, seconds*1000))
}

//function that changes skipAnswer state
function SkipAnswer(){
    var btn = document.getElementById("SkipAnswer")
    if (!skipAnswer){
        btn.innerText = "||"
    }
    else{
        btn.innerText = "≪"
    }
    skipAnswer = !skipAnswer
    AutoFocus()
}

//function that flip words (german to czech/czech to german)
function FlipWords(){
    var tutorial = document.getElementById("Tutorial")
    if (defualtMode){
        tutorial.innerText = "Slovo, které je napsané v němčině, napiš do boxu pod ním česky. Cílem hry je naučit se německá slovíčka."
    }
    else{
        tutorial.innerText = "Slovo, které je napsané v češtině, napiš do boxu pod ním německy. Cílem hry je naučit se německá slovíčka."
    }
    defualtMode = !defualtMode
    lastWordId = -1
    choseWordId = 0
    hintState = 0
    submitButton.innerText = "✓"
    var inputWord = document.getElementById("InputText")
    inputWord.value = ""
    inputWord.style.color = "white"
    inputWord.readOnly = false
    incorrectWords = []
    checkMode = false
    GenerateNewWord()
    AutoFocus()
    OnClickColor(document.getElementById("FlipWords"))
}

//function that is called on startup and generates the first word
function OnStartup(){
    GenerateNewWord()
}

//function that changes the current word file
function Category(){
    var category = document.getElementById("category")
    var chosedJSONFileName = category.value + ".json"

    LoadFile(chosedJSONFileName)
}

//function that returns true if user screen width is lower then 1000 or false
function CheckUserScreenWidth(){
    var narrowDevice = false
    if (window.screen.width <= 1000){
        narrowDevice = true
    }
    return narrowDevice
}

//function that updates correctAnswers, incorrectAnswers ans streak texts
function UpdateBars(){
    streakBar.innerText = streak
    caBar.innerText = correctAnswers
    iaBar.innerText = incorrectAnswers
    return
}

//function that gives first or next letter of the current word
function GiveHint(){
    if (!checkMode){
        var deWord = deWords[choseWordId]
        if (!defualtMode){
            deWord = czWords[choseWordId]
        }

        var len = 1

        //checks if the word starts with der or die or das
        var member = deWord.slice(0, 3)
        if (member == "der" || member == "die" || member == "das"){
            len += 4
        }

        len += hintState
        if (len > deWord.length){
            len = deWord.length
        }
        var finishedHint = deWord.slice(0, len)
        var inputWord = document.getElementById("InputText")
        inputWord.value = finishedHint
        inputWord.style.color = "rgb(17, 136, 250)"
        hintState += 1
    }
    hintButton.style.backgroundColor = "rgb(0, 0, 0)"
    AutoFocus()
    OnClickColor(document.getElementById("HintMobile"))
}

//function that adds word to incorrect words array
function AddIncorrectWord(wordId){
    incorrectWords.push(wordId)
}

//function that removes word from incorrect words array
function RemoveIncorrectWord(wordId){
    const index = incorrectWords.indexOf(wordId)
    if (index > -1){
        incorrectWords.splice(index, 1)
    }
}

//function that generates a new word
function GenerateNewWord(){
    totalWords += 1
    hintState = 0
    var word = document.getElementById("GivenWord")
    word.innerText = GetRandomWord()
}

//function that gets random words
function GetRandomWord(){
   //chance to give incorrect word
   var i_wordChance = Math.floor(Math.random() * (10))
   if (i_wordChance > 0 && incorrectWords.length > 0){
        var wordId = Math.floor(Math.random() * (incorrectWords.length))
        var fixedId; var t = 0
        for (var word of czWords){
            if (t == incorrectWords[wordId]){
                fixedId = t
            }
            t += 1
        }
        wordId = fixedId

        //checks if the word wasn't the last one
        if (lastWordId == wordId){
            while (lastWordId == wordId){
                wordId = Math.floor(Math.random() * (czWords.length))
            }
        }

        var choseWord = czWords[wordId]
        lastWordId = wordId
        choseWordId = wordId
   }
   else{
        //chance to pick word thet was the liest times
        var notUsedWordChance = Math.floor(Math.random() * (2))
        if (notUsedWordChance > 0){
            Array.min = function(array){
                return Math.min.apply(Math, array);
            };
            var minUsedAmnt = Array.min(wordFrequency)
            var wordId = Math.floor(Math.random() * (czWords.length))
            var t = 0

            let liestUsedWords = []
            for (var usedAmnt of wordFrequency){
                if (minUsedAmnt == usedAmnt){
                    liestUsedWords.push(t)
                }
                t += 1
            }
            var rn = Math.floor(Math.random() * (liestUsedWords.length))
            t = 0
            for (var unusedWord of liestUsedWords){
                if (rn == t){
                    wordId = unusedWord
                }
                t += 1
            }

            var choseWord = czWords[wordId]
            lastWordId = wordId
            choseWordId = wordId
        }
        else{
            var wordId = Math.floor(Math.random() * (czWords.length))
            if (lastWordId == wordId){
                while (lastWordId == wordId){
                    wordId = Math.floor(Math.random() * (czWords.length))
                }
            }
            var choseWord = czWords[wordId]
            lastWordId = wordId
            choseWordId = wordId
        }
   }
   wordFrequency[choseWordId] += 1

   if (!defualtMode){
        choseWord = deWords[wordId]
   }

   return choseWord
}

//function that checks if the answer is correct or incorrect
function SubmitAnswer(){
    //checks if the answer was already submitted => gives new word
    if (submitButton.innerText == "➔"){
        submitButton.innerText = "✓"
        var inputWord = document.getElementById("InputText")
        inputWord.value = ""
        inputWord.style.color = "white"
        inputWord.readOnly = false
        checkMode = false
        if (hoverInfoMain){
            hoverInfoMain.innerText = "Zkontrolovat"
            hoverInfoMain.style.width = "110px"
        }
        GenerateNewWord()
    }
    else{
        var correctAnswer = deWords[choseWordId]
        var inputWord = document.getElementById("InputText")
        if (hoverInfoMain){
            hoverInfoMain.innerText = "Další"
            hoverInfoMain.style.width = "60px"
        }

        //checks if user is using flipped words
        if (defualtMode){
            if (altWords[choseWordId] != ""){
                if (inputWord.value == correctAnswer || inputWord.value == altWords[choseWordId]){
                    CorrectAnswer(inputWord, correctAnswer)
                }
                else{
                    WrongAnswer(inputWord, correctAnswer)
                }
            }
            else{
                if (inputWord.value == correctAnswer){
                    CorrectAnswer(inputWord, correctAnswer)
                }
                else{
                    WrongAnswer(inputWord, correctAnswer)
                }
            }
        }
        else{
            // a,_b   a_(b) <= word entering format help
            correctAnswer = czWords[choseWordId]
            let correctWords = []
            var cCA = "" //current correct answer
            for (var i = 0; i < correctAnswer.length; i++){
                var cLetter = correctAnswer.slice(i, i+1)
                
                if (cLetter == "," || cLetter == "(" || cLetter == ")"){
                    if (cLetter == "("){
                        cCA = cCA.slice(0, cCA.length-1)
                    }
                    correctWords.push(cCA)
                    cCA = ""
                }
                else{
                    if (cLetter == " " && correctAnswer.slice(i-1, i) == ","){
                        continue
                    }
                    else{
                        cCA += correctAnswer.slice(i, i+1)
                    }
                }
            }
            if (cCA != ""){
                correctWords.push(cCA)
            }
            var c = false
            var cWord = ""
            for (var cW of correctWords){
                if (inputWord.value == cW){
                    c = true
                    cWord = cW
                }
            }
            if (!c){
                if (inputWord.value == correctAnswer){
                    c = true
                }
                //
                cCA = ""
                let wordsAnswered = []
                for (var i = 0; i < inputWord.value.length; i++){
                    var cLetter = inputWord.value.slice(i, i+1)
                    
                    if (cLetter == "," || cLetter == "(" || cLetter == ")"){
                        if (cLetter == "("){
                            cCA = cCA.slice(0, cCA.length-1)
                        }
                        wordsAnswered.push(cCA)
                        cCA = ""
                    }
                    else{
                        if (cLetter == " " && inputWord.value.slice(i-1, i) == ","){
                            continue
                        }
                        else{
                            cCA += inputWord.value.slice(i, i+1)
                        }
                    }
                }
                if (cCA != ""){
                    wordsAnswered.push(cCA)
                }
                //
                var allCorrect = true
                for (var wordAnswered of wordsAnswered){
                    var h = false
                    for (var correctWord of correctWords){
                        if (correctWord == wordAnswered){
                            h = true
                        }
                    }
                    if (!h){
                        allCorrect = false
                    }
                }

                if (allCorrect && wordsAnswered.length > 0){
                   c = true
                }
            }
            if (c){
                CorrectAnswer(inputWord, cWord)
            }
            else{
                var cAnswer = ""; var start = true
                for (var cW of correctWords){
                    if (start){
                        start = false
                        cAnswer = cW
                    }
                    else{
                        cAnswer += ", " + cW 
                    }
                }

                WrongAnswer(inputWord, cAnswer)
            }
        }
    }
    AutoFocus()
    OnClickColor(document.getElementById("Submit"))
    UpdateSubmitHoverInfo()
}

//functions that plays if the answer is correct
function CorrectAnswer(userInputBar, correctAnswer){
    var idFound = false
    for (var wordId of incorrectWords){
        if (wordId == choseWordId){
            idFound = true
        }
    }
    if (idFound){
        RemoveIncorrectWord(choseWordId)
    }
    if (hintState == 0){
        correctAnswers += 1
        streak += 1
        var streakScale = 1 * (streak/30) +1
        streakImage.style.transform = "scale(" + streakScale + ", " + streakScale + ")"
        ColorChange(document.getElementById("CorrectAnswers"), "12ff12")
        ColorChange(document.getElementById("Streak"), "orange")
        DynamicAnswer("rgb(0, 255, 100)")
    }
    else if (hintState > 0){
        DynamicAnswer("rgb(0, 200, 255)")
    }
    UpdateBars()
    if (!skipAnswer){
        userInputBar.readOnly = true
        userInputBar.style.color = "rgb(0, 255, 0)"
        submitButton.innerText = "➔"
        checkMode = true
    }
    else{
        var inputWord = document.getElementById("InputText")
        inputWord.value = ""
        inputWord.style.color = "white"
        GenerateNewWord()
    }
}

//function that plays if the answer is incorrect
function WrongAnswer(userInputBar, correctAnswer){
    userInputBar.readOnly = true
    if (!CheckUserScreenWidth() && !userInputBar.value == ""){
        userInputBar.value = userInputBar.value + " => " + correctAnswer
    }
    else{
        userInputBar.value = correctAnswer
    }
    userInputBar.style.color = "rgb(255, 0, 0)"
    submitButton.innerText = "➔"
    checkMode = true
    var c = false
    if (streak > 0){
        c = true
    }
    streak = 0
    incorrectAnswers += 1
    var streakScale = 1 * (streak/30) +1
    streakImage.style.transform = "scale(" + streakScale + ", " + streakScale + ")"
    ColorChange(document.getElementById("IncorrectAnswers"), "ff1212")
    if (c){
        ColorChange(document.getElementById("Streak"), "ff1212")
    }
    UpdateBars()
    AddIncorrectWord(choseWordId)
    DynamicAnswer("rgb(255, 0, 0)")
}

//functions used by hintMobile element
function HoverEnter2(){
    hintButton.style.backgroundColor = "rgb(25, 25, 25)"
}
function HoverExit2(){
    hintButton.style.backgroundColor = "rgb(0, 0, 0)"
}

//function that changes letters to uppercase/lowercase
function UpperCase(){
    var button = document.getElementById("UpperCase")
    var a = document.getElementById("A")
    var o = document.getElementById("O")
    var u = document.getElementById("U")
    var alt_a = document.getElementById("AltA")
    var alt_o = document.getElementById("AltO")
    var alt_u = document.getElementById("AltU")

    if (!upperCase){
        button.innerText = "⇪"
        a.innerText = "Ä"
        o.innerText = "Ö"
        u.innerText = "Ü"
        alt_a.innerText = "Alt + 0196"
        alt_o.innerText = "Alt + 0214"
        alt_u.innerText = "Alt + 0220"

        if (hoverInfoMain){
            hoverInfoMain.innerText = "Malá písmena"
            hoverInfoMain.style.width = "115px" 
        }
    }
    else{
        button.innerText = "⇪"  
        a.innerText = "ä"
        o.innerText = "ö"
        u.innerText = "ü"
        alt_a.innerText = "Alt + 0228"
        alt_o.innerText = "Alt + 0246"
        alt_u.innerText = "Alt + 0252"

        if (hoverInfoMain){
            hoverInfoMain.innerText = "Velká písmena"
            hoverInfoMain.style.width = "120px"
        }
    }
    upperCase = !upperCase
    AutoFocus()
    OnClickColor(button)
}

//function that inserts letter to input field at cursor position and moves the cursor to that position
function insertAtCursor(myField, myValue) {
    if (document.selection) {
        myField.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        sel.moveStart('character', -myValue.length);
        sel.select();
    }
  
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}

//function that is used to call insertAtCursor function
function AddLeter(letter){
    var inputWord = document.getElementById("InputText")
    insertAtCursor(inputWord, letter)
}

//function that adds A umlaut
function AddA(){
    if (checkMode) return
    if (upperCase){
        AddLeter("Ä")
    }
    else{
        AddLeter("ä")
    }
    AutoFocus()
    Focus()
    OnClickColor(document.getElementById("A"))
}

//function that adds O umlaut
function AddO(){
    if (checkMode) return
    if (upperCase){
        AddLeter("Ö")
    }
    else{
        AddLeter("ö")
    }
    AutoFocus()
    Focus()
    OnClickColor(document.getElementById("O"))
}

//function that adds sharp S
function AddSS(){
    if (checkMode) return
    AddLeter("ß")
    AutoFocus()
    Focus()
    OnClickColor(document.getElementById("SS"))
}

//function that adds U umlaut
function AddU(){
    if (checkMode) return
    if (upperCase){
        AddLeter("Ü")
    }
    else{
        AddLeter("ü")
    }
    AutoFocus()
    Focus()
    OnClickColor(document.getElementById("U"))
}

//function that focuses user to the inputText element
function Focus(){
    var inputWord = document.getElementById("InputText")

    inputWord.focus()
}

//functions that changes inputFocus variable
function AddFocus(){
    inputFocus = true
}
async function RemoveFocus(){
    inputFocus = false
}

//function that plays when user presses key
function OnKeyDown(key){
    //skip answer key
    if (key.key === "Enter" && inputFocus){
        SubmitAnswer()
    }

    //support keys
    if (key.key === "Alt"){
        altHolded = true
    }
    //shift not used
    if (key.key === "Shift"){
        shiftHolded = true
    }

    //special character shortcuts
    if (key.key === "a" && altHolded){
        if (checkMode) return
        AddLeter("ä")
    }
    if (key.key === "o" && altHolded){
        if (checkMode) return
        AddLeter("ö")
    }
    if (key.key === "u" && altHolded){
        if (checkMode) return
        AddLeter("ü")
    }
    if (key.key === "s" && altHolded || altHolded && key.key === "S"){
        if (checkMode) return
        AddLeter("ß")
    }
    if (key.key === "A" && altHolded){
        if (checkMode) return
        AddLeter("Ä")
    }
    if (key.key === "O" && altHolded){
        if (checkMode) return
       AddLeter("Ö")
    }
    if (key.key === "U" && altHolded){
        if (checkMode) return
        AddLeter("Ü")
    }
}

//function that plays when user stops pressing key
function OnKeyUp(key){
    if (key.key === "Alt"){
        altHolded = false
    }
    if (key.key === "Shift"){
        shiftHolded = false
    }
}
