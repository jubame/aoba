defmodule AobaWeb.ThreadServerChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer
  @max_age 2 * 7 * 24 * 60 * 60




  # each user’s conversation on a topic has its own isolated, dedicated process.
  '''
  Recuerda: no confundir:
    %{"token" => token}
    %{token: token}
  '''
  def join("threadserver:" <> thread_id, %{"token" => token}, socket) do
    IO.puts(socket.id)

    case Phoenix.Token.verify(socket, "aoba_namespace", token, max_age: @max_age) do
      {:ok, tracking_id} ->
        {:ok, assign(socket, :tracking_id, tracking_id)}
      {:error, _reason} ->
        {:error, %{reason: "unauthorized"}}
    end

  end



  def handle_in("new_post", params, socket) do

    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{
      "thread_id" => thread_id
    } = params

    with post_id <- ThreadServer.add_post(thread_id)
    do
      #IO.puts("HEY KIDS! WANNA DIE!??")
      #Apex.ap post_id
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
      "close_post" => close_post,
    } = params


    reply_to = if Map.has_key?(params, "reply_to") do
      reply_to = params["reply_to"]
      reply_to = %{post_id: post_id, entry_id: entry_id}
    else
      reply_to = nil
    end



    #Apex.ap params

    case ThreadServer.operation_to_body_entry(String.to_atom(action), thread_id, post_id, entry_id, iolist, close_entry, close_post, reply_to) do
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
      :ok ->
        broadcast_from! socket, "close_body_entry", params
        {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end


  def handle_in("close_post", params, socket) do
    #IO.puts("append_to_body_entry")
    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{"thread_id" => thread_id, "post_id" => post_id} = params
    case ThreadServer.close_post(thread_id, post_id) do
      :ok ->
        broadcast_from! socket, "close_post", params
        {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end



  def handle_in("add_media_to_post", params, socket) do
    params = %{params | "thread_id" => Kernel.trunc(params["thread_id"])}
    %{"thread_id" => thread_id, "post_id" => post_id, "media" => media} = params
    case ThreadServer.add_media_to_post(thread_id, post_id, media) do
      :ok ->
        broadcast_from! socket, "add_media_to_post", params
        {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end








end
