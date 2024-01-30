var word = document.getElementById("word")
var rain = document.getElementById("rain")
var player = document.getElementById("player")
var playerText = document.getElementById("player-text")

var correctText = document.getElementById("correct")
var incorrectText = document.getElementById("incorrect")
var streakText = document.getElementById("streak")

let czWords = []
let deWords = []
let altWords = []

let droppingWords = []

var playerWord_index = 0

var r = 0
var ins = 0

var streak = 0;
var correct = 0;
var incorrect = 0;

var started = false;

//start
LoadFile("lekce9vyber.json")

//

//overlap handling
function isOverlapping(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

//player
var speed = 15
var keys = {}

function updatePlayerScore(){
    correctText.innerHTML = "Correct: " + correct
    incorrectText.innerHTML = "Incorrect: " + incorrect
    streakText.innerHTML = "Streak: " + streak
}

function moveElement() {
    var rect = player.getBoundingClientRect()

    if (keys['a'] && rect.left - speed >= 50) {
        player.style.left = (rect.left - speed) + 'px'
    }
    if (keys['d'] && rect.right + speed <= window.innerWidth-50) {
        player.style.left = (rect.left + speed) + 'px'
    }
}
setInterval(moveElement, 10)
window.onkeydown = function (e) {
    keys[e.key] = true
    if (e.keyCode == 32 && started == false){
        started = true
        OnStartup()
    }
}
window.onkeyup = function (e) {
    keys[e.key] = false
}
function changePlayerWord(){
    var n = Math.floor(Math.random() * (czWords.length))
    var czWord = czWords[n]
    playerText.innerHTML = czWord
    playerWord_index = deWords[n]
    ins = Math.floor(Math.random() * (10))
}
function collectWord(){
    for (var i = 0; i < droppingWords.length; i++){
        var w = droppingWords[i]

        if (isOverlapping(w, player)){
            if (w.innerText == playerWord_index){
                correct += 1
                streak += 1
                changePlayerWord()
            }
            else{
                incorrect += 1
                streak = 0
            }
            //console.log("C:" + correct + ", I:" + incorrect + ", S:" +streak);
            const index2 = droppingWords.indexOf(w)
            if (index2 > -1){
                droppingWords.splice(index2, 1)
            }
            w.remove()
            updatePlayerScore()
        }
    }
}

//word rain
function GenerateDroppedWord(){
    var w = document.createElement("p")
    w.className = "dropped-word"
    w.style.top = "-10%"
    w.style.left = 400 + Math.floor(Math.random() * (window.innerWidth-800)) + 'px'
    w.style.minWidth = 200 + 'px'
    rain.appendChild(w)

    var n = Math.floor(Math.random() * (deWords.length))

    var deWord = deWords[n]
    w.innerText = deWord

    return w
}

function MoveDroppedWords(){
    for (var i = 0; i < droppingWords.length; i++){
        var w = droppingWords[i]

        var s = w.style.top
        s.slice(0, s.length-1)
        var t = parseFloat(s)
        if (t >= 100){
            const index = droppingWords.indexOf(w)
            if (index > -1){
                droppingWords.splice(index, 1)
            }
            w.remove()
        }
        else{
            w.style.top = t + 0.3 + '%'
        }
    }

    collectWord()
}

function NewDroppedWord(){
    if (r == 0){
        r = 100
        var w = GenerateDroppedWord()
        if (ins == 0){
            w.innerText = playerWord_index
            ins = Math.floor(Math.random() * (10))
        }
        else{
            ins -= 1
        }
        droppingWords.push(w)
    }
    else{
        r -= 1
    }

    MoveDroppedWords()
}

function StartRain(){
    setInterval(NewDroppedWord, 5)
}









function Reset(){

}

function OnStartup(){
    StartRain()
    changePlayerWord()
}

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
            }
            //OnStartup()
        }
    }
    return
}