import { Game as PhaserGame, AUTO as PHASER_TYPE_AUTO } from "phaser";

import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

function setBarValue(bar, percentage, width, height, fill_color, void_color) {

    let scaled_value = percentage * width;
    bar.clear();
    bar.fillStyle(fill_color, 1);
    bar.fillRect(0, 0, scaled_value, height);
    bar.fillStyle(void_color, 1);
    bar.fillRect(scaled_value, 0, width - scaled_value, height);

}

export class Game {

    level_data = {
        enemies: [],
        potions: [],
        time_allowed: 300,
        target_location: null
    }

    add_enemy(type, x, y) {
        this.level_data.enemies.push({
            type: type,
            position: { x, y }
        })
    }
    
    add_potion(size, x, y) {
        this.level_data.potions.push({
            size: size,
            position: { x, y }
        })
    }
    
    set_target_location(x, y) {
        this.level_data.target_location = { x, y };
    }

    start() {

        let config = {
            type: PHASER_TYPE_AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: '#1B1B1B',
            parent: 'phaser-example',
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            },
            scene: [ GameScene, UIScene ]
        }

        const game = new PhaserGame(config);

        game.registry.set("level_data", this.level_data);

        game.registry.set("utilities", {
            setBarValue: setBarValue
        });

    }

}