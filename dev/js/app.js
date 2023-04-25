//create html elements
let title = document.createElement(`h1`);
title.innerHTML = `<b>Flipping a Matrix Along a Diagonal<b/>`;

let canvas = document.createElement(`div`);
canvas.setAttribute(`class`, `canvas`);

let originalMatrixTitle = document.createElement(`h2`);
originalMatrixTitle.innerText = `Original Matrix`;

let flippedMatrixTitle = document.createElement(`h2`);
flippedMatrixTitle.innerText = `Flipped Matrix`;

let makeMatrix = (n) => {
    let counter = 1;
    let matrix =[];

    for (let row = 0; row < n; row++){ //set up original matrix n*n
        let tableRow = []; //create new table row

        for (let column = 0; column < n; column++) {
            tableRow.push(counter);
            counter++;
        }
        matrix.push(tableRow);
    }
    return matrix;
};

let swap =  (matrix) => {
    let n =  matrix.length -1;
    for (let row = 0 ;row < n; row++){
        for (let column = 0; column < n - row; column++) {
            //swap cells
            let temp = matrix[n - row][n - column];
            matrix[n - row][n - column] = matrix[row][column];
            matrix[row][column] = temp;
        }
    }
    return matrix;
};

let makeTable =  (matrix) => {
    let table = document.createElement(`table`);

    for (let row = 0 ;row < matrix.length; row++){
        let tr = table.insertRow();//create new table row

        for (let column = 0; column < matrix.length; column++)
        {
            let td = tr.insertCell(); //create a new cell

            if(column === (matrix.length-1 - row)){ //cells is a diagonal
                td.setAttribute(`class`, `diagonal`);
            }
            td.innerText = matrix[row][column]; //insert value
        }
    }
    return table;
};

window.onload = () => {

    let validInput = false;

    while(!validInput){
        let input = window.prompt(`Input your matrix size`);

        //make sure input is valid
        if(!isNaN(parseInt(input)) && parseInt(input) > 1){
            validInput = true;
            let matrix = makeMatrix(input);

            //inject html
            document.body.appendChild(title);
            document.body.appendChild(canvas);
            canvas.appendChild(originalMatrixTitle);
            canvas.appendChild(makeTable(matrix));

            // make sure matrix is swapped first
            let promise = new Promise(function(resolve) {
                swap(matrix);
                canvas.appendChild(flippedMatrixTitle);
                resolve(matrix);
            });

            //inject swapped matrix
            promise.then((matrix) => {
                canvas.appendChild(makeTable(matrix));
            });

        }else{
            alert(`Please enter a integer value greater than 1`);
        }
    }
};


