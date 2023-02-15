function elliptic_integral(a, b, start, end, n) {
    var h = (end - start) / n;
    var sum = 0;
    for (var i = 0; i <= n; i++) {
        var x = start + i * h;
        sum += Math.sqrt(1 - ((a*a - b*b) / (a*a + (b*b - a*a) * Math.pow(Math.sin(x), 2)))) * h;
    }
    return 4 * a * sum;
}

function calculate() {
    var a = document.getElementById("a").value;
    var b = document.getElementById("b").value;
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var n = document.getElementById("n").value;
    var result = elliptic_integral(a, b, start, end, n);
    document.getElementById("result").innerHTML = result;
}
