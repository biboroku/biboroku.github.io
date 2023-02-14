function calculate() {
    const matrixInput = document.getElementById('matrix').value;
    const matrix = parseMatrix(matrixInput);
  
    const determinant = calculateDeterminant(matrix);
    document.getElementById('determinant').value = determinant;
  
    const inverse = calculateInverse(matrix);
    document.getElementById('inverse').value = formatMatrix(inverse);
  
    const rank = calculateRank(matrix);
    document.getElementById('rank').value = rank;
  }
  
  function calculatePower() {
    const matrixInput = document.getElementById('matrix').value;
    const matrix = parseMatrix(matrixInput);
    const power = parseInt(document.getElementById('power').value);
  
    const poweredMatrix = calculateMatrixPower(matrix, power);
    document.getElementById('poweredMatrix').value = formatMatrix(poweredMatrix);
  }
  
  function parseMatrix(matrixInput) {
    const matrixValues = matrixInput.split(',');
    const matrixSize = Math.sqrt(matrixValues.length);
    const matrix = [];
  
    for (let i = 0; i < matrixSize; i++) {
      const row = [];
      for (let j = 0; j < matrixSize; j++) {
        const index = i * matrixSize + j;
        row.push(parseFloat(matrixValues[index]));
    }
    matrix.push(row);
  }
  return matrix;
}

function calculateDeterminant(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    return parseInt((a * d - b * c).toFixed(0));
}

function calculateInverse(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    const determinant = calculateDeterminant(matrix);
    if (determinant === 0) {
      return null;
    }
    const inverse = [
      [parseInt((d / determinant).toFixed(0)), parseInt((-b / determinant).toFixed(0))],
      [parseInt((-c / determinant).toFixed(0)), parseInt((a / determinant).toFixed(0))]
    ];
    return inverse;
  }

function calculateRank(matrix) {
  if (calculateDeterminant(matrix) !== 0) {
    return 2;
  }
  const row1 = matrix[0];
  const row2 = matrix[1];
  const scaledRow1 = scaleVector(row1, row2[0] / row1[0]);
  if (vectorsEqual(scaledRow1, row2)) {
    return 1;
  }
  return 0;
}

function calculateMatrixPower(matrix, power) {
    if (power === 0) {
      return [[1, 0], [0, 1]];
    }
    let poweredMatrix = matrix;
    for (let i = 1; i < power; i++) {
      poweredMatrix = multiplyMatrices(poweredMatrix, matrix);
    }
    // 四捨五入して整数に丸める
    poweredMatrix = poweredMatrix.map(row => row.map(element => parseInt(element.toFixed(0))));
    return poweredMatrix;
  }

function multiplyMatrices(matrix1, matrix2) {
  const result = [];
  for (let i = 0; i < matrix1.length; i++) {
    const row = [];
    for (let j = 0; j < matrix2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < matrix1[0].length; k++) {
        sum += matrix1[i][k] * matrix2[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

function scaleVector(vector, scalar) {
  return vector.map(element => element * scalar);
}

function vectorsEqual(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    return false;
  }
  for (let i = 0; i < vector1.length; i++) {
    if (vector1[i] !== vector2[i]) {
      return false;
    }
  }
  return true;
}

function formatMatrix(matrix) {
  let result = '';
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      result += matrix[i][j].toFixed(2) + ' ';
    }
    result = result.trim();
    result += '\n';
  }
  return result.trim();
}
  