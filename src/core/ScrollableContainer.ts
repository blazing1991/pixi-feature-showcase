import {Container, Rectangle} from "pixi.js";
import type {FederatedPointerEvent, FederatedWheelEvent, IDestroyOptions} from "pixi.js";

interface ScrollableContainerOptions {
    width: number;
    height: number;
}

/**
 * A container with a fixed viewport that can be scrolled vertically
 * when its content is taller than the viewport.
 */
export class ScrollableContainer extends Container {
    public readonly content: Container;

    protected viewportWidth: number;
    protected viewportHeight: number;

    protected isDragging = false;
    protected dragStartY = 0;
    protected contentStartY = 0;

    protected minScrollY = 0;
    protected maxScrollY = 0;

    constructor(options: ScrollableContainerOptions) {
        super();

        this.viewportWidth = options.width;
        this.viewportHeight = options.height;

        this.content = new Container();
        this.addChild(this.content);

        this.eventMode = "static";
        this.interactiveChildren = true;

        this.redrawMask();
        this.updateScrollBounds();
        this.setupInteraction();
    }

    /**
     * Adds a display object to the scrollable content area.
     */
    public addContentChild<T extends Container>(child: T): T {
        this.content.addChild(child);
        this.updateScrollBounds();
        return child;
    }

    /**
     * Removes a display object from the scrollable content area.
     */
    public removeContentChild<T extends Container>(child: T): T {
        const removed = this.content.removeChild(child);
        this.updateScrollBounds();
        return removed;
    }

    /**
     * Updates the viewport size and recomputes the mask and scroll bounds.
     */
    public setViewportSize(width: number, height: number): void {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.redrawMask();
        this.updateScrollBounds();
    }

    /**
     * Recalculates scroll bounds. Call this if children sizes change dynamically.
     */
    public refresh(): void {
        this.updateScrollBounds();
    }

    protected redrawMask(): void {
        this.hitArea = new Rectangle(-this.viewportWidth / 2, -this.viewportHeight / 2, this.viewportWidth, this.viewportHeight);
    }

    protected updateScrollBounds(): void {
        const contentHeight = this.content.height;
        const baseY = -this.viewportHeight / 2;

        if (contentHeight <= this.viewportHeight) {
            this.maxScrollY = baseY;
            this.minScrollY = baseY;
            this.content.y = baseY;
            return;
        }

        this.maxScrollY = baseY;
        this.minScrollY = this.viewportHeight / 2 - contentHeight;
        this.clampContentY();
    }

    protected clampContentY(): void {
        if (this.content.y > this.maxScrollY) {
            this.content.y = this.maxScrollY;
        } else if (this.content.y < this.minScrollY) {
            this.content.y = this.minScrollY;
        }
    }

    protected setupInteraction(): void {
        this.on("pointerdown", this.onPointerDown, this);
        this.on("pointerup", this.onPointerUp, this);
        this.on("pointerupoutside", this.onPointerUp, this);
        this.on("pointermove", this.onPointerMove, this);
        this.on("wheel", this.onWheel, this);
    }

    protected onPointerDown(event: FederatedPointerEvent): void {
        this.isDragging = true;
        this.dragStartY = event.global.y;
        this.contentStartY = this.content.y;
    }

    protected onPointerMove(event: FederatedPointerEvent): void {
        if (!this.isDragging) {
            return;
        }

        const deltaY = event.global.y - this.dragStartY;
        this.content.y = this.contentStartY + deltaY;
        this.clampContentY();
    }

    protected onPointerUp(): void {
        this.isDragging = false;
    }

    protected onWheel(event: FederatedWheelEvent): void {
        if (this.content.height <= this.viewportHeight) {
            return;
        }

        // Positive deltaY means scroll down; move content up.
        const scrollFactor = 0.5;
        const delta = event.deltaY * scrollFactor;

        this.content.y -= delta;
        this.clampContentY();

        event.preventDefault();
        event.stopPropagation();
    }

    public override destroy(options?: boolean | IDestroyOptions): void {
        this.off("pointerdown", this.onPointerDown, this);
        this.off("pointerup", this.onPointerUp, this);
        this.off("pointerupoutside", this.onPointerUp, this);
        this.off("pointermove", this.onPointerMove, this);
        this.off("wheel", this.onWheel, this);

        super.destroy(options);
    }
}