import {BaseScene} from "../../core/BaseScene";
import {CardStack} from "./CardStack";
import {SequenceController} from "./SequenceController";
import {Container} from "pixi.js";
import {Button} from "../../ui/Button";
import {isPortraitRatio} from "../../utils/Utils";

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
        this.addEventListeners();
    }

    public updateLayout(dimensions: {width: number; height: number}): void {
        const isPortrait = isPortraitRatio(dimensions);
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const buttonsSpacing = 220;
        const stacksOffset = {x: 250, y: isPortrait ? 200 : 70};
        const stacksScale = 0.8;
        const buttonsScale = 0.8;

        this.position.set(centerX, centerY);

        this.playButton.scale.set(buttonsScale);
        this.skipButton.scale.set(buttonsScale);
        this.rewindButton.scale.set(buttonsScale);
        this.playButton.position.set(-buttonsSpacing, dimensions.height / 2 - 100);
        this.skipButton.position.set(0, this.playButton.position.y);
        this.rewindButton.position.set(buttonsSpacing, this.playButton.position.y);

        this.stackA.position.set(-stacksOffset.x, stacksOffset.y);
        this.stackB.position.set(stacksOffset.x, stacksOffset.y);
        this.flightLayer.position.set(0, stacksOffset.y);
        this.stackA.scale.set(stacksScale);
        this.stackB.scale.set(stacksScale);
        this.flightLayer.scale.set(stacksScale);
    }

    public destroyScene(): void {
        this.sequenceController.destroy();
        this.destroy({children: true});
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
    }

    protected addEventListeners(): void {
        this.playButton.onClick(() => {
            this.playButton.disabled = true;
            this.skipButton.disabled = false;
            this.sequenceController.play()
                .then(() => {
                    this.rewindButton.disabled = false;
                    this.skipButton.disabled = true;
                });
        });

        this.skipButton.onClick(() => {
            this.skipButton.disabled = true;
            this.sequenceController.skip();
        });

        this.rewindButton.onClick(() => {
            this.rewindButton.disabled = true;
            this.skipButton.disabled = false;
            this.sequenceController.rewind()
                .then(() => {
                    this.playButton.disabled = false;
                    this.skipButton.disabled = true;
                });
        });
    }
}