import { Application } from "pixi.js";
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
    fixedFireworkPosition?: {
        x: number;
        y: number;
    }[];
    firstExplosionTimeTargetY?: {
        min: number;
        max: number;
    };
    fireworkSpeedRange: {
        min: number;
        max: number;
    };
    firstExplosionParticleSizeRange: {
        min: number;
        max: number;
    };
    secondExplosionParticleSizeRange: {
        min: number;
        max: number;
    };
    firstExplosionParticleColorPalette: number[];
    secondExplosionParticleColorPalette: number[];
    fireworkDotSize: number;
    fireworkDotColor: number;
    trailTransparency: number;
    maxTrailLength: number;
    gravity: number;
}
export declare const initScene: (container: HTMLElement, config: SceneConfig) => Promise<{
    cleanup: () => void;
    app: Application<import("pixi.js").Renderer>;
}>;
