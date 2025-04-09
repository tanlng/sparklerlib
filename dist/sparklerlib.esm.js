import { Graphics, Application } from 'pixi.js';

// src/scripts/FirstExplosionParticle.ts
class FirstExplosionParticle extends Graphics {
    vx;
    vy;
    lifetime;
    app;
    trail = [];
    trailTransparency;
    maxTrailLength;
    gravity;
    constructor(x, y, color, scale, app, trailTransparency = 0.2, maxTrailLength = 3, gravity = 0.1, size) {
        super();
        this.app = app;
        this.trailTransparency = trailTransparency;
        this.maxTrailLength = maxTrailLength;
        this.gravity = gravity;
        this.beginFill(color);
        this.drawCircle(0, 0, size);
        this.endFill();
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5;
        this.vx = Math.cos(angle) * speed * scale;
        this.vy = Math.sin(angle) * speed * scale;
        this.alpha = 1;
        this.lifetime = Math.random() * 100 + 20;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 1 / this.lifetime;
        const trailParticle = new Graphics();
        trailParticle.beginFill(this.tint, this.trailTransparency);
        trailParticle.drawCircle(0, 0, this.width / 2);
        trailParticle.endFill();
        trailParticle.x = this.x;
        trailParticle.y = this.y;
        trailParticle.alpha = this.alpha * 0.6;
        this.app.stage.addChild(trailParticle);
        this.trail.push(trailParticle);
        if (this.trail.length > this.maxTrailLength) {
            const oldTrail = this.trail.shift();
            if (oldTrail) {
                this.app.stage.removeChild(oldTrail);
                oldTrail.destroy();
            }
        }
        if (this.alpha <= 0) {
            this.destroyTrail();
            this.destroy();
        }
    }
    destroyTrail() {
        this.trail.forEach(trailParticle => {
            if (trailParticle) {
                this.app.stage.removeChild(trailParticle);
                trailParticle.destroy();
            }
        });
        this.trail = [];
    }
}

class FirstFireworkEffect {
    app;
    particles;
    colorPalette;
    particleCount;
    particleSizeRange;
    trailTransparency;
    maxTrailLength;
    gravity;
    constructor(app, colorPalette, particleCount, particleSizeRange, trailTransparency, maxTrailLength, gravity) {
        this.app = app;
        this.particles = [];
        this.colorPalette = colorPalette;
        this.particleCount = particleCount;
        this.particleSizeRange = particleSizeRange;
        this.trailTransparency = trailTransparency;
        this.maxTrailLength = maxTrailLength;
        this.gravity = gravity;
    }
    explode(x, y) {
        for (let i = 0; i < this.particleCount; i++) {
            const randomColor = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
            const size = Math.random() *
                (this.particleSizeRange.max - this.particleSizeRange.min) +
                this.particleSizeRange.min;
            const particle = new FirstExplosionParticle(x, y, randomColor, 1, this.app, this.trailTransparency, this.maxTrailLength, this.gravity, size);
            this.app.stage.addChild(particle);
            this.particles.push(particle);
        }
    }
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            if (particle.alpha <= 0) {
                this.app.stage.removeChild(particle);
                this.particles.splice(i, 1);
            }
        }
    }
    destroy() {
        this.particles.forEach(particle => {
            particle.destroyTrail();
            this.app.stage.removeChild(particle);
            particle.destroy();
        });
        this.particles = [];
    }
}

// src/scripts/SecondExplosionParticle.ts
class SecondExplosionParticle extends Graphics {
    vx;
    vy;
    lifetime;
    app;
    trail = [];
    trailTransparency;
    maxTrailLength;
    gravity;
    constructor(x, y, color, scale, app, trailTransparency = 0.2, maxTrailLength = 3, gravity = 0.1, size) {
        super();
        this.app = app;
        this.trailTransparency = trailTransparency;
        this.maxTrailLength = maxTrailLength;
        this.gravity = gravity;
        this.beginFill(color);
        this.drawCircle(0, 0, size);
        this.endFill();
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5;
        this.vx = Math.cos(angle) * speed * scale;
        this.vy = Math.sin(angle) * speed * scale;
        this.alpha = 1;
        this.lifetime = Math.random() * 100 + 20;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 1 / this.lifetime;
        const trailParticle = new Graphics();
        trailParticle.beginFill(this.tint, this.trailTransparency);
        trailParticle.drawCircle(0, 0, this.width / 2);
        trailParticle.endFill();
        trailParticle.x = this.x;
        trailParticle.y = this.y;
        trailParticle.alpha = this.alpha * 0.6;
        this.app.stage.addChild(trailParticle);
        this.trail.push(trailParticle);
        if (this.trail.length > this.maxTrailLength) {
            const oldTrail = this.trail.shift();
            if (oldTrail) {
                this.app.stage.removeChild(oldTrail);
                oldTrail.destroy();
            }
        }
        if (this.alpha <= 0) {
            this.destroyTrail();
            this.destroy();
        }
    }
    destroyTrail() {
        this.trail.forEach(trailParticle => {
            if (trailParticle) {
                this.app.stage.removeChild(trailParticle);
                trailParticle.destroy();
            }
        });
        this.trail = [];
    }
}

// src/scripts/Firework.ts
class Firework {
    app;
    x;
    y;
    targetY;
    speed;
    color;
    firstFireworkEffect;
    secondExplosionParticles;
    launched;
    exploded;
    fireworkDot;
    onExplodeCallback;
    secondaryExplosionDelay;
    firstExplosionParticleCount;
    secondExplosionParticleCount;
    firstExplosionTargetY;
    firstExplosionParticleSizeRange;
    secondExplosionParticleSizeRange;
    firstExplosionParticleColorPalette;
    secondExplosionParticleColorPalette;
    fireworkDotSize;
    fireworkDotColor;
    trailTransparency;
    maxTrailLength;
    gravity;
    firstExplosionTime;
    constructor(app, onExplodeCallback, secondaryExplosionDelay = 1000, firstExplosionParticleCount = 150, secondExplosionParticleCount = 30, fixedFireworkPosition, firstExplosionTimeTargetY, fireworkSpeedRange = { min: 5, max: 10 }, firstExplosionParticleSizeRange = {
        min: 1,
        max: 3,
    }, secondExplosionParticleSizeRange = {
        min: 0.5,
        max: 1.5,
    }, firstExplosionParticleColorPalette = [
        0xff0000, 0x00ff00, 0x0000ff,
    ], secondExplosionParticleColorPalette = [
        0xffff00, 0xff00ff, 0x00ffff,
    ], fireworkDotSize = 3, fireworkDotColor = 0xffffff, trailTransparency = 0.2, maxTrailLength = 3, gravity = 0.1) {
        this.app = app;
        if (fixedFireworkPosition) {
            this.x = fixedFireworkPosition.x;
            this.y = fixedFireworkPosition.y;
        }
        else {
            this.x = Math.random() * app.screen.width;
            this.y = app.screen.height;
        }
        if (firstExplosionTimeTargetY) {
            this.firstExplosionTargetY =
                Math.random() *
                    (firstExplosionTimeTargetY.max - firstExplosionTimeTargetY.min) +
                    firstExplosionTimeTargetY.min;
        }
        else {
            this.firstExplosionTargetY = Math.random() * app.screen.height * 0.5;
        }
        this.speed =
            Math.random() * (fireworkSpeedRange.max - fireworkSpeedRange.min) +
                fireworkSpeedRange.min;
        this.firstExplosionParticleCount = firstExplosionParticleCount;
        this.secondExplosionParticleCount = secondExplosionParticleCount;
        this.firstExplosionParticleSizeRange = firstExplosionParticleSizeRange;
        this.secondExplosionParticleSizeRange = secondExplosionParticleSizeRange;
        this.firstExplosionParticleColorPalette =
            firstExplosionParticleColorPalette;
        this.secondExplosionParticleColorPalette =
            secondExplosionParticleColorPalette;
        this.fireworkDotSize = fireworkDotSize;
        this.fireworkDotColor = fireworkDotColor;
        this.trailTransparency = trailTransparency;
        this.maxTrailLength = maxTrailLength;
        this.gravity = gravity;
        this.firstFireworkEffect = new FirstFireworkEffect(app, this.firstExplosionParticleColorPalette, firstExplosionParticleCount, firstExplosionParticleSizeRange, trailTransparency, maxTrailLength, gravity);
        this.secondExplosionParticles = [];
        this.launched = false;
        this.exploded = false;
        this.fireworkDot = new Graphics();
        this.fireworkDot.beginFill(this.fireworkDotColor);
        this.fireworkDot.drawCircle(0, 0, this.fireworkDotSize);
        this.fireworkDot.endFill();
        this.fireworkDot.x = this.x;
        this.fireworkDot.y = this.y;
        app.stage.addChild(this.fireworkDot);
        this.onExplodeCallback = onExplodeCallback;
        this.secondaryExplosionDelay = secondaryExplosionDelay;
    }
    launch() {
        this.launched = true;
    }
    update() {
        if (this.launched && !this.exploded) {
            this.fireworkDot.y -= this.speed;
            if (this.fireworkDot.y <= this.firstExplosionTargetY) {
                this.explode();
            }
        }
        if (this.exploded) {
            this.firstFireworkEffect.update();
            const currentTime = performance.now();
            if (this.firstExplosionTime &&
                currentTime - this.firstExplosionTime >= this.secondaryExplosionDelay) {
                if (this.firstFireworkEffect.particles.length > 0) {
                    this.triggerSecondExplosion();
                }
            }
            for (let i = this.secondExplosionParticles.length - 1; i >= 0; i--) {
                const particle = this.secondExplosionParticles[i];
                particle.update();
                if (particle.alpha <= 0) {
                    this.app.stage.removeChild(particle);
                    this.secondExplosionParticles.splice(i, 1);
                }
            }
            if (this.firstFireworkEffect.particles.length === 0 &&
                this.secondExplosionParticles.length === 0) {
                this.destroy();
            }
        }
    }
    explode() {
        this.exploded = true;
        this.firstExplosionTime = performance.now();
        this.app.stage.removeChild(this.fireworkDot);
        this.firstFireworkEffect.explode(this.fireworkDot.x, this.fireworkDot.y);
        if (this.onExplodeCallback) {
            this.onExplodeCallback();
        }
    }
    triggerSecondExplosion() {
        for (const particle of this.firstFireworkEffect.particles) {
            particle.destroyTrail();
            const numSubParticles = this.secondExplosionParticleCount;
            const scale = 1;
            for (let i = 0; i < numSubParticles; i++) {
                const randomColor = this.secondExplosionParticleColorPalette[Math.floor(Math.random() * this.secondExplosionParticleColorPalette.length)];
                const size = Math.random() *
                    (this.secondExplosionParticleSizeRange.max -
                        this.secondExplosionParticleSizeRange.min) +
                    this.secondExplosionParticleSizeRange.min;
                const subParticle = new SecondExplosionParticle(particle.x, particle.y, randomColor, scale, this.app, this.trailTransparency, this.maxTrailLength, this.gravity, size);
                this.app.stage.addChild(subParticle);
                this.secondExplosionParticles.push(subParticle);
            }
            this.app.stage.removeChild(particle);
        }
        this.firstFireworkEffect.particles = [];
    }
    destroy() {
        this.firstFireworkEffect.destroy();
        this.secondExplosionParticles.forEach(particle => {
            particle.destroyTrail();
            this.app.stage.removeChild(particle);
            particle.destroy();
        });
        this.secondExplosionParticles = [];
    }
}

// src/scripts/scene.ts
const initScene = async (container, config) => {
    var app = new Application();
    await app.init({
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
    });
    container.appendChild(app.canvas);
    const fireworks = [];
    let firstFireworkExploded = false;
    let firstBatchParticles = [];
    const createFirework = () => {
        if (config.fixedFireworkPosition) {
            config.fixedFireworkPosition.length;
            for (let i = 0; i < config.fixedFireworkPosition.length; i++) {
                const position = config.fixedFireworkPosition[i];
                const firework = new Firework(app, () => {
                    firework.firstFireworkEffect.particles.length > 0
                        ? firework.firstFireworkEffect.particles[0].x
                        : firework.fireworkDot.x;
                    firework.firstFireworkEffect.particles.length > 0
                        ? firework.firstFireworkEffect.particles[0].y
                        : firework.fireworkDot.y;
                    // showTextAfterAllExplode();
                    if (!firstFireworkExploded) {
                        app.stage.removeChild(firework.fireworkDot);
                        firstFireworkExploded = true;
                    }
                    if (firstBatchParticles.length === 0) {
                        firstBatchParticles = [
                            ...firework.firstFireworkEffect.particles,
                            ...firework.secondExplosionParticles,
                        ];
                    }
                }, config.secondaryExplosionDelay, config.firstExplosionParticleCount, config.secondExplosionParticleCount, position, config.firstExplosionTimeTargetY, config.fireworkSpeedRange, config.firstExplosionParticleSizeRange, config.secondExplosionParticleSizeRange, config.firstExplosionParticleColorPalette, config.secondExplosionParticleColorPalette, config.fireworkDotSize, config.fireworkDotColor, config.trailTransparency, config.maxTrailLength, config.gravity);
                firework.launch();
                fireworks.push(firework);
            }
        }
        else {
            const numFireworks = Math.floor(Math.random() *
                (config.fireworkRange.max - config.fireworkRange.min + 1)) + config.fireworkRange.min;
            for (let i = 0; i < numFireworks; i++) {
                const firework = new Firework(app, () => {
                    firework.firstFireworkEffect.particles.length > 0
                        ? firework.firstFireworkEffect.particles[0].x
                        : firework.fireworkDot.x;
                    firework.firstFireworkEffect.particles.length > 0
                        ? firework.firstFireworkEffect.particles[0].y
                        : firework.fireworkDot.y;
                    // showTextAfterAllExplode();
                    if (!firstFireworkExploded) {
                        app.stage.removeChild(firework.fireworkDot);
                        firstFireworkExploded = true;
                    }
                    if (firstBatchParticles.length === 0) {
                        firstBatchParticles = [
                            ...firework.firstFireworkEffect.particles,
                            ...firework.secondExplosionParticles,
                        ];
                    }
                }, config.secondaryExplosionDelay, config.firstExplosionParticleCount, config.secondExplosionParticleCount, undefined, config.firstExplosionTimeTargetY, config.fireworkSpeedRange, config.firstExplosionParticleSizeRange, config.secondExplosionParticleSizeRange, config.firstExplosionParticleColorPalette, config.secondExplosionParticleColorPalette, config.fireworkDotSize, config.fireworkDotColor, config.trailTransparency, config.maxTrailLength, config.gravity);
                firework.launch();
                fireworks.push(firework);
            }
        }
    };
    createFirework();
    const intervalId = setInterval(() => {
        if (document.visibilityState === "visible") {
            createFirework();
        }
    }, config.interval);
    app.ticker.add(() => {
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            firework.update();
            const allParticles = [
                ...firework.firstFireworkEffect.particles,
                ...firework.secondExplosionParticles,
            ];
            if (firework.exploded && allParticles.length === 0) {
                firework.destroy();
                fireworks.splice(i, 1);
            }
        }
        if (firstBatchParticles.length > 0) {
            let allSecondaryExploded = true;
            for (const particle of firstBatchParticles) {
                if (particle.secondaryExploded === false) {
                    allSecondaryExploded = false;
                    break;
                }
            }
            if (allSecondaryExploded) {
                firstBatchParticles = [];
            }
        }
    });
    return {
        cleanup: () => {
            clearInterval(intervalId);
            fireworks.forEach(firework => {
                firework.destroy();
            });
        },
        app,
    };
};

export { initScene };
