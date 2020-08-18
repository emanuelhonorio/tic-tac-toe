const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const winSound = new sound('./sounds/win.mp3')
const clickSound = new sound('./sounds/click.mp3')
const errorSound = new sound('./sounds/error.mp3')
const drawSound = new sound('./sounds/draw.mp3')
let imgs = {
  'X': new Image(),
  'O': new Image(),
}
imgs['X'].src = `./imgs/X.png`
imgs['O'].src = `./imgs/O.png`

let state = {
  cells: null,
  p1Turn: null,
  draw: null,
  moves: null,
  endGame: null
}


init()
canvas.addEventListener('mousedown', onClick)


function sound(src) {
  this.sound = document.createElement('audio')
  this.sound.src = src
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);

  this.play = function() {
    this.sound.play()
  }
  this.stop = function() {
    this.sound.stop()
  }
}

function init() {
  state = {
    cells: [[null, null, null], [null, null, null], [null, null, null]],
    p1Turn: true,
    draw: false,
    moves: 0,
    endGame: false
  }
  
  clearScreen()
  drawBoard()
}

function clearScreen() {
  context.fillStyle = '#fff'
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawBoard() {
  clearScreen()
  let x = 0, y = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      context.textAlign = 'center'
      context.strokeStyle = "#000"
      context.strokeRect(x, y, canvas.width/3, canvas.height/3)

      if (state.cells[i][j]) {
        let imgX = x + (canvas.width/3/2) - 50
        let imgY = y + (canvas.height/3/2) - 50
        let img = imgs[state.cells[i][j]]
        context.drawImage(img, imgX, imgY, 100, 100)
      }

      x += canvas.width/3
    }

    x = 0
    y += canvas.height/3
  }
}

function onClick(ev) {
  if (ev.which === 1) { // LEFT CLICK
    if (state.endGame) {
      init()
    } else {
      const gridX = Math.floor(ev.offsetX / Math.floor(canvas.width/3))
      const gridY = Math.floor(ev.offsetY / Math.floor(canvas.height/3))
      
      if (!state.cells[gridY][gridX]) {
        clickSound.play()
        state.cells[gridY][gridX] = state.p1Turn ? 'X' : 'O'
        state.moves++
        turn()
      } else {
        errorSound.play()
        alert('Rect already choosen')
      }
    }
  }
}

function drawEnd() {
  const char = state.p1Turn ? 'X' : 'O'
  context.fillStyle = "rgba(0, 0, 0, 0.8)"
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = "#FFF"
  context.font = 'normal 30px courier'

  if (state.draw) {
    context.fillText(`Draw!`, canvas.width /2 , canvas.height /2)
  } else {
    context.fillText(`${char} Wins!`, canvas.width /2 , canvas.height /2)
  }
}

function gameEnds() {
  const char = state.p1Turn ? 'X' : 'O'

  // Check Rows
  if 
  (
    (state.cells[0][0] === char &&  state.cells[0][1] === char && state.cells[0][2] === char)
    ||
    (state.cells[1][0] === char &&  state.cells[1][1] === char && state.cells[1][2] === char)
    ||
    (state.cells[2][0] === char &&  state.cells[2][1] === char && state.cells[2][2] === char)
  ) {
    state.endGame = true
  }
  // Check Columns
  else if
  (
    (state.cells[0][0] === char &&  state.cells[1][0] === char && state.cells[2][0] === char)
    ||
    (state.cells[0][1] === char &&  state.cells[1][1] === char && state.cells[2][1] === char)
    ||
    (state.cells[0][2] === char &&  state.cells[1][2] === char && state.cells[2][2] === char)
  ) {
    state.endGame = true
  }
  //Check Diagonals
  else if
  (
    (state.cells[0][0] === char &&  state.cells[1][1] === char && state.cells[2][2] === char)
    ||
    (state.cells[2][0] === char &&  state.cells[1][1] === char && state.cells[0][2] === char)
  ) {
    state.endGame = true
  }
  // Check for draw
  else if (state.moves === 9 && !state.endGame) {
    state.draw = true
    state.endGame = true
  }

  return state.endGame
}

function turn() {

  if (!gameEnds()) {
    state.p1Turn = !state.p1Turn
    drawBoard()
  } else {
    if (state.draw) {
      drawSound.play()
    } else {
      winSound.play()
    }
    drawBoard()
    drawEnd()
  }

}







