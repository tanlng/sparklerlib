// src/scripts/SecondExplosionParticle.ts
import { Graphics, Application } from "pixi.js";

export class SecondExplosionParticle extends Graphics {
  public vx: number;
  public vy: number;
  public lifetime: number;
  private app: Application;
  private trail: Graphics[] = [];
  private trailTransparency: number;
  private maxTrailLength: number;
  private gravity: number;

  constructor(
    x: number,
    y: number,
    color: number,
    scale: number,
    app: Application,
    trailTransparency = 0.2,
    maxTrailLength = 3,
    gravity = 0.1,
    size: number
  ) {
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
