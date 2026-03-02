import {Container, utils} from "pixi.js";
import type {IRenderer} from "pixi.js";
import {APPLICATION_RESOLUTION} from "../config/constants";
import {getViewport, isPortraitRatio} from "../utils/Utils";
import type {Dimensions} from "../config/types";

export enum LayoutEvent {
    Update = "LayoutEvent.Update",
}

export class LayoutManager {
    public events: utils.EventEmitter = new utils.EventEmitter();
    protected scale = 1;
    protected logicalDimensions: Dimensions = APPLICATION_RESOLUTION.portrait;

    constructor(protected rootContainer: Container, protected applicationRenderer: IRenderer) {
        window.addEventListener("resize", () => this.onResize());
    }

    public forceUpdateLayout() {
        this.onResize();
    }

    protected onResize() {
        const viewport = getViewport();
        const isPortrait = isPortraitRatio(viewport);
        const logicalDimensions = this.logicalDimensions = isPortrait ? APPLICATION_RESOLUTION.portrait : APPLICATION_RESOLUTION.landscape;

        this.scale = Math.min(
            viewport.width / logicalDimensions.width,
            viewport.height / logicalDimensions.height
        );

        // Resize renderer to full window
        this.applicationRenderer.resize(viewport.width, viewport.height);

        // Scale root container
        this.rootContainer.scale.set(this.scale);

        // Center root container
        const scaledWidth = logicalDimensions.width * this.scale;
        const scaledHeight = logicalDimensions.height * this.scale;

        this.rootContainer.position.set(
            (viewport.width - scaledWidth) / 2,
            (viewport.height - scaledHeight) / 2
        );

        this.events.emit(LayoutEvent.Update, this.logicalDimensions, viewport);
    }
}