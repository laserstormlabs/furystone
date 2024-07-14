var builder = new GameBuilder()
builder.set_map("rectangle")
builder.set_starting_point(100, 75)
builder.add_enemy("chomper_small", 150, 300)

function light_attack(game) {
  var player = game.player
  if (player.magic >= 10) {
    player.attack("light")
    var new_magic = player.magic - 10
    player.magic = new_magic
    game.update_magic_bar(player.magic)
  }
}
builder.handle_event("keydown-A", light_attack)

function enemy_gets_attacked(game, enemy, attack) {
  var new_health = enemy.health - 5
  enemy.health = new_health
  enemy.update_health_bar(enemy.health)
  attack.push_back(enemy, 250)
}
builder.handle_event("enemy_gets_attacked", enemy_gets_attacked)

function player_gets_attacked(game, enemy) {
  var player = game.player
  var new_health = player.health - enemy.attack_damage
  player.health = new_health
  game.update_health_bar(player.health)
  player.show_effect("damage")
  if (player.health == 0) {
    var lines = [
      "The monsters have beaten you.",
      "Press ENTER to try again."
    ]
    game.lose(lines)
  }
}
builder.handle_event("player_gets_attacked", player_gets_attacked)

function player_attack_ends(game) {
  for (var enemy of game.enemies) {
    if (enemy.health == 0) {
      enemy.die()
    }
  }
}
builder.handle_event("player_attack_ends", player_attack_ends)

builder.add_fury_stone("green", 450, 250)

function player_hits_stone(game, stone) {
  game.destroy_stone(stone)
  if (game.fury_stones.length == 0) {
    var lines = [
      "You have done well.",
      "Press ENTER to play again."
    ]
    game.win(lines)
  }
}
builder.handle_event("player_hits_stone", player_hits_stone)

builder.add_potion("blue", 100, 150)
builder.add_potion("green", 200, 150)
builder.add_potion("red", 150, 150)
builder.add_potion("silver", 250, 150)

function player_collects_potion(game, potion) {
  var player = game.player
  if (potion.color == "blue") {
    potion.destroy()
    player.magic = player.magic + 10
    game.update_magic_bar(player.magic)
  }
  if (potion.color == "red") {
    potion.destroy()
    player.health = player.health + 10
    game.update_health_bar(player.health)
  }
  if (potion.color == "green") {
    potion.destroy()
    player.speed = player.speed * 2

    function back_to_normal_speed() {
      player.speed = player.speed / 2
    }

    setTimeout(back_to_normal_speed, 5000)
  }
  if (potion.color == "silver") {
    potion.destroy()
    player.alpha = 0.5
    for (var enemy of game.enemies) {
      enemy.can_see_player = false
    }
    function visible_again() {
      player.alpha = 1
      for (var enemy of game.enemies) {
        enemy.can_see_player = true
      }
    }
    setTimeout(visible_again, 5000)
  }
}
builder.handle_event("player_touches_potion", player_collects_potion)

builder.start_game()