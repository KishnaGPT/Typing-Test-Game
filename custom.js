
const typingText = document.querySelector('.typing-text p'),
inpField = document.querySelector(".wrapper .input-field"),
mistakeTag = document.querySelector(".mistake span"),
timeTag = document.querySelector(".time span b"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");
acuuracyTag = document.querySelector(".accuracy span b");
tryAgainBtn = document.querySelector("button");

const container = document.getElementById('buttons-container');
// const display = document.querySelector(".typing-text p")

let timer, 
maxTime=60,
timeLeft = maxTime,
accuracy = charIndex = mistake = isTyping = 0;



for (let key in alphabetData) {
    const button = document.createElement('button');
    button.textContent = key.toUpperCase();   // Show key as button text
    button.setAttribute('data-key', key);
    button.classList.add("style"); 
        // Store key in data attribute

    button.addEventListener('click', function () {
    let keyClicked = this.getAttribute('data-key');
    let value = alphabetData[keyClicked];
    typingText.innerText=value;

    
    typingText.innerHTML=""; //if we dont write this then new paragraph will be apended to the previous one.


    value.split("").forEach((span)=>{
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML+=spanTag;
    });

    typingText.scrollTop = 0;

    typingText.querySelectorAll("Span")[0].classList.add("active"); //shows the blinking underline to first char by default

    typingText.querySelectorAll("span")[0].scrollIntoView({ 
    behavior: "smooth", 
    block: "nearest", 
    inline: "start" 
    }); // Fix: Scroll to the first character after generating the paragraph

    //focusing input field on keydown or click event(only when we click on the text inside paragraph)

    document.addEventListener("keydown",()=>{inpField.focus()}); //pass variable and one function
    typingText.addEventListener("click",()=>{inpField.focus()})
      
    
    
    inpField.addEventListener("input",initTyping);
    tryAgainBtn.addEventListener("click",resetGame);

      });

      container.appendChild(button);


    }



function initTyping(){
    const characters = typingText.querySelectorAll("span");
    
    // let typeChar = inpField.value.split('')[0];
    // console.log(typeChar)

    let typeChar = inpField.value.split('')[charIndex];

    //below if will only run if the user has typed less than total characters and timer is greater than 0
    if(charIndex < characters.length - 1 && timeLeft > 0){
        

        //once timer start, it won't restart again on every key clicked
        if(!isTyping){
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        

        // if user hasn't entered any character or pressed backspace

        if(typeChar==null){

            charIndex--; //decrement charindex
            // mistake--;
            //decrement mistake only if the charIndex span contains incorrect class
            if(characters[charIndex].classList.contains("incorrect")){
                mistake--;
            }

            characters[charIndex].classList.remove("correct", "incorrect");
        }
        else{

            // if user typed character matched the shown character then it will add the class correct if not matched then it will add class incorrect in that particular span tag

            if(characters[charIndex].innerText===typeChar){
                console.log("correct");
                characters[charIndex].classList.add("correct");
            }
            else{
                mistake++;
                console.log("Incorrect");
                characters[charIndex].classList.add("incorrect");
            }

            charIndex++; //increments character index either user typed it correctly or incorrectly

        }

        characters.forEach(span => span.classList.remove("active"));//removes the current active line from the typed character

        characters[charIndex].classList.add("active");//adds the current active line to the next character 

        characters[charIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });


        let wpm = Math.round((((charIndex-mistake)/5) / (maxTime-timeLeft))*60);

        // wpmTag.innerText=wpm; //showing infinity when we were using this

        //if wpm value is 0, empty or infinity then setting it's value to 0
        wpm = wpm<0 || !wpm || wpm===Infinity ? 0:wpm;

        let accuracy = charIndex > 0 ? Math.round(((charIndex - mistake) / charIndex) * 100) : 0;

        mistakeTag.innerText=mistake;
        wpmTag.innerText=wpm;
        cpmTag.innerText = charIndex - mistake; //since cpm doesn't count mistakes
        acuuracyTag.innerText =accuracy;



    }
    else{
        inpField.value="";
        clearInterval(timer);
        showPopup();

    }

}

function initTimer() {
    //if timeLeft is greater than 0 then decrement the timeleft else clear the timer
    if(timeLeft>0){
        timeLeft--;
        timeTag.innerText = timeLeft;
    }
    else{
        clearInterval(timer);
    }
}


function resetGame(){

    inpField.value="";
    clearInterval(timer);
    timeLeft=maxTime,
    charIndex= mistake= isTyping=0;
    // typingText.innerHTML="";
    timeTag.innerText=timeLeft;
    mistakeTag.innerText=mistake;
    wpmTag.innerText=0;
    cpmTag.innerText = 0;
    acuuracyTag.innerText=0;

    
    const characters = typingText.querySelectorAll("span");

    //console.log(characters);

    characters.forEach((span)=>{
        span.classList.remove("correct", "incorrect", "active")
    })
    //console.log(characters)

    charIndex=0;
    if(characters.length>0){
        characters[0].classList.add("active");
    }

}

function showPopup() {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");

    
    let wpm = Math.round((((charIndex - mistake) / 5) / maxTime) * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    let cpm = charIndex - mistake;

    let remark = getWpmRating(wpm);

    let accuracy = charIndex > 0 ? Math.round(((charIndex - mistake) / charIndex) * 100) : 0;

    popupMessage.innerHTML = `<br>
        ❌ Mistakes: <strong>${mistake}</strong><br><br>
        🔤 Characters Per Minute (CPM): <strong>${cpm}</strong><br><br>
        📝 Words Per Minute (WPM): <strong>${wpm}</strong><br><br>
        🎯 Accuracy: <strong>${accuracy}%</strong><br><br>
        ${remark}<br>
    `;
    popup.style.display = "flex";
    popup.style.fontSize = "20px";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    resetGame();
}

function getWpmRating(wpm) {
    if (wpm <= 20) return "🔴 <strong>Keep Practicing!</strong> You’re just getting started!";
    else if (wpm <= 40) return "🟡 <strong>Getting There!</strong> Good progress, keep it up!";
    else if (wpm <= 60) return "🟢 <strong>Well Done!</strong> You're typing confidently!";
    else return "⭐ <strong>Typing Pro!</strong> You're crushing it!";
}