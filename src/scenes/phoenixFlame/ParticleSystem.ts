import type {EmitterConfigV3} from "@pixi/particle-emitter";
import * as particles from '@pixi/particle-emitter';
import type {IDestroyOptions} from "pixi.js";
import {ParticleContainer, Texture, Ticker} from "pixi.js";

export class ParticleSystem extends ParticleContainer {
    public emitter: particles.Emitter;

    constructor(textureName: string, config: EmitterConfigV3) {
        super();
        const configWithTexture = this.injectTextureIntoConfig(config, textureName);
        // @ts-expect-error Pixi messed up it's own Container types
        this.emitter = new particles.Emitter(this, configWithTexture);
        this.eventMode = "none";

        Ticker.shared.add(this.update, this);
    }

    public destroy(options?: IDestroyOptions) {
        super.destroy(options);
        this.stop();
        Ticker.shared.remove(this.update, this);
    }

    public update(deltaTime: number) {
        this.emitter.update(deltaTime / 60);
    }

    public start() {
        this.emitter.emit = true;
    }

    public stop() {
        this.emitter.emit = false;
    }

    protected injectTextureIntoConfig(config: EmitterConfigV3, textureName: string): EmitterConfigV3 {
        const texture = Texture.from(textureName);
        const newConfig = {...config};
        newConfig.behaviors.forEach(behavior => {
            if (behavior.type === "textureSingle") {
                behavior.config.texture = texture;
            }
        });
        return newConfig;
    }
}