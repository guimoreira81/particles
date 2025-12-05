game.start()
const GRAVITY_FORCE = 100
const PARTICLES_NUMBER = 100
const START_RANDOM_VELOCITY = 5
const FRICTION = 0.075
const PARTICLES_SIZE = 1
const TIME_SCALE = 5
const CLICK_FORCE = 150

for (let i=0; i<PARTICLES_NUMBER; i++){
    let particle = new Sprite("player", new Vector2(1, 1).mul(PARTICLES_SIZE), new Vector2(Math.random()*100-50, Math.random()*game.unitY*100-game.unitY*50))
    particle.velocity = new Vector2(Math.random()*100-50, Math.random()*100-50).unit().mul(START_RANDOM_VELOCITY)
    particle.image.src = "assets/images/p1.png"
}

let mouse = {
    worldPosition: new Vector2(0, 0),
    isDown: false
}

document.addEventListener("mousedown", event => {
    mouse.isDown = true
})

document.addEventListener("mousemove", event => {
    mouse.worldPosition = camera.cameraPositionToWorld(new Vector2(event.clientX, event.clientY))
})

document.addEventListener("mouseup", event => {
    mouse.isDown = false
})

function applyForce(distance, direction){
    return direction.div(distance).mul(GRAVITY_FORCE).div(PARTICLES_NUMBER)
}

let colorAttribute = {
    maxValue: 0,
    maxParticle: undefined,
}

game.updateFrame = (dt) => {
    for (const particle of game.world){
        let acceleration = new Vector2(0, 0)

        if (mouse.isDown){
            const mouseDistance = mouse.worldPosition.sub(particle.position).magnitude()
            const mouseDirection = mouse.worldPosition.sub(particle.position).unit()
            acceleration = acceleration.add(applyForce(mouseDistance, mouseDirection).mul(CLICK_FORCE))
        }

        for (const other of game.world){
            const direction = (other.position.sub(particle.position)).unit()
            const distance = (other.position.sub(particle.position)).magnitude()
            if (distance > 0){
                acceleration = acceleration.add(applyForce(distance, direction))
            }
        }
        
        if (particle.position.y-PARTICLES_SIZE <= -game.unitY*50){
            particle.position.y = -game.unitY*50+PARTICLES_SIZE
            particle.velocity.y = Math.abs(particle.velocity.y)
        }
        if (particle.position.y+PARTICLES_SIZE >= game.unitY*50){
            particle.position.y = game.unitY*50-PARTICLES_SIZE
            particle.velocity.y = Math.abs(particle.velocity.y)*(-1)
        }
        
        if (particle.position.x-PARTICLES_SIZE <= -50){
            particle.position.x = -50+PARTICLES_SIZE
            particle.velocity.x = Math.abs(particle.velocity.x)
        }
        if (particle.position.x+PARTICLES_SIZE >= 50){
            particle.position.x = 50-PARTICLES_SIZE
            particle.velocity.x = Math.abs(particle.velocity.x)*(-1)
        }

        
        if (!colorAttribute.maxParticle){
            colorAttribute.maxValue = particle.velocity.magnitude()
            colorAttribute.maxParticle = particle
        }
        if (particle.velocity.magnitude() > colorAttribute.maxValue){
            colorAttribute.maxValue = particle.velocity.magnitude()
            colorAttribute.maxParticle = particle
        }
        let name = Math.floor(particle.velocity.magnitude()/(colorAttribute.maxValue)*9)
        
        particle.image.src = `assets/images/p${name}.png`
        particle.velocity = particle.velocity.mul(1-FRICTION*dt*TIME_SCALE)
        particle.velocity = particle.velocity.add(acceleration.mul(dt*TIME_SCALE))
        particle.position = particle.position.add(particle.velocity.mul(dt*TIME_SCALE))
    }
    colorAttribute = {
        maxValue: 0,
        maxParticle: undefined,
    }
}