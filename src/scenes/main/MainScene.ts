import {BaseScene} from "../../core/BaseScene";
import {Button} from "../../ui/Button";
import type {Dimensions} from "../../config/types";
import {Text} from "pixi.js";
import {SceneManager} from "../../core/SceneManager";
import {AceOfShadowsScene} from "../aceOfShadows/AceOfShadowsScene";

export class MainScene extends BaseScene {
    protected menuText: Text;
    protected buttonAceOfShadows: Button;
    protected buttonMagicWords: Button;
    protected buttonPhoenixFlame: Button;

    constructor(protected sceneManager: SceneManager) {
        super();
    }

    public async init() {
        this.menuText = new Text("Main Menu:", {
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 38,
            fontWeight: "bold",
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 2,
            dropShadowDistance: 1,
        });
        this.menuText.anchor.set(0.5);
        this.buttonAceOfShadows = new Button("Ace of Shadows");
        this.buttonMagicWords = new Button("Magic Words");
        this.buttonPhoenixFlame = new Button("Phoenix Flame");

        this.buttonAceOfShadows.on("click", () => {
            this.sceneManager.showFeature(
                new AceOfShadowsScene()
            );
        });

        this.addChild(this.menuText, this.buttonAceOfShadows, this.buttonMagicWords, this.buttonPhoenixFlame);
    }

    public updateLayout(dimensions: Dimensions): void {
        const betweenButtons = 10;
        this.buttonAceOfShadows.position.set(0, -this.buttonAceOfShadows.height - betweenButtons);
        this.buttonMagicWords.position.set(0, 0);
        this.buttonPhoenixFlame.position.set(0, this.buttonMagicWords.height + betweenButtons);
        this.menuText.position.set(0, this.buttonAceOfShadows.position.y - this.buttonAceOfShadows.height / 2 - this.menuText.height - betweenButtons * 2);

        this.position.set(dimensions.width / 2, dimensions.height / 2);
    }

    public destroyScene(): void {
        // Clean up resources and listeners here
    }
}