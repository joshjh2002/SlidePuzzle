const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const imageUrl = urlParams.get("image");
const columns = urlParams.get("cols");
const rowsUrl = urlParams.get("rows");

let tiles;
let cols;
let rows;
let w, h;
let hasWon = false;
// Loading the image
function preload() {
  if (imageUrl == null) {
    source = loadImage("bmo.jpg");
  } else {
    source = loadImage(imageUrl);
  }

  if (columns == null) cols = 4;
  else cols = columns;

  if (rowsUrl == null) rows = 4;
  else rows = rowsUrl;
}

function setup() {
  createCanvas(400, 400);
  // pixel dimensions of each tiles
  w = width / cols;
  h = height / rows;
  let index = 0;

  tiles = new Array(cols);

  source.resize(400, 400);

  // Chop up source image into tiles
  for (let i = 0; i < cols; i++) {
    tiles[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      let img = createImage(w, h);
      img.copy(source, i * w, j * h, w, h, 0, 0, w, h);
      let tile = new Tile(index, img);
      tiles[i][j] = tile;
      index++;
    }
  }

  tiles[cols - 1][rows - 1].index = -1;

  shuffle_tiles();
}

function draw() {
  background(0);
  if (!hasWon) {
    // Draw the current board
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let tile = tiles[i][j];
        if (tile.index > -1) {
          let img = tile.img;
          image(img, i * w, j * h, w, h);
        }
      }
    }

    // Show it as grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        strokeWeight(2);
        noFill();
        rect(i * w, j * h, w, h);
      }
    }

    let current_tile = 0;
    let maxTile = cols * rows - 1;
    let incorrect = false;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let tile = tiles[i][j];
        if (current_tile != tile.index && current_tile < maxTile) {
          incorrect = true;
        }
        current_tile++;
      }
    }
    if (!incorrect) {
      hasWon = true;
    }
  } else {
    textSize(32);
    text("You WON!", 120, 200);
    fill(255);
  }
}

// Swap two elements of an array
function swap(i, j, a, b) {
  //console.log(i + ", " + j + "\n" + a + ", " + b);
  let temp = tiles[i][j];
  tiles[i][j] = tiles[a][b];
  tiles[a][b] = temp;
}

// Move based on click
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  if (i > cols - 1 || j > rows - 1 || i < 0 || j < 0) return;
  move(i, j);
}

function move(i, j) {
  let tile = tiles[i][j];
  if (tile.index <= -1) return;

  if (i + 1 < cols) {
    //console.log(tiles[i + 1][j]);
    if (tiles[i + 1][j].index <= -1) {
      swap(i, j, i + 1, j);
      return;
    }
  }

  if (i - 1 >= 0) {
    //console.log(tiles[i - 1][j]);
    if (tiles[i - 1][j].index <= -1) {
      swap(i, j, i - 1, j);
      return;
    }
  }

  if (j + 1 < rows) {
    //console.log(tiles[i][j + 1]);
    if (tiles[i][j + 1].index <= -1) {
      swap(i, j, i, j + 1);
      return;
    }
  }
  if (j - 1 >= 0) {
    //console.log(tiles[i][j - 1]);
    if (tiles[i][j - 1].index <= -1) {
      swap(i, j, i, j - 1);
      return;
    }
  }
}

function shuffle_tiles() {
  for (let i = 0; i < 100; i++) {
    let i = floor(random() * (cols - 1));
    let a = floor(random() * (cols - 1));

    let j = floor(random() * (rows - 1));
    let b = floor(random() * (rows - 1));
    swap(i, j, a, b);
  }
}

function SubmitCustomData() {
  let query = "";

  let img_box = window.document.getElementById("img_box");
  let cols_box = window.document.getElementById("cols_box");
  let rows_box = window.document.getElementById("rows_box");

  if (img_box.value != "") query += "image=" + img_box.value + "&";

  if (cols_box.value != "") query += "cols=" + cols_box.value + "&";

  if (rows_box.value != "") query += "rows=" + rows_box.value;

  window.location.href = "index.html?" + query;
}
