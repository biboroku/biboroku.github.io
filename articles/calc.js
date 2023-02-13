
function clearOutput() {
    document.getElementById('output').value = '';
  }
  
function deleteChar() {
    let output = document.getElementById('output').value;
    document.getElementById('output').value = output.substring(0, output.length - 1);
  }
  
function insertChar(char) {
    document.getElementById('output').value += char;
  }
  
function calculate() {
    // Get the expression from the input field
    let expr = document.getElementById('output').value;
  
    // Replace trigonometric function names with their respective functions
    expr = expr.replace(/sin/g, 'Math.sin');
    expr = expr.replace(/cos/g, 'Math.cos');
    expr = expr.replace(/tan/g, 'Math.tan');
    expr = expr.replace(/asin/g, 'Math.asin');
    expr = expr.replace(/acos/g, 'Math.acos');
    expr = expr.replace(/atan/g, 'Math.atan');
    expr = expr.replace(/sinh/g, 'Math.sinh');
    expr = expr.replace(/cosh/g, 'Math.cosh');
    expr = expr.replace(/tanh/g, 'Math.tanh');
    expr = expr.replace(/asinh/g, 'Math.asinh');
    expr = expr.replace(/acosh/g, 'Math.acosh');
    expr = expr.replace(/atanh/g, 'Math.atanh');
    expr = expr.replace(/exp/g, 'Math.exp');
    expr = expr.replace(/log/g, 'Math.log');
    expr = expr.replace(/sqrt/g, 'Math.sqrt');
    expr = expr.replace(/abs/g, 'Math.abs');
    expr = expr.replace(/pow/g, 'Math.pow');
    expr = expr.replace(/round/g, 'Math.round');
    expr = expr.replace(/floor/g, 'Math.floor');
    expr = expr.replace(/ceil/g, 'Math.ceil');
    expr = expr.replace(/gamma/g, 'gamma');
  
    // Replace pi and e with their respective values
    expr = expr.replace(/pi/g, Math.PI);
    expr = expr.replace(/e/g, Math.E);
  
    // Evaluate the expression
    let result;
    try {
      result = eval(expr);
    } catch (error) {
      result = 'Error';
    }
  
    // Display the result
    document.getElementById('output').value = result;
  }
  
  function gamma(n) {
    // Coefficients for the approximation
    const p = [
      -1.716185138865495,
      24.76565080557592,
      -379.80425647094563,
      629.3311553128184,
      866.9662027904133,
      -31451.272968848367,
      -36144.413418691176,
      66456.14382024054
    ];
  
    // Calculate the gamma function using Lanczos approximation
    let g = 7;
    if (n < 0.5) {
      return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
    }
    n -= 1;
    let a = p[0];
    let t = n + g + 0.5;
    for (let i = 1; i < p.length; i++) {
      a += p[i] / (n + i);
    }
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * a;
  }
  