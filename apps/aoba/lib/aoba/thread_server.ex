defmodule Aoba.ThreadServer do
  use GenServer
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link(content) do
    id = {DateTime.utc_now(), Node.self()}
    GenServer.start_link(__MODULE__, content, name: via_tuple(id))
  end

  def via_tuple(name), do: {:via, Registry, {Registry.Game, name}}


  def init(content) do
    {:ok, Thread.new(
      {DateTime.utc_now(), Node.self()},
      content

      )
    }
  end

  @docp """
  iex(4)> {:ok, pid} = ThreadServer.start_link("asdf")
  {:ok, #PID<0.244.0>}
  iex(5)> :sys.get_state(pid)
  %Aoba.Thread{
    post_id: 2,
    posts: %{
      1 => %Aoba.Post{
        body: %Aoba.Body{auto_id: 2, entries: %{1 => "asdf"}},
        date: #DateTime<2019-06-13 14:52:22.747655Z>,
        id: 1,
        media: "",
        username: "anon"
      }
    },
    thread_id: {#DateTime<2019-06-13 14:52:22.747641Z>, :nonode@nohost}
  }
  """


end


