defmodule AobaWeb.ThreadServerChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer


  def join("threadserver:lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_thread", %{"content" => content, "entry_id" => entry_id}, socket) do

    with {:ok, pid} <- ThreadServerSupervisor.start_thread(content, entry_id),
         {:ok, ids} <- ThreadServer.get_ids(pid)
    do

      Apex.ap(ids)
      {:reply, {:ok, ids}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("append_to_body_entry", params, socket) do
    IO.puts("append_to_body_entry")
    %{"thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "iolist" => iolist} = params
    ThreadServer.append_to_body_entry(thread_id, post_id, entry_id, iolist)
    {:reply, :ok, socket}
  end








end
