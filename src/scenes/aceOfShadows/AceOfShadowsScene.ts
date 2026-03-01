import {BaseScene} from "../../core/BaseScene";
import {CardStack} from "./CardStack";
import {SequenceController} from "./SequenceController";
import {Container} from "pixi.js";
import {Button} from "../../ui/Button";

export class AceOfShadowsScene extends BaseScene {
    protected stackA: CardStack;
    protected stackB: CardStack;
    protected flightLayer: Container;
    protected sequenceController: SequenceController;
    protected playButton: Button;
    protected skipButton: Button;
    protected rewindButton: Button;

    constructor() {
        super();
    }

    public async init() {
        this.createStacks();
        this.createController();
        this.createControls();
    }

    protected createStacks(): void {
        this.stackA = new CardStack(144);
        this.stackB = new CardStack(0);
        this.flightLayer = new Container();
        this.addChild(this.stackA, this.stackB, this.flightLayer);
    }

    protected createController(): void {
        this.sequenceController = new SequenceController(this.stackA, this.stackB, this.flightLayer);
    }

    protected createControls(): void {
        this.playButton = new Button("Play");
        this.skipButton = new Button("Skip");
        this.rewindButton = new Button("Rewind");
        this.skipButton.disabled = true;
        this.rewindButton.disabled = true;

        this.addChild(this.playButton, this.skipButton, this.rewindButton);

        this.playButton.on("click", () => {
            this.playButton.disabled = true;
            this.skipButton.disabled = false;
            this.sequenceController.play()
                .then(() => this.rewindButton.disabled = false);
        });

        this.skipButton.on("click", () => {
            this.skipButton.disabled = true;
            this.sequenceController.skip();
        });

        this.rewindButton.on("click", () => {
            this.rewindButton.disabled = true;
            this.skipButton.disabled = false;
            this.sequenceController.rewind()
                .then(() => this.playButton.disabled = false);
        });
    }

    public updateLayout(dimensions: {width: number; height: number}): void {
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const buttonsSpacing = this.playButton.width + 5;

        this.position.set(centerX, centerY);

        this.playButton.position.set(-buttonsSpacing, dimensions.height / 2 - 100);
        this.skipButton.position.set(0, this.playButton.position.y);
        this.rewindButton.position.set(buttonsSpacing, this.playButton.position.y);

        this.stackA.position.set(-250, 0);
        this.stackB.position.set(250, 0);
        this.flightLayer.position.set(0, 0);
    }

    public destroyScene(): void {
        this.sequenceController.destroy();
        this.children.forEach(child => child.destroy({children: true}));
    }
}