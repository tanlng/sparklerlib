// src/scripts/Firework.ts
import { Application, Graphics } from "pixi.js";
import { FirstFireworkEffect } from "./FirstFireworkEffect";
import { FirstExplosionParticle } from "./FirstExplosionParticle";
import { SecondExplosionParticle } from "./SecondExplosionParticle";

type OnExplodeCallback = () => void;

export class Firework {
  app: Application;
  x: number;
  y: number;
  targetY?: number;
  speed: number;
  color?: number;
  firstFireworkEffect: FirstFireworkEffect;
  secondExplosionParticles: SecondExplosionParticle[];
  launched: boolean;
  exploded: boolean;
  fireworkDot: Graphics;
  onExplodeCallback?: OnExplodeCallback;
  private secondaryExplosionDelay: number;
  private firstExplosionParticleCount: number;
  private secondExplosionParticleCount: number;
  private firstExplosionTargetY: number;
  private firstExplosionParticleSizeRange: { min: number; max: number };
  private secondExplosionParticleSizeRange: { min: number; max: number };
  private firstExplosionParticleColorPalette: number[];
  private secondExplosionParticleColorPalette: number[];
  private fireworkDotSize: number;
  private fireworkDotColor: number;
  private trailTransparency: number;
  private maxTrailLength: number;
  private gravity: number;
  firstExplosionTime?: number;

  constructor(
    app: Application,
    onExplodeCallback?: OnExplodeCallback,
    secondaryExplosionDelay = 1000,
    firstExplosionParticleCount = 150,
    secondExplosionParticleCount = 30,
    fixedFireworkPosition?: { x: number; y: number },
    firstExplosionTimeTargetY?: { min: number; max: number },
    fireworkSpeedRange: { min: number; max: number } = { min: 5, max: 10 },
    firstExplosionParticleSizeRange: { min: number; max: number } = {
      min: 1,
      max: 3,
    },
    secondExplosionParticleSizeRange: { min: number; max: number } = {
      min: 0.5,
      max: 1.5,
    },
    firstExplosionParticleColorPalette: number[] = [
      0xff0000, 0x00ff00, 0x0000ff,
    ],
    secondExplosionParticleColorPalette: number[] = [
      0xffff00, 0xff00ff, 0x00ffff,
    ],
    fireworkDotSize: number = 3,
    fireworkDotColor: number = 0xffffff,
    trailTransparency: number = 0.2,
    maxTrailLength: number = 3,
    gravity: number = 0.1
  ) {
    this.app = app;
    if (fixedFireworkPosition) {
      this.x = fixedFireworkPosition.x;
      this.y = fixedFireworkPosition.y;
    } else {
      this.x = Math.random() * app.screen.width;
      this.y = app.screen.height;
    }
    if (firstExplosionTimeTargetY) {
      this.firstExplosionTargetY =
        Math.random() *
          (firstExplosionTimeTargetY.max - firstExplosionTimeTargetY.min) +
        firstExplosionTimeTargetY.min;
    } else {
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
    this.firstFireworkEffect = new FirstFireworkEffect(
      app,
      this.firstExplosionParticleColorPalette,
      firstExplosionParticleCount,
      firstExplosionParticleSizeRange,
      trailTransparency,
      maxTrailLength,
      gravity
    );
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
      if (
        this.firstExplosionTime &&
        currentTime - this.firstExplosionTime >= this.secondaryExplosionDelay
      ) {
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

      if (
        this.firstFireworkEffect.particles.length === 0 &&
        this.secondExplosionParticles.length === 0
      ) {
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
        const randomColor =
          this.secondExplosionParticleColorPalette[
            Math.floor(
              Math.random() * this.secondExplosionParticleColorPalette.length
            )
          ];
        const size =
          Math.random() *
            (this.secondExplosionParticleSizeRange.max -
              this.secondExplosionParticleSizeRange.min) +
          this.secondExplosionParticleSizeRange.min;
        const subParticle = new SecondExplosionParticle(
          particle.x,
          particle.y,
          randomColor,
          scale,
          this.app,
          this.trailTransparency,
          this.maxTrailLength,
          this.gravity,
          size
        );
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
