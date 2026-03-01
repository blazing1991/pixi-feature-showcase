import type {EmitterConfigV3} from "@pixi/particle-emitter";
import {Texture} from "pixi.js";

export const FLAME_EMITTER_CONFIG: EmitterConfigV3 = {
    lifetime: {min: 1, max: 1},
    frequency: 0.1,
    emitterLifetime: -1,
    maxParticles: 100,
    pos: {x: 0, y: 0},
    behaviors: [
        {
            type: "alpha",
            config: {
                alpha: {
                    list: [
                        {value: 0.8, time: 0},
                        {value: 0.4, time: 0.5},
                        {value: 0, time: 1}
                    ]
                }
            }
        },
        {
            type: "color",
            config: {
                color: {
                    list: [
                        {value: "fff4a3", time: 0},
                        {value: "ff8c00", time: 0.5},
                        {value: "ff3300", time: 1}
                    ]
                }
            }
        },
        {
            type: "scale",
            config: {
                scale: {
                    list: [
                        {value: 0.6, time: 0},
                        {value: 1, time: 0.5},
                        {value: 0.3, time: 1}
                    ]
                }
            }
        },
        {
            type: "moveAcceleration",
            config: {
                accel: {
                    x: 0,
                    y: -20
                },
                minStart: 50,
                maxStart: 50,
                rotate: false
            }
        },
        {
            type: 'spawnShape',
            config: {type: 'circle', data: {x: 0, y: 0, radius: 40}},
        },
        {type: 'textureSingle', config: {texture: Texture.WHITE}},
    ],
}