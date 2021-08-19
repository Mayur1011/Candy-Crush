document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".main");
  const scoreDisplay = document.getElementById("score");
  const width = 8;
  const squares = [];
  // const coloursOfCancy = ["red", "green", "yellow", "purple", "orange"];
  const coloursOfCancy = [
    "url(images/red-candy.png)",
    "url(images/yellow-candy.png)",
    "url(images/orange-candy.png)",
    "url(images/purple-candy.png)",
    "url(images/green-candy.png)",
    "url(images/blue-candy.png)",
  ];
  let score = 0;

  // Creating a board
  // Ad we are creating a 8x8 grid and each cell/candy in this grid is a div.
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      //put this child into the gird
      grid.appendChild(square);
      squares.push(square);

      // Assigning a random colour to each div
      let randomColor = Math.floor(Math.random() * coloursOfCancy.length);
      square.style.backgroundImage = coloursOfCancy[randomColor];

      //To drag each square and give unique ID to each cell so we can see which square is actually moved.
      square.setAttribute("draggable", "true");
      square.setAttribute("id", i);
    }
  }
  createBoard();

  //! DRAG CANDIES!
  // Handling each drag event
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    console.log(this.id, "dragStart");
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
    // this.style.backgroundImage = ''
  }

  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragOver");
  }

  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragEnter");
  }

  function dragLeave() {
    console.log(this.id, "dragLeave");
  }

  function dragDrop() {
    console.log(this.id, "dragDrop");
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  function dragEnd() {
    console.log(this.id, "dragEnd");
    // valid places where we can replace out candies.
    let aboveTheCurrentCandy = squareIdBeingDragged - width;
    let belowTheCurrentCandy = squareIdBeingDragged + width;
    let leftToCurrentCandy = squareIdBeingDragged - 1;
    let rightToCurrentCandy = squareIdBeingDragged + 1;
    let validplaces = [
      leftToCurrentCandy,
      aboveTheCurrentCandy,
      rightToCurrentCandy,
      belowTheCurrentCandy,
    ];
    // So if the id of the square to be replaced lies in valid places then we can replace the current candy.
    let validMove = validplaces.includes(squareIdBeingReplaced);
    if (squareIdBeingReplaced && validMove) {
      // If the distance of candy to be replaced is valid then we can replace the current candy with that candy
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      // If there is candy present at a particular index but it is not present a valid distance from the current candy.
      // Then dont replace the candy.
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  //Generating new candies
  function moveDownCandies() {
    for (i = 0; i < 55; i++) {
      // fist seven rows
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === "") {
          let randomColor = Math.floor(Math.random() * coloursOfCancy.length);
          squares[i].style.backgroundImage = coloursOfCancy[randomColor];
        }
      }
    }
  }

  // Checking for matches

  // Row of 4 matches
  function checkRow4() {
    // loop over 4 adjacent
    for (let i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedcolor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) {
        continue;
      }
      if (
        // if all the four colors are same then we make them as blank
        rowOfFour.every(
          (index) => squares[index].style.backgroundImage === decidedcolor
        ) &&
        !isBlank
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  // checkRow4();

  // Columns of 4 matches
  function checkColumn4() {
    // loop over 3 edges
    for (let i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + 2 * width, i + 3 * width];
      let decidedcolor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        // if all the three colors are same then we make them as blank
        columnOfFour.every(
          (index) => squares[index].style.backgroundImage === decidedcolor
        ) &&
        !isBlank
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  // checkColumn4();

  // Row of 3 matches
  function checkRow3() {
    // loop over 3 edges
    for (let i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedcolor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) {
        continue;
      }
      if (
        // if all the three colors are same then we make them as blank
        rowOfThree.every(
          (index) => squares[index].style.backgroundImage === decidedcolor
        ) &&
        !isBlank
      ) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  // checkRow3();

  // Columns of 3 matches
  function checkColumn3() {
    // loop over 3 edges
    for (let i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + 2 * width];
      let decidedcolor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        // if all the three colors are same then we make them as blank
        columnOfThree.every(
          (index) => squares[index].style.backgroundImage === decidedcolor
        ) &&
        !isBlank
      ) {
        score += 3;
        scoreDisplay.innerHTML = score;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  // checkColumn3();

  window.setInterval(() => {
    moveDownCandies();
    checkRow4();
    checkColumn4();
    checkRow3();
    checkColumn3();
  }, 100);
});
