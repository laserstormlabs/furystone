var builder = new GameBuilder()
builder.set_map("skull")
builder.set_starting_point(400, 200)
builder.add_enemy("ogre", 200, 100)

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
}
builder.handle_event("player_gets_attacked", player_gets_attacked)

builder.start_game()