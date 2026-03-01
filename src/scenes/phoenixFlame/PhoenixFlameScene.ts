import {BLEND_MODES, Sprite} from "pixi.js";
import {ASSETS} from "../../config/assets";
import {BaseScene} from "../../core/BaseScene";
import type {Dimensions} from "../../config/types";
import {FLAME_EMITTER_CONFIG} from "./flameEmitterConfig";
import {ParticleSystem} from "./ParticleSystem";


export class PhoenixFlameScene extends BaseScene {
    protected flameParticles?: ParticleSystem;

    constructor() {
        super();
    }

    public async init() {
        this.createBackground();
        this.createParticles();
        this.createForeground();
    }

    public updateLayout(dimensions: Dimensions): void {
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        this.position.set(centerX, centerY);
        this.flameParticles?.position.set(20, -150);
    }

    public destroyScene(): void {
        this.destroy({children: true});
        this.flameParticles?.destroy({children: true});
    }

    protected createBackground(): void {
        const campfire = Sprite.from(ASSETS.CAMPFIRE);
        campfire.anchor.set(0.5);

        this.addChild(campfire);
    }

    protected createParticles(): void {
        const flameParticles = this.flameParticles = new ParticleSystem(ASSETS.FIRE_PARTICLE, FLAME_EMITTER_CONFIG);
        flameParticles.blendMode = BLEND_MODES.ADD;
        flameParticles.start();

        this.addChild(flameParticles);
    }

    protected createForeground(): void {
        const logs = Sprite.from(ASSETS.LOGS);
        logs.anchor.set(0.45, 0.7);

        this.addChild(logs);
    }
}