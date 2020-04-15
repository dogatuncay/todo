# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :todo,
  ecto_repos: [Todo.Repo]

# Configures the endpoint
config :todo, TodoWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "JUjk6CUE314k8VEuiWkl+0xAtXkquQvIg2mWWc4v9DlNXkWWKctx5xiIzzFJVHr1",
  render_errors: [view: TodoWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Todo.PubSub, adapter: Phoenix.PubSub.PG2],
  live_view: [signing_salt: "gQdE5oAM"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :guardian, Guardian,
  allowed_algos: ["HS512"],
  verify_module: Guardian.JWT,
  issuer: "Todo",
  ttl: { 30, :days},
  verify_issuer: true,
  secret_key: "Bleu",
  serializer: Todo.GuardianSerializer