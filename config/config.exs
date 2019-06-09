# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of Mix.Config.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
use Mix.Config

# Configure Mix tasks and generators
config :aoba,
  ecto_repos: [Aoba.Repo]

config :aoba_web,
  ecto_repos: [Aoba.Repo],
  generators: [context_app: :aoba]

# Configures the endpoint
config :aoba_web, AobaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "fb8Qc2RxS0Aa65w3rtrqVnJu5nCW4Nd0bz2q/2KY+l1JrPgK5TCs/eCJiBIilqvg",
  render_errors: [view: AobaWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: AobaWeb.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
