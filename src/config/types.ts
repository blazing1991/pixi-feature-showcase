export interface Dimensions {
    width: number;
    height: number;
}

export interface DialogueItem {
    name: string;
    text: string;
}

export interface EmojiItem {
    name: string;
    url: string;
}

export interface AvatarItem {
    name: string;
    url: string;
    position: AvatarPosition;
}

export enum AvatarPosition {
    LEFT = "left",
    RIGHT = "right"
}

export interface MagicWordsResponse {
    dialogue: DialogueItem[];
    emojies: EmojiItem[];
    avatars: AvatarItem[];
}