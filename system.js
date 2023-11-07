//variables
let czWords = []
let deWords = []
var choseWordId = 0
var submitButton = document.getElementById("Submit")

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
        }
        OnStartup()
    }
}


//functions
function OnStartup(){
    GenerateNewWord()
}

function GenerateNewWord(){
    var word = document.getElementById("GivenWord")
    word.innerText = GetRandomWord()
}

function GetRandomWord(){
   var wordId = Math.floor(Math.random() * (czWords.length))
   var choseWord = czWords[wordId]
   choseWordId = wordId
   return choseWord
}

function SubmitAnswer(){
    if (submitButton.innerText == "Next"){
        submitButton.innerText = "Check"
        var inputWord = document.getElementById("InputText")
        inputWord.value = ""
        inputWord.style.color = "rgb(3, 175, 28)"
        GenerateNewWord()
    }
    else{
        var correctAnswer = deWords[choseWordId]
        var inputWord = document.getElementById("InputText")
        console.log(correctAnswer + " " + toString(inputWord.innerText))
        if (inputWord.value == correctAnswer){
        CorrectAnswer(inputWord)
        }
        else{
            WrongAnswer(inputWord, correctAnswer)
        }
    }
}

function CorrectAnswer(userInputBar){
    userInputBar.value = ""
    GenerateNewWord()
}
function WrongAnswer(userInputBar, correctAnswer){
    userInputBar.value = correctAnswer
    userInputBar.style.color = "rgb(255, 0, 0)"
    submitButton.innerText = "Next"
}

function HoverEnter(){
    submitButton.style.backgroundColor = "rgb(3, 175, 28)"
}

function HoverExit(){
    submitButton.style.backgroundColor = "rgb(3, 102, 28)"
}

function AddA(){
    var inputWord = document.getElementById("InputText")
    inputWord.value += "ä"
}

function AddO(){
    var inputWord = document.getElementById("InputText")
    inputWord.value += "ö"
}