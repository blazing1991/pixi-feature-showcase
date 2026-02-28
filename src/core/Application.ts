import {Application as PIXIApplication, Assets} from "pixi.js";
import {SceneManager} from "./SceneManager";
import {LayoutEvent, LayoutManager} from "./LayoutManager";
import {HTML_CONTAINER_ID} from "../config/constants";
import {MainScene} from "../scenes/MainScene";
import type {Dimensions} from "../config/types";
import {ASSETS} from "../config/assets";

export class Application extends PIXIApplication {
    protected sceneManager: SceneManager;
    protected layoutManager: LayoutManager;

    constructor() {
        super({
            backgroundColor: 0x111827,
            antialias: true
        });

        this.init();

        // @ts-expect-error Chrome PIXI plugin
        globalThis.__PIXI_APP__ = this;
    }

    protected async init() {
        this.attachApplication();
        await this.loadAssets();
        this.initSceneManager();
        this.initLayoutManager();
        this.addListeners();

        await this.sceneManager.changeScene(new MainScene())
        this.layoutManager.forceUpdateLayout();
    }

    protected attachApplication() {
        const htmlContainer = document.getElementById(HTML_CONTAINER_ID);
        if (!htmlContainer) {
            throw new Error(`HTML container with id ${HTML_CONTAINER_ID} not found.`);
        }
        htmlContainer.appendChild(this.view as HTMLCanvasElement);
    }

    protected loadAssets(): Promise<void> {
        return new Promise<void>((resolve) => {
            const assetsToLoad: string[] = [];
            Object.values(ASSETS).forEach((assetName: string) => {
                Assets.add(assetName, `/assets/${assetName}`);
                assetsToLoad.push(assetName);
            })
            Assets.load(assetsToLoad).then(() => resolve());
        });
    }

    protected initSceneManager() {
        this.sceneManager = new SceneManager(this.stage);
    }

    protected initLayoutManager() {
        this.layoutManager = new LayoutManager(this);
    }

    protected addListeners() {
        this.layoutManager.events.on(LayoutEvent.Update, (dimensions: Dimensions) => this.sceneManager.updateLayout(dimensions));
    }
}