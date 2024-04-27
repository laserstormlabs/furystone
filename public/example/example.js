import { GameBuilder } from '../builder/viewer/gamebuilder.min.js';

/* Create the GameBuilder object and store it in a variable */

var builder = new GameBuilder()

/* Set the map to use */

builder.set_map("original")

/* Show intro screen */

builder.show_intro(true)

/* Set intro content */

builder.set_intro_content([
    "Within this dungeon is a Fury Stone: an ancient, cursed relic that gives life to monsters. You must destroy it.",
    "The monsters will descend upon you when they sense your presence. Fend them off with your attacks, but do not let your Magic run too low, or you will be helpless.",
    "Potions will restore your Magic or help you in other ways. Collect any you can find.",
    "Find the Fury Stone, and use your Magic to shatter it!",
    "( Move with arrow keys )",
    "( Press 'A' for light attack, 'S' for heavy attack )",
    "( Press 'Enter' to begin )"
])

builder.set_starting_point(50, 130)

/* Add enemies to the level */

builder.add_enemy("zombie_tiny", 530, 150)
builder.add_enemy("warlock", 380, 170)
builder.add_enemy("zombie_large", 650, 310)
builder.add_enemy("chomper_small", 750, 350)
builder.add_enemy("lizard_man", 550, 390)
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
    //builder.add_enemy("skeleton", enemy_x, 120)
    enemy_x += 20
}

/* Add potions to the level */

builder.add_potion("blue", 531, 73)
builder.add_potion("blue", 945, 204)
builder.add_potion("blue", 976, 832)

builder.add_potion("green", 212, 492)

builder.add_potion("silver", 752, 411)

/* Add event handler for collecting potion */

function player_collects_potion(game, potion) {
    if (game.is_over) {
        return
    }

    var player = game.player

    /* Have blue potion restore magic */
    if (potion.color == "blue" && player.magic < player.max_magic) {
        potion.destroy()
        player.increase_magic(10)
        game.update_magic_bar(player.magic)
    }

    /* Have green potion increase speed temporarily */
    if (potion.color == "green") {
        potion.destroy()
        player.speed = player.speed * 2
        setTimeout(function() {
            player.speed = player.speed/2
        }, 5000)
    }

    /* Have silver potion make player invisible temporarily */
    if (potion.color == "silver") {
        potion.destroy()
        player.alpha = .5
        
        for (var enemy of game.enemies) {
            enemy.can_see_player = false;
        }

        setTimeout(function() {
            player.alpha = 1
            for (var enemy of game.enemies) {
                enemy.can_see_player = true;
            }
        }, 5000)
    }
}

builder.handle_event("player_collects_potion", player_collects_potion);

/* Set the location of the target (Fury Stone) */

var target_x = 628
var target_y = 1208

builder.set_target_location(target_x, target_y)

/* Put two enemies on either side of the target */

builder.add_enemy("chomper_large", target_x - 100, target_y)
builder.add_enemy("chomper_large", target_x + 100, target_y)

function game_start(game) {

    /* Set a time limit */

    var timer_x = game.width - 50
    var timer_y = 10
    var seconds_remaining = 60
    game.set_data("seconds_remaining", seconds_remaining)
    game.add_text("timer", timer_x, timer_y, seconds_remaining, 32)

}

builder.handle_event("game_start", game_start);

/* Update the time remaining every second */

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
        game.lose([
            "You are out of time.",
            "( Press 'ENTER' to try again )"
        ])
    }
}

builder.set_interval(update_timer, 1000);

/* Add event handler for light attack */

function light_attack(game) {
    var player = game.player
    if (player.magic >= 10 && !player.attacking) {
        player.attack("light")
        var new_magic = player.magic - 10
        player.magic = new_magic
        game.update_magic_bar(player.magic)
    }
}
builder.handle_event("keydown-A", light_attack)

/* Add event handler for heavy attack */

function heavy_attack(game) {
    var player = game.player
    if (player.magic > 20 && !player.attacking) {
        player.attack("heavy")
        player.decrease_magic(20)
        game.update_magic_bar(player.magic)
    }
}
builder.handle_event("keydown-S", heavy_attack)

/* Event handler for player getting attacked */

function player_gets_attacked(game, enemy) {
    var player = game.player
    var new_health = player.health - enemy.attack_damage
    player.health = new_health
    game.update_health_bar(player.health)
    player.show_effect("damage")

    /* Have "warlock" enemy steal magic from player */
    if (enemy.name == "warlock") {
        player.decrease_magic(10)
        game.update_magic_bar(player.magic)
    }

    /* Have "swampy" enemy slow player down temporarily */
    if (enemy.name == "swampy") {
        player.speed = player.speed/2
        setTimeout(function() { 
            player.speed = player.speed * 2 
        }, 5000)
    }

    if (player.health == 0) {
        game.lose([
            "The monsters have bested you.",
            "( Press 'ENTER' to try again )"
        ])
    }
}
builder.handle_event("player_gets_attacked", player_gets_attacked)

/* Event handler for enemy getting attacked */

function enemy_gets_attacked(game, enemy, attack) {
    enemy.is_stunned = true
    var new_health = enemy.health - attack.damage
    if (new_health < 0) {
        new_health = 0
    }
    enemy.health = new_health
    enemy.update_health_bar(enemy.health)
    attack.push_back(enemy, attack.pushback)

    /* Clone lizard man enemy when it is hit */
    if (enemy.name == "lizard_man" && enemy.health > 0) {
        var clone = game.add_enemy("lizard_man", enemy.x + 10, enemy.y - 10)
        // Omit this first to demonstrate bug
        clone.is_stunned = true;
        clone.set_velocity(enemy.velocity.x, enemy.velocity.y)
    }

}

builder.handle_event("enemy_gets_attacked", enemy_gets_attacked)

/* Event handler for end of player attack */

function player_attack_ends(game) {
    var player = game.player
    var potions_left = game.potions.length;
    if (!game.stone_destroyed && player.magic === 0 && potions_left === 0) {
        game.lose([
            "Your magic is spent, and there are no potions left in the dungeon.",
            "( Press 'ENTER' to try again )"
        ])
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

/* Event handler for player destroying the Fury Stone */
//let hit_count = 0;
function player_hits_stone(game) {
    //hit_count++;
    //if (hit_count == 3) {
        game.destroy_stone();
        game.win(["You have done well."]);
    //}
}
builder.handle_event("player_hits_stone", player_hits_stone)

/* Start the game */

builder.start_game()