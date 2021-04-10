# Aoba.Umbrella
Realtime/live imageboard. Toy project for me to learn Elixir.

[![Two browsers side by side showing a live realtime thread](https://riru-re.b-cdn.net/wp-content/uploads/aoba_image_32-768x480.jpg)](https://riru-re.b-cdn.net/wp-content/uploads/aoba_image_32.jpg)



Set up the project with:
```
cd aoba
mix deps.get
cd apps/aoba_web/assets
npm install
cd ../../..
```

Then, to run interactively:
```
iex --name "1@localhost" -S mix phx.server
```

or non interactively:
```
elixir --name "1@localhost" -S mix phx.server
```

A web interface should be accessible in `http://localhost:4000/`. Click
Board on the left panel and then New Thread.

Copy the thread ID URL (`http://localhost:4000/#/board/thread/<thread_id>`)
to another browser window. Write a new reply. The other browser window
should update.