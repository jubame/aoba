defmodule Aoba.ThreadServer do
  use GenServer, restart: :transient
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link([id: id, content: content]) do
    IO.puts(inspect(id))
    Apex.ap content
    IO.puts('HOLA')
    resultado = GenServer.start_link(__MODULE__, [id: id, content: content], name: via_tuple(id))
    IO.puts(inspect(resultado))
    resultado
  end

  def via_tuple(name), do: {:via, Registry, {Registry.ThreadServer, name}}


  def get_ids(thread_server) do
    GenServer.call(thread_server, :get_ids)
  end

  def append_to_body_entry(thread_id, post_id, entry_id, iolist) do
    GenServer.call(via_tuple(thread_id), {:append_to_body_entry, post_id, entry_id, iolist})

  end



  def init([id: id, content: content]) do
    IO.puts("creando nuevo hilo")
    {:ok, Thread.new(
      id,
      content

      )
    }
  end



  def handle_call(:get_ids, _from, thread) do
    {:reply,
      {:ok,
      %{thread_id: thread.thread_id, post_id: thread.post_id - 1}
      },
      thread
    }
  end

  def handle_call({:append_to_body_entry, post_id, entry_id, iolist}, _from, thread) do
    update_in(thread.posts[post_id].body.entries[entry_id], fn entry ->
      IO.iodata_to_binary([entry, " ", iolist])
    end)
    |> reply_success(:ok)

  end


  defp reply_success(state_data, reply) do
    {:reply, reply, state_data}
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


