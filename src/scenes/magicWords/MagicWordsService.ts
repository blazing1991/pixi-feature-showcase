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

const ENDPOINT =
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

export class MagicWordsService {

    public async fetch(): Promise<MagicWordsResponse> {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error("Failed to fetch Magic Words data.");
        }
        const rawResponse = await response.json();

        if (!rawResponse.dialogue || !rawResponse.emojies || !rawResponse.avatars) {
            throw new Error("Invalid response format.");
        }

        return rawResponse;
    }

}