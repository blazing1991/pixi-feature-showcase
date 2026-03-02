import type {EmitterConfigV3} from "@pixi/particle-emitter";
import {Texture} from "pixi.js";

export const FLAME_EMITTER_CONFIG: EmitterConfigV3 = {
    lifetime: {min: 0.5, max: 1},
    frequency: 0.1,
    emitterLifetime: -1,
    maxParticles: 10,
    pos: {x: 0, y: 0},
    behaviors: [
        {
            type: "alpha",
            config: {
                alpha: {
                    list: [
                        { value: 0, time: 0 },
                        { value: 0.7, time: 0.15 },
                        { value: 0.5, time: 0.6 },
                        { value: 0, time: 1 }
                    ]
                }
            }
        },
        {
            type: "color",
            config: {
                color: {
                    list: [
                        { value: "fff4a3", time: 0 },
                        { value: "ffb347", time: 0.3 },
                        { value: "ff5a00", time: 0.7 },
                        { value: "992200", time: 1 }
                    ]
                }
            }
        },
        {
            type: "scale",
            config: {
                scale: {
                    list: [
                        { value: 0.4, time: 0 },
                        { value: 1.2, time: 0.5 },
                        { value: 0.6, time: 1 }
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
            config: {type: 'circle', data: {x: 0, y: 0, radius: 30}},
        },
        {type: 'textureSingle', config: {texture: Texture.WHITE}},
    ],
}