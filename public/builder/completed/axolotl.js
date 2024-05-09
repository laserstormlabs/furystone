var builder = new GameBuilder()

builder.set_map("rectangle")

builder.set_starting_point(50, 100)

builder.add_enemy("skeleton", 200, 150)

builder.start_game()