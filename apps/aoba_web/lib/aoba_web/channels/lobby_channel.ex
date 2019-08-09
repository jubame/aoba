defmodule AobaWeb.LobbyChannel do
  use AobaWeb, :channel
  alias Aoba.ThreadServerSupervisor
  alias Aoba.ThreadServer



  # each user’s conversation on a topic has its own isolated, dedicated process.
  def join("lobby", _message, socket) do
    IO.puts(socket.id)
    '''
    https://elixirforum.com/t/how-is-phoenix-token-different-from-jwt/2349/5
    Yes, we use the salt for key derivation 58 and namespacing tokens. Calling
    it salt, although technically correct, is likely confusing. namespace
    could be a better name.
    '''
    tracking_id = socket.id
    token = Phoenix.Token.sign(AobaWeb.Endpoint, "aoba_namespace", tracking_id)
    {:ok, token, socket}
  end

  def handle_in("list_thread_ids", %{"last_seen_thread_id" => last_seen_thread_id}, socket) do
    {
      :reply,
      {
        :ok,
        %{thread_ids: ThreadServerSupervisor.get_children_thread_ids_gt(last_seen_thread_id)}
      },
      socket
    }
  end

  def handle_in("new_thread", _params, socket) do
    with {:ok, pid} <- ThreadServerSupervisor.start_thread(),
         {:ok,  ids=%{thread_id: _thread_id}} <- ThreadServer.get_ids(pid)
    do

      #Apex.ap(ids)
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




end
