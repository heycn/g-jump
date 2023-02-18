const canvas = document.getElementById('game-canvas')
let platFormGap = 0
let score = 0
let highScore = 0

class Doodler {
  constructor() {
    this.context = canvas.getContext('2d')
    this.x = canvas.width / 2
    this.y = canvas.height - 200
    this.image = new Image()
    this.image.src = 'assets/doodler-right.png'
    this.prevY = this.y
    this.width = 50
    this.height = 50
    this.vx = 0
    this.vy = 0
    this.gravity = 0.05
    this.jumpStrength = -3.5
  }

  updatePosition() {
    this.prevY = this.y
    this.x += this.vx
    this.y += this.vy
    this.vy > 3.5 ? (this.vy = 3.5) : (this.vy += this.gravity)

    this.checkForWrapDoodler()
    this.checkCollisionWithPlatforms()
  }

  checkForWrapDoodler() {
    if (this.x + this.width < 0) {
      this.x = canvas.width
    } else if (this.x > canvas.width) {
      this.x = 0 - this.width
    }
  }

  checkCollisionWithPlatforms() {
    if (this.vy <= 0) {
      return
    }

    for (let i = 0; i < platForms.length; i++) {
      let platform = platForms[i]
      if (this.prevY + this.height + 20 >= platform.y && this.x + this.width > platform.x && this.x < platform.x + platform.width && this.y + this.height > platform.y && this.y < platform.y + platform.height && this.prevY < platform.y) {
        this.jump(platform)
      }
    }
  }

  jump(platform) {
    let newHeight = platform.y - this.height
    if (newHeight > canvas.height / 2 - 120) {
      this.y = platform.y - this.height
      this.vy = this.jumpStrength
    }
  }

  moveRight() {
    this.vx += 4
    this.image.src = 'assets/doodler-right.png'
  }

  moveLeft() {
    this.vx -= 4
    this.image.src = 'assets/doodler-left.png'
  }

  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

class Platform {
  constructor(x, y) {
    this.context = canvas.getContext('2d')
    this.image = new Image()
    this.image.src = 'assets/platform.png'
    this.x = x
    this.y = y
    this.width = 100
    this.height = 20
  }

  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

let platForms = []
const doodler = new Doodler()

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function showEndMenu() {
  document.getElementById('end-game-menu').style.display = 'block'
  document.getElementById('end-game-score').innerHTML = score

  if (highScore < score) {
    highScore = score
  }

  document.getElementById('high-score').innerHTML = highScore
}

function hideEndMenu() {
  document.getElementById('end-game-menu').style.display = 'none'
}

function addListeners() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      doodler.moveRight()
    } else if (e.key === 'ArrowLeft') {
      doodler.moveLeft()
    }
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      doodler.vx = 0
    }
  })

  document.getElementById('retry').addEventListener('click', function () {
    hideEndMenu()
    resetGame()
    loop()
  })
}

function createPlatforms(platFormCount) {
  platFormGap = Math.round(canvas.height / platFormCount)
  for (let i = 0; i < platFormCount; i++) {
    let xpos = 0
    do {
      xpos = randomInteger(25, canvas.width - 25 - 100)
    } while (
      xpos > canvas.width / 2 - 100 * 1.5 &&
      xpos < canvas.width / 2 + 100 / 2
    )
    let y = canvas.height / 1.5 - i * platFormGap
    platForms.push(new Platform(xpos, y))
  }
}

function setup() {
  platForms.push(new Platform(doodler.x, doodler.y + 80))
  createPlatforms(6)
}

function resetGame() {
  doodler.x = canvas.width / 2
  doodler.y = canvas.height - 100
  doodler.vx = 0
  doodler.vy = 0
  score = 0
  platForms = []
  setup()
}

function scoreText() {
  doodler.context.font = '20px Microsoft YaHei'
  doodler.context.fillStyle = 'black'
  doodler.context.textAlign = 'center'
  doodler.context.fillText(`分数：${Math.round(score)}`, canvas.width / 2, 50)
}

function updatePlatformsAndScore() {
  let platformsCpy = [...platForms]
  platForms = platForms.filter(p => p.y < canvas.height)
  score += platformsCpy.length - platForms.length
}

function loop() {
  doodler.context.clearRect(0, 0, canvas.width, canvas.height)

  if (doodler.y < canvas.height / 2 && doodler.vy < 0) {
    platForms.forEach(p => (p.y += -doodler.vy * 2))

    platForms.push(new Platform(randomInteger(25, canvas.width - 25 - 100), platForms[platForms.length - 1].y - platFormGap * 2))
  }

  doodler.draw()
  doodler.updatePosition()

  platForms.forEach(platform => {
    platform.draw()
  })

  scoreText()
  if (doodler.y > canvas.height) {
    showEndMenu()
    return
  }

  updatePlatformsAndScore()

  requestAnimationFrame(loop)
}

addListeners()
setup()
loop()
