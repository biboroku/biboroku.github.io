function convert() {
    const decimalNumber = document.getElementById("inputNumber").value;
    const isNegative = decimalNumber < 0;
    let quotient = Math.abs(decimalNumber);
    let remainder = 0;
    let quaterImaginary = "";
    
    while (quotient > 0) {
      remainder = quotient % 4;
      quotient = Math.floor(quotient / 4);
      quaterImaginary = remainder.toString() + quaterImaginary;
    }
    
    if (isNegative) {
      quaterImaginary = "-" + quaterImaginary;
    }
    
    quaterImaginary = quaterImaginary.replace(/0/g, "i")
                                     .replace(/1/g, "-i")
                                     .replace(/2/g, "-1-i")
                                     .replace(/3/g, "1+i");
    
    document.getElementById("output").innerHTML = quaterImaginary;
  }
  