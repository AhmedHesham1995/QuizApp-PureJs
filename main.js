
let countSpan = document.querySelector(".quiz-app .quiz-info .count span");
let bullets = document.querySelector(".bullets");
let spans = document.querySelector(".spans");
let divh2 = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".count-down");


let questionIndex = 0;
let rightAns = 0;
let countDownInterval;


function getQuestions () {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            console.log(questionsObject);
            let questionsCount = questionsObject.length;
            createSpans(questionsCount);
            addQuestionstoPage(questionsObject[questionIndex],questionsCount);
            countDown(15,questionsCount)
            submitButton.onclick = ()=>{
                clearInterval(countDownInterval);
                countDown(15,questionsCount);
                let rightAnswer = questionsObject[questionIndex].right_answer;
                questionIndex++;
                checkAnswer(rightAnswer,questionsObject);
                divh2.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionstoPage(questionsObject[questionIndex],questionsCount);
                handleBullets();
                showResults(questionsCount);

            }
        
            
        }
    }
myRequest.open("GET","html_questions.json",true);
myRequest.send();
}

getQuestions();

function createSpans(num) {
    countSpan.innerHTML = num;
    for (let i=0;i<num;i++) {
        let bullet = document.createElement("span");
        spans.appendChild(bullet);
        if (i===0) {
            bullet.className = "on";
        }
    }
}

function addQuestionstoPage (obj,num) {
    if (questionIndex<num) {
        
    let heading = document.createElement("h2");
    heading.appendChild(document.createTextNode(obj.title));
    divh2.appendChild(heading);
    for (let i=1;i<=4;i++) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";
        let radio = document.createElement("input");
        radio.name = "questions";
        radio.type = "radio";
        radio.id = `answer_${i}`;
        radio.dataset.answer = obj[`answer_${i}`];
        let label = document.createElement("label");
        label.htmlFor =`answer_${i}`;
        label.appendChild(document.createTextNode(obj[`answer_${i}`]));
        mainDiv.appendChild(radio);
        mainDiv.appendChild(label);
        answersArea.appendChild(mainDiv);

        if (i===1){
            radio.checked = true;
        }
    }
    }
    
}

function checkAnswer(rAnswer,count){
    let choices = document.getElementsByName("questions");
    let choosenAnswer;
    for(let i=0;i<choices.length;i++) {
        if (choices[i].checked) {
            choosenAnswer = choices[i].dataset.answer;
        }
    }    
        if (rAnswer===choosenAnswer) {
            rightAns++;
            
        }
}

function handleBullets(){
    let bullspan = document.querySelectorAll(".bullets .spans span");
    let bullArray = Array.from(bullspan);
    bullArray.forEach((span,index)=>{
        if (questionIndex===index) {
            span.classList.add("on");
        }
    })
}

function showResults(count){
    let result;
    if (questionIndex===count) {
        divh2.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAns===count){
            result = `<span class="Perfect">Perfect! </span>,You answered ${rightAns} from ${count} `  
        } else if (rightAns>count/2){
            result = `<span class="good">Good! </span>,You answered ${rightAns} from ${count} `
        } else {
            result =`<span class="Bad">Bad! </span>,You answered ${rightAns} from ${count} `
        }
        results.innerHTML = result;
        results.style.padding = "30px";
        results.style.textAlign = "center";
        results.style.fontSize = "20px";
        results.style.color = "#fff";
    }
}

function countDown(duration,count){
    if (questionIndex<count){
        countDownInterval = setInterval(function(){
            let minutes = parseInt(duration/60);
            let seconds = parseInt(duration%60);
            minutes = minutes<10?`0${minutes}`:`${minutes}`;
            seconds = seconds<10?`0${seconds}`:`${seconds}`
            countDownElement.innerHTML = `${minutes}:${seconds}`
            if(--duration<0){
                clearInterval(countDownInterval);
                submitButton.onclick();
            }
        },1000)
    }
}