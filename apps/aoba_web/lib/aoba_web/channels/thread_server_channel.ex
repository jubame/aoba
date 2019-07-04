defmodule AobaWeb.ThreadServerChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer


  def join("threadserver:lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_thread", %{"type_and_content" => %{"type" => "text", "content" => content} , "entry_id" => entry_id}, socket) do



    with {:ok, pid} <- ThreadServerSupervisor.start_thread(%{type: "text", content: content}, entry_id),
         {:ok, ids} <- ThreadServer.get_ids(pid)
    do

      #Apex.ap(ids)
      broadcast! socket, "new_thread", %{type: "text", content: content, ids: Map.put(ids, "entry_id", entry_id)}
      {:reply, {:ok, ids}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end


  def handle_in("new_thread", %{"type_and_content" => %{"type" => "media", "content" => content}}, socket) do

    with {:ok, pid} <- ThreadServerSupervisor.start_thread(%{type: "media", content: content}),
         {:ok, ids} <- ThreadServer.get_ids(pid)
    do

      #Apex.ap(ids)
      {:reply, {:ok, ids}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end



  def handle_in("new_post", %{"thread_id" => thread_id, "entry_id" => entry_id, "type_and_content" => %{"type" => "text", "content" => content} = type_and_content}, socket) do

    IO.puts("//////////////////////////////////////////////////////////////////////////////////////////////////////////")

    with post_id <- ThreadServer.add_post(thread_id, entry_id, %{type: "text", content: content})
    do
      IO.puts("HEY KIDS! WANNA DIE!??")
      Apex.ap post_id
      {:reply, {:ok, %{post_id: post_id}}, socket}
    end


  end




  def handle_in("operation_to_body_entry", params, socket) do
    #IO.puts("append_to_body_entry")
    %{
      "action" => action,
      "thread_id" => thread_id,
      "post_id" => post_id,
      "entry_id" => entry_id,
      "iolist" => iolist,
      "close_entry" => close_entry,
      "close_post" => close_post
    } = params
    case ThreadServer.operation_to_body_entry(String.to_atom(action), thread_id, post_id, entry_id, iolist, close_entry, close_post) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end

  def handle_in("close_body_entry", params, socket) do
    #IO.puts("append_to_body_entry")
    %{"thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "close_post" => close_post} = params
    case ThreadServer.close_body_entry(thread_id, post_id, entry_id, close_post) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end



  def handle_in("add_media_to_post", params, socket) do
    %{"thread_id" => thread_id, "post_id" => post_id, "media" => media} = params
    case ThreadServer.add_media_to_post(thread_id, post_id, media) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        #Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end








end
