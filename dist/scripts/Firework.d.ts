import { Application, Graphics } from "pixi.js";
import { FirstFireworkEffect } from "./FirstFireworkEffect";
import { SecondExplosionParticle } from "./SecondExplosionParticle";
type OnExplodeCallback = () => void;
export declare class Firework {
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
    private secondaryExplosionDelay;
    private firstExplosionParticleCount;
    private secondExplosionParticleCount;
    private firstExplosionTargetY;
    private firstExplosionParticleSizeRange;
    private secondExplosionParticleSizeRange;
    private firstExplosionParticleColorPalette;
    private secondExplosionParticleColorPalette;
    private fireworkDotSize;
    private fireworkDotColor;
    private trailTransparency;
    private maxTrailLength;
    private gravity;
    firstExplosionTime?: number;
    constructor(app: Application, onExplodeCallback?: OnExplodeCallback, secondaryExplosionDelay?: number, firstExplosionParticleCount?: number, secondExplosionParticleCount?: number, fixedFireworkPosition?: {
        x: number;
        y: number;
    }, firstExplosionTimeTargetY?: {
        min: number;
        max: number;
    }, fireworkSpeedRange?: {
        min: number;
        max: number;
    }, firstExplosionParticleSizeRange?: {
        min: number;
        max: number;
    }, secondExplosionParticleSizeRange?: {
        min: number;
        max: number;
    }, firstExplosionParticleColorPalette?: number[], secondExplosionParticleColorPalette?: number[], fireworkDotSize?: number, fireworkDotColor?: number, trailTransparency?: number, maxTrailLength?: number, gravity?: number);
    launch(): void;
    update(): void;
    explode(): void;
    triggerSecondExplosion(): void;
    destroy(): void;
}
export {};
