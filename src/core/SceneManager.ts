import {Container} from "pixi.js";
import {BaseScene} from "./BaseScene";
import type {Dimensions} from "../config/types";

export class SceneManager {
    protected currentScene?: BaseScene;

    constructor(protected rootContainer: Container) {
    }

    public async changeScene(newScene: BaseScene): Promise<void> {
        if (this.currentScene) {
            this.currentScene.destroyScene();
            this.rootContainer.removeChild(this.currentScene);
        }

        this.currentScene = newScene;
        this.rootContainer.addChild(newScene);
        await newScene.init();
    }

    public updateLayout(dimensions: Dimensions): void {
        if (this.currentScene) {
            this.currentScene.updateLayout(dimensions);
        }
    }
}