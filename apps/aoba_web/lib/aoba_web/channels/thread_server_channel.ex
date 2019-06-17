defmodule AobaWeb.ThreadServerChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer


  def join("threadserver:lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_thread", %{"content" => content}, socket) do

    with {:ok, pid} <- ThreadServerSupervisor.start_thread(content),
         {:ok, ids} <- ThreadServer.get_ids(pid)
    do

      Apex.ap(process_ids(ids))
      {:reply, {:ok, process_ids(ids)}, socket}
    else
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end


  defp process_ids(ids) do
    %{thread_id: thread_id, post_id: post_id } = ids
    {date, node} = thread_id

    %{thread_id: DateTime.to_unix(date)*10 + node_to_number(), post_id: post_id}
  end

  defp node_to_number() do
    Node.self()
    |> Atom.to_string()
    |> String.split("@")
    |> Enum.at(0)
    |> String.to_integer()
  end

end
