export const createAnimations = (game) => {
  // animaciones mario caminando
  game.anims.create({
    key: 'mario-walk',
    frames: game.anims.generateFrameNumbers(
      'mario',
      { start: 3, end: 2 }
    ),
    frameRate: 12,
    repeat: -1
  })

  // animacion mario quieto
  game.anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }]
  })

  // animacion mario saltando
  game.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }]
  })

  // animacion de mario cuando pierde el juego
  game.anims.create({
    key: 'mario-death',
    frames: [{ key: 'mario', frame: 4 }]
  })

  // animacion cuando goomba se mueve
  game.anims.create({
    key: 'goomba-walk',
    frames: game.anims.generateFrameNumbers(
      'goomba',
      { start: 0, end: 1 }
    ),
    frameRate: 12,
    repeat: -1
  })

  // animacion cuando goomba muere
  game.anims.create({
    key: 'goomba-hurt',
    frames: [{ key: 'goomba', frame: 2 }]
  })

  // animacion de la moneda
  game.anims.create({
    key: 'coin-idle',
    frames: game.anims.generateFrameNumbers(
      'coin',
      { start: 0, end: 3 }
    ),
    frameRate: 6,
    repeat: -1
  })
}
