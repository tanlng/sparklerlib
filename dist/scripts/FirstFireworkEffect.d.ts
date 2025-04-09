import { Application } from "pixi.js";
import { FirstExplosionParticle } from "./FirstExplosionParticle";
export declare class FirstFireworkEffect {
    app: Application;
    particles: FirstExplosionParticle[];
    colorPalette: number[];
    particleCount: number;
    particleSizeRange: {
        min: number;
        max: number;
    };
    trailTransparency: number;
    maxTrailLength: number;
    gravity: number;
    constructor(app: Application, colorPalette: number[], particleCount: number, particleSizeRange: {
        min: number;
        max: number;
    }, trailTransparency: number, maxTrailLength: number, gravity: number);
    explode(x: number, y: number): void;
    update(): void;
    destroy(): void;
}
