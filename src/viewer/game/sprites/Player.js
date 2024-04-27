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

        this.setPushable(false);
        this.game_data = {
            max_health: 500,
            current_health: 500,
            max_magic: 1000,
            current_magic: 1000,
            last_horizontal_direction: 'right',
            movement_speed: 300
        }
        this.name = "player";
        this.setBodySize(26, 28);
        this.setOffset(3, 7);
        this.setActive(false).setVisible(false);
    }

    get magic() {
        return this.game_data.current_magic;
    }

    set magic(value) {
        this.game_data.current_magic = Math.max(value, 0);
    }

    get max_magic() {
        return this.game_data.max_magic;
    }

    get health() {
        return this.game_data.current_health;
    }

    set health(value) {
        this.game_data.current_health = Math.max(value, 0);
    }

    get attacking() {
        return this.game_data.is_attacking;
    }

    get speed() {
        return this.game_data.movement_speed;
    }

    set speed(value) {
        this.game_data.movement_speed = value;
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

    show_effect(type) {
        if (type === "damage") {
            this.scene.player_lose_health_sprite.setVisible(true);
            this.scene.player_lose_health_sprite.anims.play("player_lose_health");
        }
        if (type === "power_up") {
            this.scene.player_gain_magic_sprite.setVisible(true);
            this.scene.player_gain_magic_sprite.anims.play("player_gain_magic");
        }
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