import type {IDestroyOptions} from "pixi.js";
import {Container, Sprite, Text} from "pixi.js";
import {gsap} from "gsap";
import {ASSETS} from "../config/assets";

export class Button extends Container {
    protected background: Sprite;
    protected label: Text;

    protected hoverScale = 1.05;
    protected pressedScale = 0.95;

    constructor(text: string) {
        super();

        // Background sprite
        this.background = Sprite.from(ASSETS.BUTTON_BACKGROUND);
        this.background.anchor.set(0.5);

        // Label
        this.label = new Text(text, {
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 28,
            fontWeight: "600",
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 2,
            dropShadowDistance: 1,
        });

        this.label.anchor.set(0.5, 0.6);

        this.addChild(this.background, this.label);

        this.interactive = true;
        this.cursor = "pointer";

        this.setupInteractions();
    }

    private setupInteractions(): void {
        this.on("pointerover", this.onHover);
        this.on("pointerout", this.onOut);
        this.on("pointerdown", this.onDown);
        this.on("pointerup", this.onUp);
        this.on("pointerupoutside", this.onOut);
    }

    private onHover = (): void => {
        gsap.to(this.scale, {
            x: this.hoverScale,
            y: this.hoverScale,
            duration: 0.2,
            ease: "power2.out"
        });
    };

    private onOut = (): void => {
        gsap.to(this.scale, {
            x: 1,
            y: 1,
            duration: 0.2,
            ease: "power2.out"
        });
    };

    private onDown = (): void => {
        gsap.to(this.scale, {
            x: this.pressedScale,
            y: this.pressedScale,
            duration: 0.08,
            ease: "power2.out"
        });
    };

    private onUp = (): void => {
        gsap.to(this.scale, {
            x: this.hoverScale,
            y: this.hoverScale,
            duration: 0.12,
            ease: "power2.out"
        });
    };

    public destroy(options?: IDestroyOptions | boolean): void {
        this.removeAllListeners();
        super.destroy(options);
    }
}