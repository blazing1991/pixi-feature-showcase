import type {Dimensions} from "../config/types";
import {Container} from "pixi.js";
import {AvatarPosition, MagicWordsResponse} from "../config/types";

export function isPortraitRatio(rect: Dimensions) {
    return rect.width < rect.height;
}

export function getViewport(): Dimensions {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

/**
 * Calculates the local position of an element according to it's parent.
 */
export function calculateLocalPosition(element: Container, currentParent: Container) {
    const global = element.getGlobalPosition();
    return currentParent.toLocal(global);
}

/**
 * Calculates a simple curved path between two points. The curve is a quadratic Bezier curve with a control point that is above the midpoint of the start and end points.
 */
export function calculateCurvedPath(start: {x: number, y: number}, end: {x: number, y: number}) {
    const distance = Math.abs(end.x - start.x);
    const arcHeight = Math.max(150, distance * 0.3);
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - arcHeight;

    return [
        {x: start.x, y: start.y},
        {x: midX, y: midY},
        {x: end.x, y: end.y}
    ]
}

/**
 * Returns a promise that resolves after a minimum amount of time. This can be used to ensure that certain animations or effects are visible for a minimum duration, even if the underlying logic completes faster.
 */
export function waitMinimumTime(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getAvatarData(name: string, rawResponse: MagicWordsResponse) {
    const defaultData = {
        name,
        url: "",
        position: AvatarPosition.LEFT
    };
    return rawResponse.avatars.find(avatar => avatar.name === name) || defaultData;
}