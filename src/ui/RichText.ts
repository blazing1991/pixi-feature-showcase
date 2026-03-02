import type {ITextStyle} from "pixi.js";
import {Container, Text} from "pixi.js";
import {LazyLoadedSprite} from "../core/LazyLoadedSprite";

interface RichTextOptions {
    text: string;
    maxWidth: number;
    textStyle: Partial<ITextStyle>;
    textImagesData: {
        name: string;
        url: string;
    }[];
}

export class RichText extends Container {
    protected fontSize: number;
    protected lineHeight: number;
    protected centeringContainer = new Container();

    constructor(protected options: RichTextOptions) {
        super();

        this.fontSize = (options.textStyle.fontSize as number) || 16;
        this.lineHeight = this.fontSize * 1.3;

        this.build();
        this.addChild(this.centeringContainer);
    }

    protected build(): void {
        const {text, maxWidth, textStyle} = this.options;
        const stringPieces = text.split(" ");
        const spaceWidth = new Text(" ", textStyle).width;
        let lastX = 0;
        let lastY = 0;

        stringPieces.forEach(stringPiece => {
            const element = this.createElement(stringPiece);

            if (lastX + element.width > maxWidth) {
                lastX = 0;
                lastY += this.lineHeight;
            }

            element.position.set(lastX, lastY);
            this.centeringContainer.addChild(element);

            lastX += element.width + spaceWidth;
        })

        this.centeringContainer.position.set(
            -this.centeringContainer.width / 2,
            -this.centeringContainer.height / 2
        )
    }

    protected createElement(word: string): LazyLoadedSprite | Text {
        if (this.isImageTag(word)) {
            const spriteId = this.getSpriteIdFromTag(word);
            const spriteUrl = this.options.textImagesData.find(image => image.name === spriteId)?.url || "";
            const sprite = new LazyLoadedSprite(spriteId, spriteUrl);

            // Match image height to font size
            sprite.height = this.fontSize;
            sprite.scale.x = sprite.scale.y;

            return sprite;
        }

        return new Text(word, this.options.textStyle);
    }

    protected isImageTag(word: string): boolean {
        const isTagFormat = word.startsWith("{") && word.endsWith("}");
        const isValidTag = this.options.textImagesData.some(image => image.name === this.getSpriteIdFromTag(word));
        return isTagFormat && isValidTag;
    }

    protected getSpriteIdFromTag(tag: string): string {
        return tag.slice(1, -1);
    }
}