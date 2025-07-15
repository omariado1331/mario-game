export function checkControls ({ mario, keys }) {
  const isMarioTouchingFloor = mario.body.touching.down
  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown

  if (mario.isDead) {
    return
  }

  if (isLeftKeyDown) {
    mario.x -= 2
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.flipX = true
  } else if (isRightKeyDown) {
    mario.x += 2
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.flipX = false
  } else if (isMarioTouchingFloor) {
    mario.anims.play('mario-idle', true)
  }

  if (isUpKeyDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300)
    mario.anims.play('mario-jump', true)
  }
}
