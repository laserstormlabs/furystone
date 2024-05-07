import { AUTO as PHASER_TYPE_AUTO } from "phaser";

import { GameScene } from './game/scenes/GameScene';
import { UIScene } from './game/scenes/UIScene';
import { Game } from './game/Game';

// Leave 2 pixels for border on either side, to indicate window has focus
const GAME_WIDTH = window.innerWidth - 2;
const GAME_HEIGHT = window.innerHeight - 2;

const GAME_CONFIG = {
    type: PHASER_TYPE_AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1B1B1B',
    parent: 'game-container',
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
        fury_stones: [],
        map_name: 'empty',
        starting_point: { x: 50, y: 50 },
        show_intro: false,
        intro_content: [],
        player_max_magic: 100,
        player_max_health: 100,
        player_speed: 100,
        screen_shake_enabled: true
    }

    callbacks = {
        event: {},
        interval: {}
    }

    game;

    set_map(name) {
        this.level_data.map_name = name;
    }

    show_intro(value) {
        this.level_data.show_intro = value;
    }

    set_intro_content(lines) {
        this.level_data.intro_content = lines;
    }

    set_starting_point(x, y) {
        this.level_data.starting_point = { x, y };
    }

    set_interval(callback, ms) {
        if (typeof this.callbacks.interval[ms] === 'undefined') {
            this.callbacks.interval[ms] = [];
        }
        this.callbacks.interval[ms].push(callback);
    }

    set_player_max_magic(value) {
        this.level_data.player_max_magic = value;
    }

    set_player_max_health(value) {
        this.level_data.player_max_health = value;
    }

    set_player_speed(value) {
        this.level_data.player_speed = value;
    }

    disable_screen_shake() {
        this.level_data.screen_shake_enabled = false;
    }

    add_enemy(type, x, y) {
        this.level_data.enemies.push({
            type: type,
            position: { x, y }
        })
    }
    
    add_potion(color, x, y) {
        this.level_data.potions.push({
            color: color,
            position: { x, y }
        })
    }
    
    add_fury_stone(color, x, y) {
        this.level_data.fury_stones.push({
            color: color,
            position: { x, y }
        });
    }

    set_time_limit(seconds) {
        this.level_data.time_allowed = seconds;
    }

    handle_event(event_name, callback) {
        if (typeof this.callbacks.event[event_name] === 'undefined') {
            this.callbacks.event[event_name] = [];
        }
        this.callbacks.event[event_name].push(callback);
    }

    start_game() {

        this.handle_event("game_start", this.show_player_position);
        this.handle_event("player_move", this.show_player_position);

        this.game = new Game(GAME_CONFIG);

        this.game.registry.set("level_data", this.level_data);
        this.game.registry.set("callbacks", this.callbacks);

    }

    show_player_position(game) {
        var player_x = Math.floor(game.player.x)
        var player_y = Math.floor(game.player.y)
        var position = "x:"+ player_x + " y:" + player_y
    
        if (!game.has_text("player_position")) {
            var text_x = game.width - 120
            var text_y = game.height - 50
            game.add_text("player_position", text_x, text_y, position, 24)
        } else {
            game.update_text("player_position", position)
        }
    }

}