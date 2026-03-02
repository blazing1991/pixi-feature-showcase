import {BaseScene} from "../../core/BaseScene";
import type {Dimensions, MagicWordsResponse} from "../../config/types";
import {AvatarPosition} from "../../config/types";
import {MagicWordsService} from "./MagicWordsService";
import {Container, Sprite, Text} from "pixi.js";
import {getAvatarData, waitMinimumTime} from "../../utils/Utils";
import {gsap} from "gsap";
import {DialogBubble} from "./DialogBubble";
import {ScrollableContainer} from "../../core/ScrollableContainer";

export class MagicWordsScene extends BaseScene {
    protected scrollableContainer!: ScrollableContainer;
    protected loadingContainer?: Container;
    protected errorContainer?: Container;
    protected service!: MagicWordsService;
    protected loadingAnimation?: gsap.core.Timeline;

    constructor() {
        super();
    }

    public async init() {
        this.scrollableContainer = new ScrollableContainer({
            width: 0,
            height: 0
        });
        this.addChild(this.scrollableContainer);

        this.service = new MagicWordsService();

        this.showLoading();
        this.startLoading();
    }

    public updateLayout(dimensions: Dimensions, viewPort: Dimensions, scale: number): void {
        const unscaledViewPort = {width: viewPort.width / scale, height: viewPort.height / scale};
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        this.position.set(centerX, centerY);
        this.scrollableContainer.setViewportSize(unscaledViewPort);
    }

    public destroyScene(): void {
        this.destroyLoader();
        this.destroy({children: true});
    }

    protected showReady(rawResponse: MagicWordsResponse): void {
        this.destroyLoader();
        this.showDialog(rawResponse);
    }

    protected showDialog(rawResponse: MagicWordsResponse) {
        const offset = {x: 20, y: 24};
        let lastY = 30;

        for (const dialogue of rawResponse.dialogue) {
            const avatarData = getAvatarData(dialogue.name, rawResponse);
            const isLeftSide = avatarData.position === AvatarPosition.LEFT;

            const dialogBubble = new DialogBubble({
                name: dialogue.name,
                text: dialogue.text,
                avatarUrl: avatarData.url,
                position: avatarData.position,
                maxTextWidth: 420,
                textImagesData: rawResponse.emojies
            });

            dialogBubble.scale.set(0.8);
            dialogBubble.position.set(offset.x * (isLeftSide ? -1 : 1), lastY + offset.y);

            this.scrollableContainer.addContentChild(dialogBubble);

            lastY += dialogBubble.height;
        }
    }

    protected showLoading(): void {
        const loader = Sprite.from("loader.png");
        const text = new Text("Loading...", {fontSize: 24, fill: 0xffffff});
        const container = this.loadingContainer = new Container();

        loader.anchor.set(0.5);
        text.anchor.set(0.5);
        text.position.set(0, loader.position.y - loader.height / 1.5);

        this.loadingAnimation = gsap.timeline()
            .to(loader, {rotation: Math.PI * 2, duration: 1, repeat: -1, ease: "power1.inOut"})
            .to(loader.scale, {x: "+=0.2", y: "+=0.2", duration: 0.5, yoyo: true, repeat: -1, ease: "power1.inOut"})
        ;

        container.addChild(text, loader);
        this.addChild(container);
    }

    protected async startLoading(): Promise<void> {
        try {
            const rawResponse = await this.service.fetch();

            await waitMinimumTime(2000);

            this.showReady(rawResponse);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            this.showError(errorMessage);
        }
    }

    protected showError(errorText: string): void {
        const container = this.errorContainer = new Container();
        const text = new Text("Failed to load data. \n" + errorText, {
            fontSize: 24,
            fill: 0xff4444,
            align: "center"
        });

        text.anchor.set(0.5);
        this.destroyLoader();

        container.addChild(text);
        this.addChild(container);
    }

    protected destroyLoader(): void {
        this.loadingAnimation?.kill();
        this.loadingContainer?.parent?.removeChild(this.loadingContainer);
        this.loadingContainer?.destroy({children: true});
        this.loadingContainer = undefined;
        this.loadingAnimation = undefined;
    }
}