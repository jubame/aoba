# lib/blokus_game/msgpax_serializer.ex

defmodule AobaWeb.MsgpaxSerializer do
  @moduledoc false
  @behaviour Phoenix.Transports.Serializer

  alias Phoenix.Socket.Reply
  alias Phoenix.Socket.Message
  alias Phoenix.Socket.Broadcast

  @gzip_threshold 512

  @doc """
  Translates a `Phoenix.Socket.Broadcast` into a `Phoenix.Socket.Message`.
  """
  def fastlane!(%Broadcast{} = msg) do
    msg = %Message{topic: msg.topic, event: msg.event, payload: msg.payload}

    {:socket_push, :binary, encode_v1_fields_only(msg)}
  end

  @doc """
  Encodes a `Phoenix.Socket.Message` struct to MessagePack binary.
  """
  def encode!(%Reply{} = reply) do
    msg = %Message{
      topic: reply.topic,
      event: "phx_reply",
      ref: reply.ref,
      payload: %{status: reply.status, response: reply.payload}
    }

    {:socket_push, :binary, encode_v1_fields_only(msg)}
  end

  def encode!(%Message{} = msg) do
    {:socket_push, :binary, encode_v1_fields_only(msg)}
  end

  @doc """
  Decodes MessagePack binary into `Phoenix.Socket.Message` struct.
  """
  def decode!(message, _opts) do
    message
    |> Msgpax.unpack!()
    |> Phoenix.Socket.Message.from_map!()
  end

  defp encode_v1_fields_only(%Message{} = msg) do
    msg
    |> Map.take([:topic, :event, :payload, :ref])
    |> Msgpax.pack!(iodata: false)
  end

  defp pack_data(data) do
    gzip_data(data, byte_size(data))
  end

  defp gzip_data(data, size) when size < @gzip_threshold, do: data
  defp gzip_data(data, _size), do: :zlib.gzip(data)
end
