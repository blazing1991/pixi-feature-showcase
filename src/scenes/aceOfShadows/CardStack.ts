import {Container, Sprite, Text} from "pixi.js";
import {Card} from "./Card";
import {ASSETS} from "../../config/assets";

export class CardStack extends Container {
    protected cardsCountText: Text;
    protected cards: Card[] = [];
    protected cardsOffset = {x: 0, y: -2};

    constructor(cardsAmount: number) {
        super();

        const stackTray = Sprite.from(ASSETS.CARD_BACK);
        stackTray.anchor.set(0.5);
        stackTray.scale.set(0.5);
        stackTray.tint = 0x191A18;

        this.addChild(stackTray);


        for (let i = 0; i < cardsAmount; i++) {
            const card = new Card();
            card.position.set(0, i * this.cardsOffset.y);
            this.addChild(card);
            this.cards.push(card);
        }

        this.cardsCountText = new Text(cardsAmount.toString(), {
            fill: 0xffffff,
            fontSize: 16,
            fontWeight: "bold"
        });
        this.cardsCountText.anchor.set(0.5);
        this.cardsCountText.position.set(0, stackTray.height / 2 + 20);
        this.addChild(this.cardsCountText);
    }

    public getCardsOffset() {
        return this.cardsOffset;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public removeCard(card: Card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
            this.removeChild(card);
            this.updateCardsCount();
        }
    }

    public addCard(card: Card) {
        card.position.set(0, this.children.length * this.cardsOffset.y); // Position the new card on top of the stack
        this.addChild(card);
        this.cards.push(card);
        this.updateCardsCount();
    }

    protected updateCardsCount() {
        this.cardsCountText.text = this.cards.length.toString();
    }
}