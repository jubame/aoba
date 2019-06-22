defmodule Aoba.ThreadServer do
  use GenServer, restart: :transient
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link([id: id, content: content, entry_id: entry_id]) do
    IO.puts(inspect(id))
    Apex.ap content
    IO.puts('HOLA')
    resultado = GenServer.start_link(__MODULE__, [id: id, content: content, entry_id: entry_id], name: via_tuple(id))
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

  def add_media_to_post(thread_id, post_id, media) do
    GenServer.call(via_tuple(thread_id), {:add_media_to_post, post_id, media})
  end



  def init([id: id, content: content, entry_id: entry_id]) do
    IO.puts("creando nuevo hilo")
    {:ok, Thread.new(
      id,
      content,
      entry_id

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

    case update_entry(thread, post_id, entry_id, iolist) do
      {:ok, thread} ->
        reply_success(thread, :ok)
      :error ->
        {:reply, :error, thread}
      {:error, :already_closed_entry} ->
        {:reply, {:error, :already_closed_entry}, thread}
    end

  end

  defp update_entry(thread, post_id, entry_id, iolist) do

    current_body = thread.posts[post_id].body
    case Body.add_or_edit_entry(current_body, entry_id, iolist) do
      {:ok, new_body } ->
        {:ok, update_in(thread.posts[post_id].body, fn _body -> new_body end)}
      {:error, :already_closed_entry} -> {:error, :already_closed_entry}
    end
  end

  def handle_call({:add_media_to_post, post_id, media}, _from, thread) do
    IO.puts(":add_media_to_post")
    case Post.add_media(thread.posts[post_id], media) do
      {:ok, new_post} ->
        update_in(thread.posts[post_id], fn _post -> new_post end)
        |> reply_success(:ok)

    end
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


