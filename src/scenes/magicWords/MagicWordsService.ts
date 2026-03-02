import type {MagicWordsResponse} from "../../config/types";
import {MAGIC_WORDS_ENDPOINT} from "../../config/constants";

export class MagicWordsService {

    public async fetch(): Promise<MagicWordsResponse> {
        const response = await fetch(MAGIC_WORDS_ENDPOINT);

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