import {Application} from "./core/Application";

const application = new Application();

// For Pixi plugin in chrome
globalThis.__PIXI_APP__ = application;