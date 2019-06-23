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

      Apex.ap(ids)
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

      Apex.ap(ids)
      {:reply, {:ok, ids}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end




  def handle_in("operation_to_body_entry", params, socket) do
    IO.puts("append_to_body_entry")
    %{"action" => action, "thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "iolist" => iolist} = params
    case ThreadServer.operation_to_body_entry(String.to_atom(action), thread_id, post_id, entry_id, iolist) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end

  end

  def handle_in("add_media_to_post", params, socket) do
    %{"thread_id" => thread_id, "post_id" => post_id, "media" => media} = params
    case ThreadServer.add_media_to_post(thread_id, post_id, media) do
      :ok -> {:reply, :ok, socket}
      {:error, reason } ->
        Apex.ap reason
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end








end
