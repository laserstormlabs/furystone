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

builder.start_game()