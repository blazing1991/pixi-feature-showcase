import {Container, Text, Ticker} from "pixi.js";

export class FPSCounter extends Container {
    protected label: Text;

    constructor() {
        super();
        this.label = new Text("FPS: 0", {
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 14,
            fill: 0xffffff
        });

        this.label.position.set(12, 8);


        app.ticker.add(this.update);
    }

    private update = (delta: number): void => {
        // Using ticker.FPS gives smoothed value
        const fps = Math.round(Ticker.shared.FPS);
        this.label.text = `FPS: ${fps}`;
    };
}