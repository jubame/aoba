defmodule Aoba.ThreadServer do
  use GenServer
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link() do
    id = {DateTime.utc_now(), Node.self()}
    GenServer.start_link(__MODULE__, id, name: via_tuple(id))
  end

  def via_tuple(name), do: {:via, Registry, {Registry.Game, name}}


  def init(name) do
    {:ok, Thread.new(
      {DateTime.utc_now(), Node.self()}
      )
    }
  end


end
