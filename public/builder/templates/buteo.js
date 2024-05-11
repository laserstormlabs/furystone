var builder = new GameBuilder()

builder.set_map("original")

builder.show_intro(false)

function player_collects_potion(game, potion) {
    if (game.is_over) {
        return
    }

    var player = game.player

    if (potion.color == "blue" && player.magic < player.max_magic) {
        potion.destroy()
        player.magic = player.magic + 10
        player.show_effect("power_up")
        game.update_magic_bar(player.magic)
    }

    if (potion.color == "red" && player.health < player.max_health) {
        potion.destroy()
        player.health = player.health + 10
        player.show_effect("power_up")
        game.update_health_bar(player.health)
    }

    if (potion.color == "green") {
        potion.destroy()
        player.speed = player.speed * 2
        player.show_effect("power_up")

        function back_to_normal_speed() {
            player.speed = player.speed/2
        }

        setTimeout(back_to_normal_speed, 5000)
    }

    if (potion.color == "silver") {
        potion.destroy()
        player.alpha = .5
        player.show_effect("power_up")
        
        for (var enemy of game.enemies) {
            enemy.can_see_player = false;
        }

        function visible_again() {
            player.alpha = 1
            for (var enemy of game.enemies) {
                enemy.can_see_player = true;
            }
        }

        setTimeout(visible_again, 5000)
    }
}

builder.handle_event("player_touches_potion", player_collects_potion);

function game_start(game) {

    var timer_x = game.width - 50
    var timer_y = 10
    var seconds_remaining = 600
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
        game.lose([
            "You are out of time.",
            "( Press 'ENTER' to try again )"
        ])
    }
}

builder.set_interval(update_timer, 1000);

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

function heavy_attack(game) {
    var player = game.player
    if (player.magic > 20 && !player.attacking) {
        player.attack("heavy")
        player.decrease_magic(20)
        game.update_magic_bar(player.magic)
    }
}
builder.handle_event("keydown-S", heavy_attack)

function player_gets_attacked(game, enemy) {
    var player = game.player
    var new_health = player.health - enemy.attack_damage
    player.health = new_health
    game.update_health_bar(player.health)
    player.show_effect("damage")

    if (enemy.name == "warlock") {
        player.decrease_magic(10)
        game.update_magic_bar(player.magic)
    }

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

function enemy_gets_attacked(game, enemy, attack) {
    enemy.is_stunned = true
    var new_health = enemy.health - attack.damage
    if (new_health < 0) {
        new_health = 0
    }
    enemy.health = new_health
    enemy.update_health_bar(enemy.health)
    attack.push_back(enemy, attack.pushback)

    if (enemy.name == "lizard_man" && enemy.health > 0) {
        var clone = game.add_enemy("lizard_man", enemy.x + 10, enemy.y - 10)
        clone.is_stunned = true;
        clone.set_velocity(enemy.velocity.x, enemy.velocity.y)
    }

}

builder.handle_event("enemy_gets_attacked", enemy_gets_attacked)

function player_attack_ends(game) {
    var player = game.player
    var found_blue_potion = false;
    for (var potion of game.potions) {
        if (potion.color == "blue") {
            found_blue_potion = true;
            break;
        }
    }
    if (game.fury_stones.length > 0 && player.magic == 0 && found_blue_potion == false) {
        game.lose([
            "Your magic is spent, and there are no blue potions left in the dungeon.",
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

function player_hits_stone(game, stone) {
    game.destroy_stone(stone);
    if (game.fury_stones.length === 0) {
        game.win(["You have done well."]);
    }
}
builder.handle_event("player_hits_stone", player_hits_stone)

builder.start_game()