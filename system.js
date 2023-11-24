//variables
var submitButton = document.getElementById("Submit")
var hintButton = document.getElementById("Hint")
var streakBar = document.getElementById("Streak")
var caBar = document.getElementById("CorrectAnswers")
var iaBar = document.getElementById("IncorrectAnswers")
var flipWords = document.getElementById("FlipWords")
let czWords = []
let deWords = []
let altWords = []
let incorrectWords = []
let wordFrequency = []
var choseWordId = 0
var lastWordId = -1 //0 is first index of list
var streak = 0
var correctAnswers = 0
var incorrectAnswers = 0
var hintState = 0
var upperCase = false
var inputFocus = false
var checkMode = false
var defualtMode = true
var skipAnswer = false
var altHolded = false
var shiftHolded = false

//startup
flipWords.innerText = "<->"

LoadFile("lekce8_str102-106.json")

document.body.addEventListener("keydown", (key) =>{
    OnKeyDown(key)
})

document.body.addEventListener("keyup", (key) =>{
    OnKeyUp(key)
})

//functions
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
    submitButton.innerText = "Zkontrolovat"
    var inputWord = document.getElementById("InputText")
    inputWord.value = ""
    inputWord.style.color = "black"
    inputWord.readOnly = false

    return
}

function LoadFile(fileName){
    Reset()

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

async function AutoFocus(){
    if (!inputFocus){
        return
    }
    var input = document.getElementById("InputText")
    input.focus()
    inputFocus = true
    await Wait(0.5)
    inputFocus = true
    return
}

async function OnClickColor(element){
    element.style.backgroundColor = "#ffffff"
    element.style.color = "#000000"
    await Wait(0.2)
    element.style.backgroundColor = "#000000"
    element.style.color = "#ffffff"
}

async function Wait(seconds){
    return new Promise((resolve) => setTimeout(resolve, seconds*1000))
}

function SkipAnswer(){
    var btn = document.getElementById("SkipAnswer")
    if (!skipAnswer){
        btn.style.color = "#ffffff"
        btn.style.backgroundColor = "#000000"
    }
    else{
        btn.style.color = "#000000"
        btn.style.backgroundColor = "ffffff"
    }
    skipAnswer = !skipAnswer
    AutoFocus()
}

function FlipWords(){
    var tutorial = document.getElementById("Tutorial")
    if (defualtMode){
       // flipWords.innerText = "Čeština => Němčina"
     //  flipWords.innerText = "<->"
        tutorial.innerText = "Slovo, které je napsané v němčině, napiš do boxu pod ním česky. Cílem hry je naučit se německá slovíčka."
    }
    else{
      //  flipWords.innerText = "<->"
      //  flipWords.innerText = "Němčina => Čeština"
        tutorial.innerText = "Slovo, které je napsané v češtině, napiš do boxu pod ním německy. Cílem hry je naučit se německá slovíčka."
    }
    defualtMode = !defualtMode
    lastWordId = -1
    choseWordId = 0
    hintState = 0
    submitButton.innerText = "Zkontrolovat"
    var inputWord = document.getElementById("InputText")
    inputWord.value = ""
    inputWord.style.color = "black"
    inputWord.readOnly = false
    incorrectWords = []
    checkMode = false
    GenerateNewWord()
    AutoFocus()
    OnClickColor(document.getElementById("FlipWords"))
}

function OnStartup(){
    GenerateNewWord()
}

function Category(){
    var category = document.getElementById("category")
    var chosedJSONFileName = category.value + ".json"

    LoadFile(chosedJSONFileName)
}

function CheckUserScreenWidth(){
    var narrowDevice = false
    if (window.screen.width <= 1000){
        narrowDevice = true
    }
    return narrowDevice
}

function UpdateBars(){
    streakBar.innerText = "Série správných odpovědí bez nápověd: " + streak
    caBar.innerText = "Správné odpovědi bez nápověd: " + correctAnswers
    iaBar.innerText = "Nesprávné odpovědi: " + incorrectAnswers
    return
}

function GiveHint(){
    if (!checkMode){
        var deWord = deWords[choseWordId]
        if (!defualtMode){
            deWord = czWords[choseWordId]
        }
        var member = deWord.slice(0, 3)
        var len = 1
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
        hintState += 1
    }
    hintButton.style.backgroundColor = "rgb(0, 0, 0)"
    AutoFocus()
    OnClickColor(document.getElementById("Hint"))
}

function AddIncorrectWord(wordId){
    incorrectWords.push(wordId)
}

function RemoveIncorrectWord(wordId){
    const index = incorrectWords.indexOf(wordId)
    if (index > -1){
        incorrectWords.splice(index, 1)
    }
}

function GenerateNewWord(){
    hintState = 0
    var word = document.getElementById("GivenWord")
    word.innerText = GetRandomWord()
}

function GetRandomWord(){
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
        var notUsedWordChance = Math.floor(Math.random() * (2))
        if (notUsedWordChance > 0){
            Array.min = function(array){
                return Math.min.apply(Math, array);
            };
            var minUsedAmnt = Array.min(wordFrequency)
            //var maxUsedAmnt = Array.max(wordFrequency)
            var wordId = Math.floor(Math.random() * (czWords.length))
            var t = 0

            let liestUsedWords = []
            for (var usedAmnt of wordFrequency){
                if (minUsedAmnt == usedAmnt){
                    //wordId = t
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
  // console.log(wordFrequency)

   if (!defualtMode){
        choseWord = deWords[wordId]
   }

   return choseWord
}

function SubmitAnswer(){
    submitButton.style.backgroundColor = "rgb(0, 0, 0)"
    if (submitButton.innerText == "Další"){
        submitButton.innerText = "Zkontrolovat"
        var inputWord = document.getElementById("InputText")
        inputWord.value = ""
        inputWord.style.color = "black"
        inputWord.readOnly = false
        checkMode = false
        GenerateNewWord()
    }
    else{
        var correctAnswer = deWords[choseWordId]
        var inputWord = document.getElementById("InputText")
        //console.log(correctAnswer + " " + toString(inputWord.innerText))
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
            // a,_b   a_(b)
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
}

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
    }
    UpdateBars()
    if (!skipAnswer){
        userInputBar.readOnly = true
        userInputBar.style.color = "rgb(0, 255, 0)"
        submitButton.innerText = "Další"
        checkMode = true
    }
    else{
        var inputWord = document.getElementById("InputText")
        inputWord.value = ""
        inputWord.style.color = "black"
        GenerateNewWord()
    }
}
function WrongAnswer(userInputBar, correctAnswer){
    userInputBar.readOnly = true
    if (!CheckUserScreenWidth() && !userInputBar.value == ""){
        userInputBar.value = userInputBar.value + " => " + correctAnswer
    }
    else{
        userInputBar.value = correctAnswer
    }
    userInputBar.style.color = "rgb(255, 0, 0)"
    submitButton.innerText = "Další"
    checkMode = true
    streak = 0
    incorrectAnswers += 1
    UpdateBars()
    AddIncorrectWord(choseWordId)
}

function HoverEnter(){
    submitButton.style.backgroundColor = "rgb(25, 25, 25)"
}
function HoverExit(){
    submitButton.style.backgroundColor = "rgb(0, 0, 0)"
}

function HoverEnter2(){
    hintButton.style.backgroundColor = "rgb(25, 25, 25)"
}
function HoverExit2(){
    hintButton.style.backgroundColor = "rgb(0, 0, 0)"
}

function UpperCase(){
    var button = document.getElementById("UpperCase")
    var a = document.getElementById("A")
    var o = document.getElementById("O")
    var u = document.getElementById("U")
    var alt_a = document.getElementById("AltA")
    var alt_o = document.getElementById("AltO")
    var alt_u = document.getElementById("AltU")

    if (!upperCase){
        button.innerText = "Malá písmena"
        a.innerText = "Ä"
        o.innerText = "Ö"
        u.innerText = "Ü"
        alt_a.innerText = "Alt + 0196"
        alt_o.innerText = "Alt + 0214"
        alt_u.innerText = "Alt + 0220"
    }
    else{
        button.innerText = "Velká písmena"  
        a.innerText = "ä"
        o.innerText = "ö"
        u.innerText = "ü"
        alt_a.innerText = "Alt + 0228"
        alt_o.innerText = "Alt + 0246"
        alt_u.innerText = "Alt + 0252"
    }
    upperCase = !upperCase
    AutoFocus()
    OnClickColor(button)
}

function AddA(){
    if (checkMode) return
    var inputWord = document.getElementById("InputText")
    if (upperCase){
        inputWord.value += "Ä"
    }
    else{
        inputWord.value += "ä"
    }
    AutoFocus()
    OnClickColor(document.getElementById("A"))
}

function AddO(){
    if (checkMode) return
    var inputWord = document.getElementById("InputText")
    if (upperCase){
        inputWord.value += "Ö"
    }
    else{
        inputWord.value += "ö"
    }
    AutoFocus()
    OnClickColor(document.getElementById("O"))
}

function AddSS(){
    if (checkMode) return
    var inputWord = document.getElementById("InputText")
    inputWord.value += "ß"
    AutoFocus()
    OnClickColor(document.getElementById("SS"))
}

function AddU(){
    if (checkMode) return
    var inputWord = document.getElementById("InputText")
    if (upperCase){
        inputWord.value += "Ü"
    }
    else{
        inputWord.value += "ü"
    }
    AutoFocus()
    OnClickColor(document.getElementById("U"))
}

function AddFocus(){
    inputFocus = true
}
async function RemoveFocus(){
    await Wait(0.5)
    inputFocus = false
}
function OnKeyDown(key){
    if (key.key === "Enter" && inputFocus){
        SubmitAnswer()
    }
    if (key.key === "Alt"){
        altHolded = true
    }
    if (key.key === "Shift"){
        shiftHolded = true
    }
    //special character shortcuts
    var inputWord = document.getElementById("InputText")
    if (key.key === "a" && altHolded){
        if (checkMode) return
        inputWord.value += "ä"
        OnClickColor(document.getElementById("A"))
    }
    if (key.key === "o" && altHolded){
        if (checkMode) return
        inputWord.value += "ö"
        OnClickColor(document.getElementById("O"))
    }
    if (key.key === "u" && altHolded){
        if (checkMode) return
        inputWord.value += "ü"
        OnClickColor(document.getElementById("U"))
    }
    if (key.key === "s" && altHolded || altHolded && key.key === "S"){
        AddSS()
    }
    if (key.key === "A" && altHolded){
        if (checkMode) return
        inputWord.value += "Ä"
        OnClickColor(document.getElementById("A"))
    }
    if (key.key === "O" && altHolded){
        if (checkMode) return
        inputWord.value += "Ö"
        OnClickColor(document.getElementById("O"))
    }
    if (key.key === "U" && altHolded){
        if (checkMode) return
        inputWord.value += "Ü"
        OnClickColor(document.getElementById("U"))
    }
}
function OnKeyUp(key){
    if (key.key === "Alt"){
        altHolded = false
    }
    if (key.key === "Shift"){
        shiftHolded = false
    }
}
