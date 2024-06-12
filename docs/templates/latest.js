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

builder.start_game()