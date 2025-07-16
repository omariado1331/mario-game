import { createAnimations } from './animations.js'
import { initAudio, playAudio } from './audio.js'
import { checkControls } from './controls.js'
import { initSpritesheet } from './spritesheet.js'

const config = {
  // eslint-disable-next-line no-undef
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: {
    preload, // se ejecuta para precargar los recuros
    create, // se ejecuta cuando el juego empieza
    update // se ejecuta cuando las acciones cambian
  }
}

// eslint-disable-next-line no-undef, no-unused-vars
const game = new Phaser.Game(config)

function preload () { // 1
  // this es el juego que se esta construyendo
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png')

  // carga del piso
  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )
  // spritesheet de monedas mario y goomba
  initSpritesheet(this)
  // audio
  initAudio(this)
}

function create () { // 2
  createAnimations(this)

  this.add.image(0, 0, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)

  // carga del personaje mario aplicando gravedad MARIO
  this.mario = this.physics.add.sprite(50, 54, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300)

  // creando los enemigos
  this.enemy = this.physics.add.sprite(120, config.height - 32, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50)

  // piso que tenga cuerpo donde pueda colisionar mario
  this.floor = this.physics.add.staticGroup()

  this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()

  this.floor
    .create(160, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()

  // se añade sprite del suelo
  this.add.tileSprite(0, config.height - 16, 64, 32, 'floorbricks')
    .setOrigin(0, 0)

  this.add.tileSprite(160, config.height - 16, 64, 32, 'floorbricks')
    .setOrigin(0, 0)

  // grupo de monedas coins
  this.coins = this.physics.add.staticGroup()
  this.coins.create(150, 150, 'coin').anims.play('coin-idle', true)
  this.coins.create(300, 150, 'coin').anims.play('coin-idle', true)

  // configurar cuando mario choque con la moneda pero que no colisiones
  this.physics.add.overlap(this.mario, this.coins, collectCoin, null, this)

  // establecer los limites del escenario
  this.physics.world.setBounds(0, 0, 2000, config.height)

  // configurar la colision del PISO con los demás elementos
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.enemy, this.floor)
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)

  // configuracion de camara
  this.cameras.main.setBounds(0, 0, 2000, config.height)
  // hacer que la camara siga a mario
  this.cameras.main.startFollow(this.mario)

  this.enemy.anims.play('goomba-walk', true)

  this.keys = this.input.keyboard.createCursorKeys()
}

function collectCoin (mario, coin) {
  coin.disableBody(true, true)
  playAudio('coin-pickup', this, { volume: 0.1 })
  const scoreText = this.add.text(
    coin.x,
    coin.y,
    100,
    {
      fontFamily: 'pixel',
      fontSize: config.width / 40
    }
  )

  this.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: () => {
      this.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy()
        }
      })
    }
  })
}

function onHitEnemy (mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play('goomba-hurt', true)
    enemy.setVelocityX(0)
    playAudio('goomba-stomp', this)
    setTimeout(() => {
      enemy.destroy()
    }, 400)
    mario.setVelocityY(-200)
  } else {
    killMario(this)
  }
}

function update () { // 3 funcion se ejecuta en cada frame
  checkControls(this)
  const { mario } = this
  if (mario.y >= config.height) {
    killMario(this)
  }
}

function killMario (game) {
  const { mario, scene } = game
  if (mario.isDead) return
  mario.isDead = true
  mario.anims.play('mario-death')
  mario.setCollideWorldBounds(false)
  playAudio('gameover', game, { volume: 0.2 })
  mario.body.checkCollision.none = true
  setTimeout(() => {
    mario.setVelocityY(-350)
    mario.setVelocityX(0)
  }, 10)

  setTimeout(() => {
    scene.restart()
  }, 2000)
}
