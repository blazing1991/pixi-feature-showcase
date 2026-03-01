import {Container} from "pixi.js";
import {gsap} from "gsap";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {CardStack} from "./CardStack";
import {Card} from "./Card";
import {calculateCurvedPath, calculateLocalPosition} from "../../utils/Utils";

gsap.registerPlugin(MotionPathPlugin);

export class SequenceController {
    protected timeline!: gsap.core.Timeline;

    protected readonly flightDuration = 2;
    protected readonly delayBetween = 0.6;

    constructor(
        protected stackA: CardStack,
        protected stackB: CardStack,
        protected flightLayer: Container
    ) {}

    public play(reverse?: boolean): gsap.core.Timeline {
        const timeline = this.timeline = gsap.timeline();
        const fromStack = reverse ? this.stackB : this.stackA;
        const toStack = reverse ? this.stackA : this.stackB;
        const topToBottomCards = [...fromStack.getCards()].reverse();

        topToBottomCards.forEach((card: Card, index: number) => {
            const subTimeline = gsap.timeline();
            const start = calculateLocalPosition(card, this.flightLayer);
            const end = calculateLocalPosition(toStack, this.flightLayer);
            end.y += index * toStack.getCardsOffset().y;
            const path = calculateCurvedPath(start, end);
            const START_LABEL = "START_LABEL";

            subTimeline
                .addLabel(START_LABEL, 0)
                .call(() => {
                    fromStack.removeCard(card);
                    this.flightLayer.addChild(card)
                    card.position.set(start.x, start.y);
                }, undefined, START_LABEL)
                .to(card, {
                    rotation: Math.PI / 12,
                    duration: this.flightDuration / 2,
                    yoyo: true,
                    repeat: 1
                }, START_LABEL)
                .to(card, {
                    duration: this.flightDuration,
                    ease: "power1.inOut",
                    motionPath: {
                        path
                    }
                }, START_LABEL)
                .add(card.flip(), START_LABEL + "+=" + (this.flightDuration / 3))
                .call(() => {
                    toStack.addCard(card);
                })
            ;
            timeline.add(subTimeline, index * this.delayBetween);
        })

        return timeline;
    }

    public skip(): void {
        this.timeline?.timeScale(30);
    }

    public rewind(): gsap.core.Timeline {
        return this.play(true);
    }

    public destroy(): void {
        this.timeline?.kill();
    }
}