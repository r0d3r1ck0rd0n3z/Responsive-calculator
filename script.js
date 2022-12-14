// ๐ฝ ::: List most variables here on top

var valuesToCompute   = document.getElementById("rawValuesToCompute");
var userInputWindow   = document.getElementById("liveInputsFromUser");
var displayedEquation = document.getElementById("formulasShownOnTop");
var backRoomHistory   = document.getElementById("collectorOfHistory");
var backRoomContent   = document.getElementById("allPreviousPresses");

var decimalPoint = document.getElementById(".");
var theDeleteKey = document.getElementById("backspace");
var thePercntKey = document.getElementById("%");

var equalsWasPressed = 0;
var lastFunctionUsed = "";
var horizontalLine = "โ".repeat(10);
var carriageReturn = String.fromCharCode(13);

var styled;


//  ๐ฝ ::: Get and update values on the UI 

function getValuesToCompute() {
    return valuesToCompute.innerText;
}

function computeTheseValues(num) {
    valuesToCompute.innerText = num;
}

function getValueOnScreen() {
    return userInputWindow.innerText;
}


//  ๐ฝ ::: Replace the standard operators with their unicode equivalent.

function styleTheOperators(styled) {
  
      switch (styled) {
        case "+":
            styled = " + ";
            break;
        case "-":
            styled = " โ ";
            break;
        case "*":
            styled = " ร ";
            break;
        case "/":
            styled = " รท ";
            break;
        default:
            styled = styled;
            break;
    }     
  return styled;
}


//  ๐ฝ ::: 'Save' user keystrokes to the backroom

function sendThisToBackR(num) {
    if (Number(num)) {
        styled = insertCommas(num);
    } else {
        styled = num.replace(/\+/g, ' + ')
                    .replace(/\-/g, ' โ ')
                    .replace(/\*/g, ' ร ')
                    .replace(/\//g, ' รท ');
    }

  if(styled.startsWith("0\r",0)) { styled.replace(/0\\r/g,""); }
  
    // if bottom panel has no value, but user presses an operator key 
    switch (styled) {
        case "0\r + ":
            styled = "+";
            break;
        case "0\r โ ":
            styled = "โ";
            break;
        case "0\r ร ":
            styled = "ร";
            break;
        case "0\r รท ":
            styled = "รท";
            break;
        default:
            styled = styled;
            break;
    }

    backRoomContent.innerText += styled + String.fromCharCode(13);
    backRoomHistory.scrollTop  = backRoomHistory.scrollHeight;

}


//  ๐ฝ ::: Update the 'formula' displayed on the upper panel of the calc screen

function getCurrentEquation() {
    return displayedEquation.innerText;
}

function updateCurrentEquation(num) {
    if (Number(num)) {
        styled = insertCommas(num);
    } else {
        styled = styleTheOperators(num);
    }

    displayedEquation.innerText += " " + styled;
}

function clearDisplayedEquation() {
    displayedEquation.innerText = "";
}


//  ๐ฝ ::: Functions to style and format the numbers before displaying to the user

function insertCommas(num) {

    var n = Number(num);
    var value = n.toLocaleString("en", { maximumFractionDigits: 20});
    return value;
}

function removeCommas(num) {
    try 
    {
        return num.replace(/,/g, "");
    } 
    catch (e) 
    {
        return num;
    }
}

function showThisOnScreen(num) {
  
  num = num.toString();
  
  try {
    
        if ( num == "" ) {
          userInputWindow.innerText = num;
        } 
        else if(num.endsWith(".")) {
          userInputWindow.innerText = num;
        } 
      
        // handler for values with decimal points
        else if(/\.[0]+/.test(num) || /\.\d+[0]+/.test(num) ) {   
          var sliced = num.split(".");
          var leftSide  = insertCommas(sliced[0]);
          var rightSide = sliced[1];
          var newNum = leftSide + "." + rightSide;
          userInputWindow.innerText = newNum;
        } 
        else {
          userInputWindow.innerText = insertCommas(num);
        }
    
    } catch(e) {
      userInputWindow.innerText = num;
  }

}

function forceNumbersToRightAlign() {
  userInputWindow.scrollLeft = 200000 ;
}

function checkIfDotIsNeeded() {
    var userInput = getValueOnScreen();
    if (userInput.includes(".")) {
        decimalPoint.classList.add("ignore");
    } else {
        decimalPoint.classList.remove("ignore");
    }
}


//  ๐ฝ ::: Enable or disable keys based on certain conditions

function setStatusOfThisKey(key,status) {
  if (status == "enabled") { key.classList.remove("ignore"); }
  else { key.classList.add("ignore"); }
}


//  ๐ฝ ::: Attach functions to the number keys

setStatusOfThisKey( thePercntKey, "disabled");
var number = document.getElementsByClassName("number");

for (var i = 0; i < number.length; i++) {
    number[i].addEventListener("click", function() {
        var userInput = getValueOnScreen();
        var keyPressed = this.id;

        userInput = userInput + keyPressed;
        setStatusOfThisKey( theDeleteKey, "enabled");

        // If equals was pressed again, just forward the current user input to the top panel
        if (equalsWasPressed == 1) {
            showThisOnScreen("");
            clearDisplayedEquation();
            userInput = keyPressed;
        }
      
        forceNumbersToRightAlign();
     
        // Fix for values with decimal points 
        userInput = userInput
          .replace(/[^\d.-]/g, "")
          .replace(/(\d+\.\d+)(\.)(\d+)/, "$1$3")
          .replace(/\.\./g, '.');
        if (userInput === ".") {
            userInput = "0.";
        } 

        checkIfDotIsNeeded();
        equalsWasPressed = 0;
        showThisOnScreen(userInput);

          
    });
}


//  ๐ฝ ::: Attach functions to the operator keys 

var operator = document.getElementsByClassName("operator");

for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener("click", function() {
        var userInput = getValueOnScreen();
        var forComputation = getValuesToCompute();

        
//  ๐ฝ ::: CLEAR key
        
        if (this.id == "clear") {
            userInput = "";
            showThisOnScreen("");
            computeTheseValues("");
            sendThisToBackR("Cleared" + carriageReturn + horizontalLine);
            clearDisplayedEquation();
            checkIfDotIsNeeded();
            setStatusOfThisKey( theDeleteKey, "enabled"); 
          
 
//  ๐ฝ ::: BACKSPACE key
            
        } else if (this.id == "backspace") {
            if (userInput) {
                userInput = userInput.substr(0, userInput.length - 1);
                userInput = removeCommas(userInput);
                userInput = Number(userInput);
                showThisOnScreen(userInput);
                checkIfDotIsNeeded();
                equalsWasPressed = 0;
            }
          
          
        } else {
            userInput = getValueOnScreen();
            forComputation = getValuesToCompute();

            
//  ๐ฝ ::: If bottom panel has no input but top panel has equation             
            
            if (userInput == "" && forComputation != "") {

                if (isNaN(forComputation[forComputation.length - 1])) {
                    forComputation = forComputation.substr(0, forComputation.length - 1);
                }
            }

            
//  ๐ฝ ::: If both bottom and top panel are not empty
            
            if (userInput != "" || forComputation != "") {

                userInput = userInput == "" ? userInput : removeCommas(userInput);
                forComputation = forComputation + userInput;


//  ๐ฝ ::: If EQUALS and PERCENT keys are pressed
                
                if (this.id == "=" || this.id == "%" ) {
                    
                    var current = getCurrentEquation();
                    updateCurrentEquation(insertCommas(userInput));
                    setStatusOfThisKey( theDeleteKey, "disabled");
                    
                    // If PERCENT key was pressed, add '0.01' to the values for computation
                    if ( this.id == "%" ) {
                        forComputation += "*0.01";
                        current = current + " " + userInput + " % ";
                        clearDisplayedEquation();
                        updateCurrentEquation(current);
                        sendThisToBackR("%");
                    }

                    forComputation = removeCommas(forComputation);
                    var result = eval(forComputation);
                    showThisOnScreen(result);
                    forceNumbersToRightAlign();
                    
                  // This is just to minimize floating point errors
                  try {
                  var countDecimals = result.toString().split(".");
                  if(countDecimals[1].length > 11) { 
                    var trimmed = result.toString();
                    trimmed = trimmed.substr(0, trimmed.length - 2);
                    trimmed = Number(trimmed);
                    result = trimmed;
                    showThisOnScreen(result);
                  }} catch(e) { void(0); }
                  
                  
                  sendThisToBackR(
                        userInput +
                        carriageReturn +
                        horizontalLine
                  );
                    sendThisToBackR(
                        insertCommas(result) +
                        carriageReturn +
                        horizontalLine +
                        carriageReturn
                    );

                    // If equals was pressed again, just forward the current user input to the top panel
                    if (lastFunctionUsed == "=") {
                        displayedEquation.innerText = insertCommas(userInput);
                        setStatusOfThisKey( thePercntKey, "disabled");
                    }

                    computeTheseValues("");
                    checkIfDotIsNeeded();
                    setStatusOfThisKey( thePercntKey, "disabled");
                    equalsWasPressed = 1;
                    lastFunctionUsed = "=";
                } else {

                    
//  ๐ฝ ::: If any other operator keys are pressed ( + - * / )                    
                    
                    sendThisToBackR(
                        insertCommas(userInput) + carriageReturn + this.id
                    );
                    updateCurrentEquation(insertCommas(userInput));

                    if (equalsWasPressed === 1) {
                        clearDisplayedEquation();
                        updateCurrentEquation(insertCommas(userInput));
                        equalsWasPressed = 0;
                    }

                    forComputation = forComputation + this.id;
                    computeTheseValues(forComputation);
                    showThisOnScreen("");
                    updateCurrentEquation(this.id);
                    lastFunctionUsed = this.id; 
                    checkIfDotIsNeeded();
                    setStatusOfThisKey( thePercntKey, "enabled");
                    setStatusOfThisKey( theDeleteKey, "enabled");
                    if(this.id == "%") { setStatusOfThisKey( decimalPoint, "disabled"); }

                    
//  ๐ฝ ::: If operator keys are pressed, but the bottom panel is empty
                    
                    if (userInput == "") {
                        var beautified = forComputation
                            .replace(/\+/g, ' + ')
                            .replace(/\-/g, ' โ ')
                            .replace(/\*/g, ' ร ')
                            .replace(/\//g, ' รท ');

                        beautified = beautified.split(' ');

                        beautified.forEach(function(item, index) {
                            if (Number(item)) {
                                beautified[index] = Number(item).toLocaleString("en", {maximumFractionDigits: 20});
                            }
                        });

                        var beautifiedOutput = beautified.join(" ");
                        displayedEquation.innerText = beautifiedOutput;
                    }


                }
            }
        }
    });
}


//  ๐ฝ ::: If user presses the button to show history

document.getElementById("OrangeTopButton").onclick = function() {
    backRoomHistory.classList.toggle("styled-lightbox");
    backRoomHistory.scrollTop = backRoomHistory.scrollHeight;
};
