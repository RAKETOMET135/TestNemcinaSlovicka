//variables
var submitButton = document.getElementById("Submit")
var hintButton = document.getElementById("Hint")
var streakBar = document.getElementById("Streak")
var caBar = document.getElementById("CorrectAnswers")
var iaBar = document.getElementById("IncorrectAnswers")
let czWords = []
let deWords = []
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

//startup
let http = new XMLHttpRequest();
http.open('get', 'words.json', true)
http.send()
http.onload = function(){
    if (this.readyState == 4 && this.status == 200){
        data = JSON.parse(this.responseText)
        for(var word of data.words){
            czWords.push(word.cz)
            deWords.push(word.de)
            wordFrequency.push(0)
        }
        OnStartup()
    }
}

document.body.addEventListener("keydown", (key) =>{
    OnKeyDown(key)
})

//functions
function OnStartup(){
    GenerateNewWord()
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

            for (var usedAmnt of wordFrequency){
                if (minUsedAmnt == usedAmnt){
                    wordId = t
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
        if (inputWord.value == correctAnswer){
            CorrectAnswer(inputWord, correctAnswer)
        }
        else{
            WrongAnswer(inputWord, correctAnswer)
        }
    }
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
    userInputBar.readOnly = true
    userInputBar.style.color = "rgb(0, 255, 0)"
    submitButton.innerText = "Další"
    checkMode = true
    if (hintState == 0){
        correctAnswers += 1
        streak += 1
    }
    UpdateBars()
}
function WrongAnswer(userInputBar, correctAnswer){
    userInputBar.readOnly = true
    userInputBar.value = correctAnswer
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
}

function AddSS(){
    if (checkMode) return
    var inputWord = document.getElementById("InputText")
    inputWord.value += "ß"
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
}

function AddFocus(){
    inputFocus = true
}
function RemoveFocus(){
    inputFocus = false
}
function OnKeyDown(key){
    if (key.key === "Enter" && inputFocus){
        SubmitAnswer()
    }
}