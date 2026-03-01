import type {IDestroyOptions} from "pixi.js";
import {Container, Sprite, Text} from "pixi.js";
import {gsap} from "gsap";
import {ASSETS} from "../config/assets";

export class Button extends Container {
    protected background: Sprite;
    protected text: Text;
    protected hoverScale = 1.05;
    protected pressedScale = 0.95;
    protected animationContainer: Container;
    protected animationTween?: gsap.core.Tween;

    constructor(text: string) {
        super();

        this.animationContainer = new Container();

        this.background = Sprite.from(ASSETS.BUTTON_BACKGROUND);
        this.background.anchor.set(0.5);

        // Label
        this.text = new Text(text, {
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 28,
            fontWeight: "600",
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 2,
            dropShadowDistance: 1,
        });

        this.text.anchor.set(0.5, 0.6);

        this.animationContainer.addChild(this.background, this.text);
        this.addChild(this.animationContainer);

        this.interactive = true;
        this.cursor = "pointer";

        this.setupInteractions();
    }

    public set disabled(value: boolean) {
        this.interactive = !value;
        this.cursor = value ? "default" : "pointer";
        this.background.tint = value ? 0x6C716C : 0xffffff;
        this.text.tint = this.background.tint;
        this.killAnimationTween();
        this.scale.set(1);
    }

    public get disabled(): boolean {
        return !this.interactive;
    }

    protected setupInteractions(): void {
        this.on("pointerover", () => this.onHover());
        this.on("pointerout", () => this.onOut());
        this.on("pointerdown", () => this.onDown());
        this.on("pointerup", () => this.onUp());
        this.on("pointerupoutside", () => this.onOut());
    }

    protected onHover(): void {
        this.killAnimationTween();
        this.animationTween =
            gsap.to(this.animationContainer.scale, {
                x: this.hoverScale,
                y: this.hoverScale,
                duration: 0.2,
                ease: "power2.out"
            });
    };

    protected onOut(): void {
        this.killAnimationTween();
        this.animationTween =
            gsap.to(this.animationContainer.scale, {
                x: 1,
                y: 1,
                duration: 0.2,
                ease: "power2.out"
            });
    };

    protected onDown(): void {
        this.killAnimationTween();
        this.animationTween =
            gsap.to(this.animationContainer.scale, {
                x: this.pressedScale,
                y: this.pressedScale,
                duration: 0.08,
                ease: "power2.out"
            });
    };

    protected onUp(): void {
        this.killAnimationTween();
        this.animationTween =
            gsap.to(this.animationContainer.scale, {
                x: this.hoverScale,
                y: this.hoverScale,
                duration: 0.12,
                ease: "power2.out"
            });
    };

    protected killAnimationTween(): void {
        if (this.animationTween) {
            this.animationTween.kill();
            this.animationTween = undefined;
        }
    }

    public destroy(options?: IDestroyOptions | boolean): void {
        this.removeAllListeners();
        super.destroy(options);
    }
}