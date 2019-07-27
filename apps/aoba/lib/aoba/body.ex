defmodule Aoba.Body do
  alias __MODULE__

  defstruct closed_entries: MapSet.new(), entries: %{}


  def close_entry(%Body{closed_entries: closed_entries} = body, entry_id) do
    new_body = %Body{ body |
      closed_entries: MapSet.put(closed_entries, entry_id)
    }
    {:ok, new_body}
  end


  def operation_entry(action, %Body{closed_entries: closed_entries} = body, entry_id, text_or_reply, close_entry, reply_to) do
    if entry_id in closed_entries do
      {:error, :already_closed_entry}
    else
      aoba_operation_entry(action, body, entry_id, text_or_reply, close_entry, reply_to)
    end


  end



  defp aoba_operation_entry(:new, body, entry_id, iolist, false = _close_entry, reply_to) do
    #IO.puts("new2")

    {
      :ok,
      update_in(
        body.entries,
        &Map.put_new(
          &1,
          entry_id,
          %{
            content: iolist,
            reply_to: reply_to
          }
        )
      )
    }
  end

  defp aoba_operation_entry(:append, body, entry_id, iolist, false = close_entry, reply_to)  do
    if Map.has_key?(body.entries, entry_id) do
      updated_content = IO.iodata_to_binary([body.entries[entry_id].content, iolist])
      {:ok, update_in(body.entries.content, &Map.put(&1, entry_id, updated_content))}
    else
      aoba_operation_entry(:new, body, entry_id, iolist, close_entry, reply_to)
    end
  end

  defp aoba_operation_entry(:append, body, entry_id, iolist, true = close_entry, reply_to)  do
    {:ok, new_body} = aoba_operation_entry(:append, body, entry_id, iolist, false, reply_to)
    close_entry(new_body, entry_id)
  end

  defp aoba_operation_entry(:replace, body, entry_id, iolist, false = close_entry, _reply_to)  do
    {:ok, update_in(body.entries.content, &Map.put(&1, entry_id, iolist))}
  end

  defp aoba_operation_entry(:replace, body, entry_id, iolist, true = close_entry, _reply_to)  do
    new_body = update_in(body.entries.content, &Map.put(&1, entry_id, iolist))
    close_entry(new_body, entry_id)
  end




  def new(content, entry_id) do
    #IO.puts("new1")
    #aoba_operation_entry(:new, %Body{}, entry_id, content, false)
  end












end



