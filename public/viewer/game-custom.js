import { GameBuilder } from './gamebuilder.min.js';

/* Create the GameBuilder object and store it in a variable */

var builder = new GameBuilder()

/* Add enemies to the level */

builder.add_enemy("zombie_tiny", 530, 150)
builder.add_enemy("warlock", 380, 170)
builder.add_enemy("zombie_large", 650, 310)
builder.add_enemy("chomper_small", 750, 350)
builder.add_enemy("swampy", 550, 390)
builder.add_enemy("skeleton", 550, 450)
builder.add_enemy("lizard_man", 250, 690)
builder.add_enemy("ogre", 850, 250)
builder.add_enemy("masked_orc", 900, 250)
builder.add_enemy("zombie_ice", 950, 270)
builder.add_enemy("chomper_small", 300, 540)
builder.add_enemy("zombie_large", 350, 520)
builder.add_enemy("zombie_large", 500, 818)

builder.add_enemy("chomper_tiny", 608, 768)
builder.add_enemy("chomper_tiny", 658, 768)
builder.add_enemy("chomper_tiny", 558, 768)

builder.add_enemy("chomper_tiny", 608, 818)
builder.add_enemy("chomper_tiny", 658, 818)
builder.add_enemy("chomper_tiny", 558, 818)

/* Add multiple enemies with loop */

var enemy_x = 400
while (enemy_x < 500) {
    builder.add_enemy("skeleton", enemy_x, 120)
    enemy_x += 20
}

/* Set the location of the target (Fury Stone) */

var target_x = 628
var target_y = 1208

builder.set_target_location(target_x, target_y)

/* Put two enemies on either side of the target */

builder.add_enemy("chomper_large", target_x - 100, target_y)
builder.add_enemy("chomper_large", target_x + 100, target_y)

/* Set the time limit (in seconds) */

function game_start(game) {
    var timer_x = game.width - 50
    var timer_y = 10
    var seconds_remaining = 60
    game.set_data("seconds_remaining", seconds_remaining)
    game.add_text("timer", timer_x, timer_y, seconds_remaining, 32)
}

builder.handle_event("game_start", game_start);

function update_timer(game) {
    var seconds_remaining = game.get_data("seconds_remaining")
    seconds_remaining -= 1
    game.set_data("seconds_remaining", seconds_remaining)
    game.update_text("timer", seconds_remaining)
    if (seconds_remaining < 10) {
        game.update_text_color("timer", "red")
    }
    if (seconds_remaining === 0) {
        var player = game.player
        player.decrease_health(player.health)
        game.update_health_bar(0)
        game.lose("out_of_time")
    }
}

builder.set_interval(update_timer, 1000);

/* Add event handler for light attack */

function light_attack(game) {
    var player = game.player
    if (player.magic > 0 && !player.attacking) {
        player.attack("light")
        player.decrease_magic(10)
        game.update_magic_bar(player.magic)
    }
}
builder.handle_event("keydown-A", light_attack)

/* Add event handler for heavy attack */

function heavy_attack(game) {
    var player = game.player
    if (player.magic > 0 && !player.attacking) {
        player.attack("heavy")
        player.decrease_magic(20)
        game.update_magic_bar(player.magic)
    }
}
builder.handle_event("keydown-S", heavy_attack)

/* Event handler for player getting attacked */

function player_gets_attacked(game, enemy) {
    var player = game.player
    player.decrease_health(enemy.attack_damage)
    game.update_health_bar(player.health)
    if (player.health === 0) {
        game.lose("out_of_health")
    }
}
builder.handle_event("player_gets_attacked", player_gets_attacked)

/* Event handler for enemy getting attacked */

function enemy_gets_attacked(game, enemy, attack) {
    enemy.is_stunned = true
    enemy.decrease_health(attack.damage)
    enemy.update_health_bar(enemy.health)
    attack.push_back(enemy, attack.pushback)
}

builder.handle_event("enemy_gets_attacked", enemy_gets_attacked)

function player_attack_ends(game) {
    var player = game.player
    if (!game.stone_destroyed && player.magic === 0) {
        game.lose("out_of_magic")
    }
    for (var enemy of game.enemies) {
        if (enemy.health === 0) {
            enemy.die()
        } else {
            enemy.is_stunned = false
        }
    }
}
builder.handle_event("player_attack_ends", player_attack_ends)

/* Start the game */

builder.start_game()