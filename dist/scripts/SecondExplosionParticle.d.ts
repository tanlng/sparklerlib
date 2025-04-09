import { Graphics, Application } from "pixi.js";
export declare class SecondExplosionParticle extends Graphics {
    vx: number;
    vy: number;
    lifetime: number;
    private app;
    private trail;
    private trailTransparency;
    private maxTrailLength;
    private gravity;
    constructor(x: number, y: number, color: number, scale: number, app: Application, trailTransparency: number | undefined, maxTrailLength: number | undefined, gravity: number | undefined, size: number);
    update(): void;
    destroyTrail(): void;
}
