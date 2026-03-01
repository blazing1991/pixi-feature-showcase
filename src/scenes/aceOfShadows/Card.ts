import {Container, Sprite} from "pixi.js";
import {gsap} from "gsap";
import {ASSETS} from "../../config/assets";

export class Card extends Container {
    protected front: Sprite;
    protected back: Sprite;

    constructor() {
        super();

        this.front = Sprite.from(ASSETS.CARD_FRONT);
        this.back = Sprite.from(ASSETS.CARD_BACK);

        this.front.anchor.set(0.5);
        this.front.scale.set(0.5);
        this.back.anchor.set(0.5);
        this.back.scale.set(0.5);

        this.front.visible = false;

        this.addChild(this.back, this.front);
    }

    public flip() {
        const timeline = gsap.timeline();
        const duration = 0.15;

        timeline
            .to(this.scale, {x: 0, duration})
            .call(() => {
                this.back.visible = !this.back.visible;
                this.front.visible = !this.back.visible;
            })
            .to(this.scale, {x: 1, duration})
        ;

        return timeline;
    }
}