defmodule AobaWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :aoba_web

  # https://elixirforum.com/t/phoenix-socket-channels-security-ip-identification/1463/4
  socket "/socket", AobaWeb.UserSocket,
    websocket: [
      serializer: [{AobaWeb.MsgpaxSerializer, "~> 2.0.0"}],
      # https://elixirforum.com/t/phoenix-socket-channels-security-ip-identification/1463/4
      connect_info: [:peer_data, :x_headers]
    ],
    longpoll: false

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :aoba_web,
    gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug Plug.Session,
    store: :cookie,
    key: "_aoba_web_key",
    signing_salt: "5XfQjtXw"

  plug AobaWeb.Router
end
