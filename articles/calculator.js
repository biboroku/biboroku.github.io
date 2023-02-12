function buttonPressed(buttonValue) {
    var inputField = document.getElementById("input");
  
    if (buttonValue === "=") {
      try {
        inputField.value = math.evaluate(inputField.value);
      } catch (error) {
        inputField.value = "Error";
      }
    } else {
      inputField.value += buttonValue;
    }
  }
  
  function clearInput() {
    document.getElementById("input").value = "";
  }