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

    get attack_damage() {
        return this.game_data.attack_damage;
    }

    set is_stunned(value) {
        this.game_data.damaged_by_current_attack = value;
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

    update_health_bar(new_value) {
        this.scene.setEnemyHealthBarValue(
            this.game_data.health_bar,
            new_value/this.game_data.max_health
        );
    }

    die() {
        this.game_data.is_dying = true;
        this.anims.play(this.name + '_death', true);
        this.body.setVelocity(0);
        setTimeout(() => {
            this.scene.enemyDies(this);
        }, 1000);
    }

}