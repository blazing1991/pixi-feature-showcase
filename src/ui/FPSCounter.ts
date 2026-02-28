import {Container, Text, Ticker, UPDATE_PRIORITY} from "pixi.js";

export class FPSCounter extends Container {
    protected text: Text;
    protected lastMeasureTime: number;
    protected framesCount: number;

    constructor(ticker: Ticker) {
        super();
        this.text = new Text("FPS: 0", {
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: "bold",
            fontSize: 16,
            fill: 0xEE0000
        });

        this.text.position.set(12, 8);
        this.framesCount = 0;
        this.lastMeasureTime = this.getTime();
        ticker.add(this.measure, this, UPDATE_PRIORITY.UTILITY);
        this.addChild(this.text);
    }

    protected measure() {
        const currentTime = this.getTime();
        this.framesCount++;

        if (currentTime - this.lastMeasureTime >= 1000) {
            const fps = (this.framesCount * 1000) / (currentTime - this.lastMeasureTime);

            this.lastMeasureTime = currentTime;
            this.framesCount = 0;
            this.text.text = `FPS: ${Math.round(fps)}`;
        }
    }

    // window.performance for more accurate data.
    protected getTime() {
        return (window.performance && window.performance.now) ? window.performance.now() : Number(new Date());
    }
}