// src/scripts/scene.ts
import { Application, Text, TextStyle } from "pixi.js";
import { Firework } from "./Firework";

export interface SceneConfig {
  width: number;
  height: number;
  backgroundColor: number;
  fireworkRange: {
    min: number;
    max: number;
  };
  interval: number;
  secondaryExplosionDelay: number;
  firstExplosionParticleCount: number;
  secondExplosionParticleCount: number;
  fixedFireworkPosition?: { x: number; y: number }[];
  firstExplosionTimeTargetY?: { min: number; max: number };
  fireworkSpeedRange: { min: number; max: number };
  firstExplosionParticleSizeRange: { min: number; max: number };
  secondExplosionParticleSizeRange: { min: number; max: number };
  firstExplosionParticleColorPalette: number[];
  secondExplosionParticleColorPalette: number[];
  fireworkDotSize: number;
  fireworkDotColor: number;
  trailTransparency: number;
  maxTrailLength: number;
  gravity: number;
}

export const initScene = async (
  container: HTMLElement,
  config: SceneConfig
) => {
  var app = new Application();
  await app.init({
    width: config.width,
    height: config.height,
    backgroundColor: config.backgroundColor,
  });
  container.appendChild(app.canvas);

  const fireworks: Firework[] = [];
  let activeFireworks = 0;
  let explosionCenters: { x: number; y: number }[] = [];
  let firstFireworkExploded = false;
  let firstBatchParticles: any[] = [];

  const createFirework = () => {
    if (config.fixedFireworkPosition) {
      activeFireworks = config.fixedFireworkPosition.length;
      for (let i = 0; i < config.fixedFireworkPosition.length; i++) {
        const position = config.fixedFireworkPosition[i];
        const firework = new Firework(
          app,
          () => {
            const explosionX =
              firework.firstFireworkEffect.particles.length > 0
                ? firework.firstFireworkEffect.particles[0].x
                : firework.fireworkDot.x;
            const explosionY =
              firework.firstFireworkEffect.particles.length > 0
                ? firework.firstFireworkEffect.particles[0].y
                : firework.fireworkDot.y;
            explosionCenters.push({ x: explosionX, y: explosionY });
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
          },
          config.secondaryExplosionDelay,
          config.firstExplosionParticleCount,
          config.secondExplosionParticleCount,
          position,
          config.firstExplosionTimeTargetY,
          config.fireworkSpeedRange,
          config.firstExplosionParticleSizeRange,
          config.secondExplosionParticleSizeRange,
          config.firstExplosionParticleColorPalette,
          config.secondExplosionParticleColorPalette,
          config.fireworkDotSize,
          config.fireworkDotColor,
          config.trailTransparency,
          config.maxTrailLength,
          config.gravity
        );
        firework.launch();
        fireworks.push(firework);
      }
    } else {
      const numFireworks =
        Math.floor(
          Math.random() *
            (config.fireworkRange.max - config.fireworkRange.min + 1)
        ) + config.fireworkRange.min;
      activeFireworks = numFireworks;
      for (let i = 0; i < numFireworks; i++) {
        const firework = new Firework(
          app,
          () => {
            const explosionX =
              firework.firstFireworkEffect.particles.length > 0
                ? firework.firstFireworkEffect.particles[0].x
                : firework.fireworkDot.x;
            const explosionY =
              firework.firstFireworkEffect.particles.length > 0
                ? firework.firstFireworkEffect.particles[0].y
                : firework.fireworkDot.y;
            explosionCenters.push({ x: explosionX, y: explosionY });
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
          },
          config.secondaryExplosionDelay,
          config.firstExplosionParticleCount,
          config.secondExplosionParticleCount,
          undefined,
          config.firstExplosionTimeTargetY,
          config.fireworkSpeedRange,
          config.firstExplosionParticleSizeRange,
          config.secondExplosionParticleSizeRange,
          config.firstExplosionParticleColorPalette,
          config.secondExplosionParticleColorPalette,
          config.fireworkDotSize,
          config.fireworkDotColor,
          config.trailTransparency,
          config.maxTrailLength,
          config.gravity
        );
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
