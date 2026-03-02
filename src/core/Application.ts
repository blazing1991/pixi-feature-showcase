import {Application as PIXIApplication, Assets, Container} from "pixi.js";
import {SceneEvent, SceneManager} from "./SceneManager";
import {LayoutEvent, LayoutManager} from "./LayoutManager";
import {HTML_CONTAINER_ID} from "../config/constants";
import type {Dimensions} from "../config/types";
import {ASSETS} from "../config/assets";
import {FPSCounter} from "../ui/FPSCounter";
import {Button} from "../ui/Button";

export class Application extends PIXIApplication {
    protected sceneManager!: SceneManager;
    protected layoutManager!: LayoutManager;
    protected rootContainer!: Container;
    protected overlayContainer!: Container;
    protected backButton!: Button;

    constructor() {
        super({
            backgroundColor: 0x111827,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        this.init();
    }

    protected async init() {
        this.attachApplication();
        await this.loadAssets();
        this.initContainers();
        this.initLayoutManager();
        this.initSceneManager();
        this.initFPSCounter();
        this.initBackButton();
        this.addListeners();
        await this.enterMainScene();
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
                Assets.add(assetName, `assets/${assetName}`);
                assetsToLoad.push(assetName);
            })
            Assets.load(assetsToLoad).then(() => resolve());
        });
    }

    protected initContainers() {
        this.rootContainer = new Container();
        this.overlayContainer = new Container();

        this.stage.addChild(this.rootContainer, this.overlayContainer);
    }

    protected initLayoutManager() {
        this.layoutManager = new LayoutManager(this.rootContainer, this.renderer);
    }

    protected initSceneManager() {
        this.sceneManager = new SceneManager(this.rootContainer, this.layoutManager);
    }

    protected initFPSCounter() {
        const fpsCounter = new FPSCounter(this.ticker);
        this.overlayContainer.addChild(fpsCounter);
    }

    protected initBackButton(): void {
        this.backButton = new Button("Back");
        this.backButton.scale.set(0.5);
        this.backButton.position.set(this.backButton.width / 2, this.backButton.height + 20);
        this.backButton.visible = false;
        this.backButton.onClick(() => this.sceneManager.goToMainScene());

        this.overlayContainer.addChild(this.backButton);
    }

    protected async enterMainScene() {
        await this.sceneManager.goToMainScene();
    }

    protected addListeners() {
        this.layoutManager.events.on(LayoutEvent.Update, (dimensions: Dimensions, viewPort: Dimensions, scale: number) => this.sceneManager.updateLayout(dimensions, viewPort, scale));
        this.sceneManager.events.on(SceneEvent.EnteringMainScene, () => this.backButton.visible = false);
        this.sceneManager.events.on(SceneEvent.EnteringFeatureScene, () => this.backButton.visible = true);
    }
}