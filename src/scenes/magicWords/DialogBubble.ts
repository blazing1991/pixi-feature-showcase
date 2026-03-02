import {Container, NineSlicePlane, Text, TextStyle, Texture} from "pixi.js";
import {LazyLoadedSprite} from "../../core/LazyLoadedSprite";
import {RichText} from "./RichText";
import {ASSETS} from "../../config/assets";
import {AvatarPosition} from "./MagicWordsService";

interface DialogBubbleOptions {
    name: string;
    text: string;
    avatarUrl: string;
    position: AvatarPosition;
    maxTextWidth: number;
    textImagesData: {
        name: string;
        url: string;
    }[];
}

export class DialogBubble extends Container {
    protected avatar: LazyLoadedSprite;
    protected avatarNameText: Text;
    protected bubble: NineSlicePlane;
    protected dialogText: RichText;

    constructor(protected options: DialogBubbleOptions) {
        super();
        this.avatar = this.createAvatar();
        this.avatarNameText = this.createAvatarNameText();
        this.dialogText = this.createDialogText();
        this.bubble = this.createBubble(options.maxTextWidth, this.dialogText.height);

        this.updateLayout();
        this.addChild(this.bubble, this.dialogText, this.avatar, this.avatarNameText)
    }

    protected createAvatar(): LazyLoadedSprite {
        const {name, avatarUrl} = this.options;
        const avatar = new LazyLoadedSprite(name, avatarUrl);
        const avatarSize = 100;

        avatar.width = avatarSize;
        avatar.height = avatarSize;
        avatar.anchor.set(0.5);

        return avatar;
    }

    protected createAvatarNameText(): Text {
        const {name} = this.options;
        const avatarNameText = new Text(name, {
            fontSize: 14,
            fill: 0xffffff
        });

        avatarNameText.anchor.set(0.5);

        return avatarNameText;
    }

    protected createBubble(width: number, height: number): NineSlicePlane {
        const wallWidth = 20;
        const bubble = new NineSlicePlane(Texture.from(ASSETS.CHAT_BUBBLE), wallWidth, wallWidth, wallWidth, wallWidth);
        const offsetY = -width / 15;

        bubble.width = width + wallWidth * 5;
        bubble.height = height + wallWidth * 2;
        bubble.pivot.set(bubble.width / 2 + offsetY, bubble.height / 2);

        return bubble;
    }

    protected createDialogText(): RichText {
        const {text, maxTextWidth, textImagesData} = this.options;
        const richText = new RichText({
            text,
            maxWidth: maxTextWidth,
            textStyle: new TextStyle({
                fontSize: 22,
                fill: 0x000000
            }),
            textImagesData
        });

        return richText;
    }

    protected updateLayout() {
        const {position} = this.options;

        this.bubble.position.set(0, 0);

        if (position === AvatarPosition.LEFT) {
            this.bubble.scale.x = -1; // Mirror horizontally
            this.avatar.position.set(this.bubble.x - this.bubble.width / 1.5, -20);
        } else {
            this.avatar.position.set(this.bubble.x + this.bubble.width / 1.5, -20);
        }
        this.dialogText.position.set(this.bubble.x, this.bubble.y);
        this.avatarNameText.position.set(this.avatar.x, this.avatar.y + this.avatar.height / 2 + 10);
    }
}