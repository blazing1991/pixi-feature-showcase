import {Assets, Sprite, Texture} from "pixi.js";
import {ASSETS} from "../config/assets";

export class LazyLoadedSprite extends Sprite {

    constructor(
        protected spriteId: string,
        protected url: string,
        protected placeholderSpriteId: string = ASSETS.IMAGE_PLACEHOLDER
    ) {
        const placeholderTexture = Assets.get(placeholderSpriteId) || Texture.EMPTY;

        super(placeholderTexture);

        if (url !== "") {
            this.loadRealTexture();
        }
    }

    protected loadRealTexture(): void {
        // Already loaded?
        const cached = Assets.get(this.spriteId);
        if (cached && cached instanceof Texture) {
            this.texture = cached;
            return;
        }

        // Register asset if not yet registered
        if (!Assets.get(this.spriteId)) {
            Assets.add(this.spriteId, [{
                src: this.url,
                loadParser: "loadTextures"
            }]);
        }

        // Start async load
        Assets.load(this.spriteId)
            .then((texture) => {
                // Only swap if sprite still alive
                if (!this.destroyed && texture) {
                    this.texture = texture as Texture;
                }
            })
            .catch(() => {
                // Swap to missing texture if load fails
                this.texture = Assets.get(ASSETS.IMAGE_MISSING) || Texture.EMPTY;
                console.warn(`Failed to load texture for ${this.spriteId} from ${this.url}`);
            });
    }
}