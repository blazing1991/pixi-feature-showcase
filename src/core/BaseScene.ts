import {Container} from "pixi.js";
import type {Dimensions} from "../config/types";

export abstract class BaseScene extends Container {
    abstract init(): Promise<void>;

    abstract updateLayout(dimensions: Dimensions, viewPort?: Dimensions, scale?: number): void;

    abstract destroyScene(): void;
}