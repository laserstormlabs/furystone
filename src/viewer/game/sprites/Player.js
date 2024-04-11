import { Physics } from 'phaser';

export class Player extends Physics.Arcade.Sprite {

    game_data = {};

    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            "player_idle"
        );
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
    }

    increase_magic(increment) {
        this.game_data.current_magic = Math.min(
            this.game_data.current_magic + increment,
            this.game_data.max_magic
        );
    }

    decrease_magic(decrement) {
        this.game_data.current_magic = Math.max(
            this.game_data.current_magic - decrement,
            0
        );
    }

    get_magic_percentage() {
        return this.game_data.current_magic/this.game_data.max_magic;
    }

}