import { AUTO as PHASER_TYPE_AUTO } from "phaser";

import { GameScene } from './game/scenes/GameScene';
import { UIScene } from './game/scenes/UIScene';
import { Game } from './game/Game';

const GAME_CONFIG = {
    type: PHASER_TYPE_AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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

export class GameBuilder {

    level_data = {
        enemies: [],
        potions: [],
        time_allowed: 300,
        target_location: null
    }

    callbacks = {}

    game;

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

    set_time_limit(seconds) {
        this.level_data.time_allowed = seconds;
    }

    handle_event(event_name, callback) {
        this.callbacks[event_name] = callback;
    }

    start_game() {

        this.game = new Game(GAME_CONFIG);

        this.game.registry.set("level_data", this.level_data);
        this.game.registry.set("callbacks", this.callbacks);

    }

}