import { Physics } from 'phaser';

export class Enemy extends Physics.Arcade.Sprite {

    game_data = {};

    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            config.type + "_idle"
        );
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
    }

    get health() {
        return this.game_data.current_health;
    }

    increase_health(increment) {
        this.game_data.current_health = Math.min(
            this.game_data.current_health + increment,
            this.game_data.max_health
        );
    }

    decrease_health(decrement) {
        this.game_data.current_health = Math.max(
            this.game_data.current_health - decrement,
            0
        );
    }

}