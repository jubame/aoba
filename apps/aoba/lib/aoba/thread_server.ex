defmodule Aoba.ThreadServer do
  use GenServer, restart: :transient
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link([id: id, type_and_content: %{type: "text", content: content}, entry_id: entry_id]) do
    IO.puts(inspect(id))

    IO.puts('HOLA')
    resultado = GenServer.start_link(__MODULE__, [id: id, type_and_content: %{type: "text", content: content}, entry_id: entry_id], name: via_tuple(id))
    IO.puts(inspect(resultado))
    resultado
  end

  def start_link([id: id, type_and_content: %{type: "media", content: content}]) do
    IO.puts(inspect(id))

    IO.puts('HOLA')
    resultado = GenServer.start_link(__MODULE__, [id: id, type_and_content: %{type: "media", content: content}], name: via_tuple(id))
    IO.puts(inspect(resultado))
    resultado
  end

  def via_tuple(name), do: {:via, Registry, {Registry.ThreadServer, name}}


  def get_ids(thread_server) do
    GenServer.call(thread_server, :get_ids)
  end

  def operation_to_body_entry(action, thread_id, post_id, entry_id, iolist) do
    GenServer.call(via_tuple(thread_id), {:operation_to_body_entry, action, post_id, entry_id, iolist})
  end

  def close_body_entry(thread_id, post_id, entry_id) do
    GenServer.call(via_tuple(thread_id), {:close_body_entry, post_id, entry_id})
  end


  def add_media_to_post(thread_id, post_id, media) do
    GenServer.call(via_tuple(thread_id), {:add_media_to_post, post_id, media})
  end



  def init([id: id, type_and_content: %{type: "text", content: content}, entry_id: entry_id]) do
    IO.puts("creando nuevo hilo")
    {:ok, Thread.new(
      id,
      %{type: "text", content: content},
      entry_id

      )
    }
  end

  def init([id: id, type_and_content: %{type: "media", content: content}]) do
    IO.puts("creando nuevo hilo")
    {:ok, Thread.new(
      id,
      %{type: "media", content: content}
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

  def handle_call({:operation_to_body_entry, action, post_id, entry_id, iolist}, _from, thread) do

    current_body = thread.posts[post_id].body
    case Body.operation_entry(action, current_body, entry_id, iolist) do
      {:ok, new_body } ->
        update_in(thread.posts[post_id].body, fn _body -> new_body end)
        |> reply_success(:ok)
      {:error, :already_closed_entry} ->
        {:reply, {:error, :already_closed_entry}, thread}
    end

  end

  def handle_call({:close_body_entry, post_id, entry_id}, _from, thread) do

    current_body = thread.posts[post_id].body
    case Body.close_entry(current_body, entry_id) do
      {:ok, new_body} ->
        update_in(thread.posts[post_id].body, fn _body -> new_body end)
        |> reply_success(:ok)
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


