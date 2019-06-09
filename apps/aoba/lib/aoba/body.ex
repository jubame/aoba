defmodule Aoba.Body do
  alias __MODULE__

  defstruct auto_id: 1, entries: %{}

  def new(), do: %Body{}


  def add_entry(body, text_or_reply) do
    entries = Map.put(body.entries, body.auto_id, text_or_reply)
    %Body{body |
      entries: entries,
      auto_id: body.auto_id + 1
    }
  end

  def edit_entry(body, entry_id, content) do
    case Map.has_key?(body.entries, entry_id) do
      true ->
        new_content = body.entries[entry_id] <> content
        update_in(body.entries, &Map.put(&1, entry_id, new_content))
      false ->
        update_in(body.entries, &Map.put(&1, entry_id, content))
    end
  end




end
