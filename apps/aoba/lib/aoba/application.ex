defmodule Aoba.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false


  use Application

  def start(_type, _args) do
    children = [
      {Registry, keys: :unique, name: Registry.ThreadServer},
      Aoba.ThreadServerSupervisor,
      Aoba.Repo
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Aoba.Supervisor)
  end
end
