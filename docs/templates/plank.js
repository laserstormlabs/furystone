var builder = new GameBuilder()
builder.set_map("skull")
builder.set_starting_point(400, 200)
builder.add_enemy("ogre", 200, 100)
builder.start_game()