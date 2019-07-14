defmodule AobaWeb.ThreadServerChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer


  def join("threadserver:lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_thread", _params, socket) do
    with {:ok, pid} <- ThreadServerSupervisor.start_thread(),
         {:ok,  ids=%{thread_id: _thread_id}} <- ThreadServer.get_ids(pid)
    do

      Apex.ap(ids)
      '''
      https://www.reddit.com/r/elixir/comments/4t6k6w/phoenix_what_is_the_difference_between_broadcast/d5f1ijm?utm_source=share&utm_medium=web2x
      broadcast sends an event to all clients that are in the channel that you're handling right now
      broadcast_from does the same as broadcast but does not send to the client that sent you the message you're handling right now
      push only sends the message to the client you pass it
      '''

      broadcast_from! socket, "new_thread", ids
      {:reply, {:ok, ids}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("new_post", params, socket) do

    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{
      "thread_id" => thread_id
    } = params

    with post_id <- ThreadServer.add_post(thread_id)
    do
      IO.puts("HEY KIDS! WANNA DIE!??")
      Apex.ap post_id
      {:reply, {:ok, %{post_id: post_id}}, socket}
    end

  end








  def handle_in("operation_to_body_entry", params, socket) do
    #IO.puts("append_to_body_entry")



    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{
      "action" => action,
      "thread_id" => thread_id,
      "post_id" => post_id,
      "entry_id" => entry_id,
      "iolist" => iolist,
      "close_entry" => close_entry,
      "close_post" => close_post
    } = params
    Apex.ap params
    case ThreadServer.operation_to_body_entry(String.to_atom(action), thread_id, post_id, entry_id, iolist, close_entry, close_post) do
      :ok ->
        broadcast_from! socket, "operation_to_body_entry", params
        {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end

  def handle_in("close_body_entry", params, socket) do
    #IO.puts("append_to_body_entry")
    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{"thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "close_post" => close_post} = params
    case ThreadServer.close_body_entry(thread_id, post_id, entry_id, close_post) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end



  def handle_in("add_media_to_post", params, socket) do
    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{"thread_id" => thread_id, "post_id" => post_id, "media" => media} = params
    case ThreadServer.add_media_to_post(thread_id, post_id, media) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end








end
