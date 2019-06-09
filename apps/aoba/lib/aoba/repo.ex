defmodule Aoba.Repo do
  use Ecto.Repo,
    otp_app: :aoba,
    adapter: Ecto.Adapters.Postgres
end
