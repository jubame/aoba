defmodule Aoba.Body do
  alias __MODULE__

  defstruct closed_entries: MapSet.new(), entries: %{}


  def close_entry(%Body{closed_entries: closed_entries} = body, entry_id) do
    new_body = %Body{ body |
      closed_entries: MapSet.put(closed_entries, entry_id)
    }
    {:ok, new_body}
  end


  def operation_entry(action, %Body{closed_entries: closed_entries} = body, entry_id, text_or_reply) do
    if entry_id in closed_entries do
      {:error, :already_closed_entry}
    else
      aoba_operation_entry(action, body, entry_id, text_or_reply)
    end


  end


  defp aoba_operation_entry(:new, body, entry_id, iolist) do
    IO.puts("new2")

    {:ok, update_in(body.entries, &Map.put_new(&1, entry_id, iolist))}
  end


  defp aoba_operation_entry(:append, body, entry_id, iolist)  do
    if Map.has_key?(body.entries, entry_id) do
      updated_content = IO.iodata_to_binary([body.entries[entry_id], iolist])
      {:ok, update_in(body.entries, &Map.put(&1, entry_id, updated_content))}
    else
      aoba_operation_entry(:new, body, entry_id, iolist)
    end
  end

  defp aoba_operation_entry(:append_close, body, entry_id, iolist)  do
    {:ok, new_body} = aoba_operation_entry(:append, body, entry_id, iolist)
    close_entry(new_body, entry_id)
  end


  defp aoba_operation_entry(:replace, body, entry_id, iolist)  do
    {:ok, update_in(body.entries, &Map.put(&1, entry_id, iolist))}
  end




  def new(content, entry_id) do
    IO.puts("new1")
    operation_entry(:new, %Body{}, entry_id, content)
  end












end



