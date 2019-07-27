defmodule Aoba.ThreadServer do
  use GenServer, restart: :transient
  alias Aoba.{Thread, Post, Body, Reply}

  def start_link([id: id]) do

    resultado = GenServer.start_link(__MODULE__, [id: id], name: via_tuple(id))
    resultado
  end

  def start_link([id: id, type_and_content: %{type: "media", content: content}]) do

    resultado = GenServer.start_link(__MODULE__, [id: id, type_and_content: %{type: "media", content: content}], name: via_tuple(id))
    resultado
  end

  def via_tuple(name), do: {:via, Registry, {Registry.ThreadServer, name}}


  def get_ids(thread_server) do
    GenServer.call(thread_server, :get_ids)
  end

  def operation_to_body_entry(action, thread_id, post_id, entry_id, iolist, close_entry, close_post, reply_to) do
    GenServer.call(via_tuple(thread_id), {:operation_to_body_entry, action, post_id, entry_id, iolist, close_entry, close_post, reply_to})
  end

  def close_body_entry(thread_id, post_id, entry_id, close_post) do
    GenServer.call(via_tuple(thread_id), {:close_body_entry, post_id, entry_id, close_post})
  end

  def close_post(thread_id, post_id) do
    GenServer.call(via_tuple(thread_id), {:close_post, post_id})
  end


  def add_media_to_post(thread_id, post_id, media) do
    GenServer.call(via_tuple(thread_id), {:add_media_to_post, post_id, media})
  end

  def add_post(thread_id) do
    GenServer.call(via_tuple(thread_id), :add_post)
  end



  def init([id: id]) do
    {:ok, Thread.new(
      id

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


  def handle_call(:add_post, _from, thread) do


    thread = Thread.add_post(
      thread
    )

    #raise Exception


    reply_success(thread, thread.post_id - 1)
  end





  def handle_call({:operation_to_body_entry, action, post_id, entry_id, iolist, close_entry, close_post, reply_to}, _from, thread) do

    case operation_to_body_entry_check_post(thread, action, thread.posts[post_id], entry_id, iolist, close_entry, close_post, reply_to) do
      {:ok, new_thread} ->
        reply_success(new_thread, :ok)
      {:error, :already_closed_post} ->
        {:reply, {:error, :already_closed_post}, thread}
      {:error, :already_closed_entry} ->
        {:reply, {:error, :already_closed_entry}, thread}

    end



  end

  defp operation_to_body_entry_check_post(_thread, _action, %Post{closed: true} = _post, _entry_id, _iolist, _close_entry, _close_post, _reply_to) do
    {:error, :already_closed_post}
  end

  defp operation_to_body_entry_check_post(thread, action, %Post{closed: false} = post, entry_id, iolist, close_entry, close_post, reply_to) do
    case Body.operation_entry(action, post.body, entry_id, iolist, close_entry, reply_to) do
      {:ok, new_body} ->
        new_thread = if close_post do
          update_in(thread.posts[post.id], fn post -> Post.close(post, new_body) end)
        else
          update_in(thread.posts[post.id].body, fn _body -> new_body end)
        end
        {:ok, new_thread}
      {:error, :already_closed_entry} ->
        {:error, :already_closed_entry}

    end
  end


  def handle_call({:close_body_entry, post_id, entry_id, close_post}, _from, thread) do

    case close_body_entry_check_post(thread, thread.posts[post_id], entry_id, close_post) do
      {:ok, new_thread } ->
        reply_success(new_thread, :ok)
      {:error, :already_closed_post} ->
        {:reply, {:error, :already_closed_post}, thread}
    end

  end


  def handle_call({:close_post, post_id}, _from, thread) do
    IO.puts('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')

    Apex.ap thread

    Apex.ap post_id

    case Thread.close_post(thread, post_id) do
      {:ok, new_thread } ->
        reply_success(new_thread, :ok)
    end

  end


  def close_body_entry_check_post(_thread, %Post{closed: true}, _entry_id, _close_post) do
    {:error, :already_closed_post}
  end


  def close_body_entry_check_post(thread, %Post{closed: false} = post, _entry_id, true) do

    {
      :ok,
      update_in(thread.posts[post.id], fn post -> Post.close(post) end)
    }



  end

  def close_body_entry_check_post(thread, %Post{closed: false} = post, entry_id, false) do

    {:ok, new_body} = Body.close_entry(thread.posts[post.id].body, entry_id)
    {
      :ok,
      update_in(thread.posts[post.id].body, fn _body -> new_body end)
    }



  end







  def handle_call({:add_media_to_post, post_id, media}, _from, thread) do
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


