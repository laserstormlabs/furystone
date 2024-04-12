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

    get magic() {
        return this.game_data.current_magic;
    }

    get health() {
        return this.game_data.current_health;
    }

    get attacking() {
        return this.game_data.is_attacking;
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
        this.scene.player_lose_health_sprite.setVisible(true);
        this.scene.player_lose_health_sprite.anims.play("player_lose_health");
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

    attack(type) {
        this.scene.startPlayerAttack(type);
    }

    get_magic_percentage() {
        return this.game_data.current_magic/this.game_data.max_magic;
    }

}