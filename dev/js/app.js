// Declare empty arrays to hold the original and flipped matrices
let matrix = [];
let FlippedMatrix = [];

//function used to create the OG size of the matrix
const createOGMatrix = (n) => {
    let counter = 1;
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(counter);
            counter++;
        }
        matrix.push(row);
    }
};

// function to flip the OG matrix horizontally
const flipMatrix = () => {
    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        for (let j = 0; j < matrix.length; j++) {
            row.push(matrix[matrix.length - j - 1][matrix.length - i - 1]);
        }
        FlippedMatrix.push(row);
    }
};

//Displays the matrix as an html table inside a container.
const displayMatrix = (matrix, container) => {
    let table = document.createElement(`table`);
    for (let i = 0; i < matrix.length; i++) {
        let row = document.createElement(`tr`);
        for (let j = 0; j < matrix.length; j++) {
            let cell = document.createElement(`td`);
            cell.innerText = matrix[i][j];
            if (i === j) {
                cell.classList.add(`diagonal`);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);
};

//Takes an input from the user and validates it.
//This will be true if # is > or = to 2
//Return false in other cases
const validateInput = (input) => {
    let n = parseInt(input);
    return !isNaN(n) && n >= 2;
};

window.onload = () => {
    let validInput = false;
    let input;
    // Tells the user to keep putting in a value until a correct one is given

    do {
        input = window.prompt(`Enter matrix size (at least 2)`);
        validInput = validateInput(input);
        //Alerts the user if the input is not vaild
        if (!validInput) {
            alert(`Invalid input. Please enter an integer value at least 2.`);
        }
    } while (!validInput);

    //Creates the OG and Flipped Matrix
    createOGMatrix(parseInt(input));
    flipMatrix();

    //Container for the Matrices
    const canvas = document.createElement(`div`);
    canvas.classList.add(`canvas`);
    document.body.appendChild(canvas);

    //Title and Display of OG
    const originalMatrixTitle = document.createElement(`h2`);
    originalMatrixTitle.innerText = `OG Matrix`;
    canvas.appendChild(originalMatrixTitle);
    displayMatrix(matrix, canvas);

    //Title and Display of Flipped
    const flippedMatrixTitle = document.createElement(`h2`);
    flippedMatrixTitle.innerText = `Fliped Matrix`;
    canvas.appendChild(flippedMatrixTitle);
    displayMatrix(FlippedMatrix, canvas);
};
