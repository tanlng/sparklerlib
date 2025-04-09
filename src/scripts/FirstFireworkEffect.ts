// src/scripts/FirstFireworkEffect.ts
import { Application, Graphics } from "pixi.js";
import { FirstExplosionParticle } from "./FirstExplosionParticle";

export class FirstFireworkEffect {
  app: Application;
  particles: FirstExplosionParticle[];
  colorPalette: number[];
  particleCount: number;
  particleSizeRange: { min: number; max: number };
  trailTransparency: number;
  maxTrailLength: number;
  gravity: number;

  constructor(
    app: Application,
    colorPalette: number[],
    particleCount: number,
    particleSizeRange: { min: number; max: number },
    trailTransparency: number,
    maxTrailLength: number,
    gravity: number
  ) {
    this.app = app;
    this.particles = [];
    this.colorPalette = colorPalette;
    this.particleCount = particleCount;
    this.particleSizeRange = particleSizeRange;
    this.trailTransparency = trailTransparency;
    this.maxTrailLength = maxTrailLength;
    this.gravity = gravity;
  }

  explode(x: number, y: number) {
    for (let i = 0; i < this.particleCount; i++) {
      const randomColor =
        this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
      const size =
        Math.random() *
          (this.particleSizeRange.max - this.particleSizeRange.min) +
        this.particleSizeRange.min;
      const particle = new FirstExplosionParticle(
        x,
        y,
        randomColor,
        1,
        this.app,
        this.trailTransparency,
        this.maxTrailLength,
        this.gravity,
        size
      );
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
