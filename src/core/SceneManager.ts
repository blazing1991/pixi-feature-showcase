import {Container, utils} from "pixi.js";
import {BaseScene} from "./BaseScene";
import type {Dimensions} from "../config/types";
import {LayoutManager} from "./LayoutManager";
import {MainScene} from "../scenes/main/MainScene";

export enum SceneEvent {
    EnteringMainScene = "SceneEvent.EnteringMainScene",
    EnteringFeatureScene = "SceneEvent.EnteringFeatureScene",
}

export class SceneManager {
    public events: utils.EventEmitter = new utils.EventEmitter();
    protected mainScene!: MainScene;
    protected currentFeatureScene: BaseScene | null = null;

    constructor(protected rootContainer: Container, protected layoutManager: LayoutManager) {
        this.initMainScene();
    }

    protected async initMainScene() {
        this.mainScene = new MainScene(this);
        await this.mainScene.init();
    }

    public async showFeature(scene: BaseScene): Promise<void> {
        if (this.currentFeatureScene) {
            this.currentFeatureScene.destroyScene();
            this.rootContainer.removeChild(this.currentFeatureScene);
        }

        this.currentFeatureScene = scene;
        this.rootContainer.removeChild(this.mainScene);
        this.rootContainer.addChild(scene);
        await scene.init();
        this.events.emit(SceneEvent.EnteringFeatureScene);
        this.layoutManager.forceUpdateLayout();
    }

    public updateLayout(dimensions: Dimensions, viewPort: Dimensions, scale: number): void {
        if (this.currentFeatureScene) {
            this.currentFeatureScene.updateLayout(dimensions, viewPort, scale);
        } else {
            this.mainScene.updateLayout(dimensions);
        }
    }

    public goToMainScene(): void {
        if (this.currentFeatureScene) {
            this.currentFeatureScene.destroyScene();
            this.rootContainer.removeChild(this.currentFeatureScene);
            this.currentFeatureScene = null;
        }

        this.rootContainer.addChild(this.mainScene);
        this.events.emit(SceneEvent.EnteringMainScene);
        this.layoutManager.forceUpdateLayout();
    }
}