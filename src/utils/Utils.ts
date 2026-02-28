import type {Dimensions} from "../config/types";

export function isPortraitRatio(rect: Dimensions) {
    return rect.width < rect.height;
}

export function getViewport(): Dimensions {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}