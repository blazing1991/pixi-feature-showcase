import {BaseScene} from "../core/BaseScene";
import {Button} from "../ui/Button";
import type {Dimensions} from "../config/types";

export class MainScene extends BaseScene {
    protected buttonAceOfShadows: Button;
    protected buttonMagicWords: Button;
    protected buttonPhoenixFlame: Button;

    constructor() {
        super();
    }

    public async init() {
        this.buttonAceOfShadows = new Button("Ace of Shadows");
        this.buttonMagicWords = new Button("Magic Words");
        this.buttonPhoenixFlame = new Button("Phoenix Flame");

        this.addChild(this.buttonAceOfShadows, this.buttonMagicWords, this.buttonPhoenixFlame);
    }

    public updateLayout(dimensions: Dimensions): void {
        const betweenButtons = 10;
        this.buttonAceOfShadows.position.set(0, -this.buttonAceOfShadows.height - betweenButtons);
        this.buttonMagicWords.position.set(0, 0);
        this.buttonPhoenixFlame.position.set(0, this.buttonMagicWords.height + betweenButtons);

        this.position.set(dimensions.width / 2, dimensions.height / 2);
    }

    public destroyScene(): void {
        // Clean up resources and listeners here
    }
}