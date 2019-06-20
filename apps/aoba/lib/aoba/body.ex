defmodule Aoba.Body do
  alias __MODULE__

  defstruct closed_entries: [], last_edited_entry: nil, entries: %{}

  def new(content, entry_id), do: Body.add_entry(%Body{}, entry_id, content)



  def add_entry(%Body{last_edited_entry: nil} = body, entry_id, text_or_reply) do
    entries = Map.put(body.entries, entry_id, text_or_reply)
    %Body{body |
      entries: entries,
      last_edited_entry: entry_id
    }
  end


  def add_entry(%Body{} = body, entry_id, text_or_reply) do
    entries = Map.put(body.entries, entry_id, text_or_reply)
    %Body{body |
      entries: entries,
      closed_entries: [body.last_edited_entry | body.closed_entries],
      last_edited_entry: entry_id

    }
  end

  # Primera entry
  def add_or_edit_entry(%Body{last_edited_entry: nil} = body, entry_id, iolist) when is_number(entry_id) do
    add_entry(body, entry_id, iolist)
  end

  # Editando misma entry
  def add_or_edit_entry(%Body{last_edited_entry: entry_id} = body, entry_id, iolist) when is_number(entry_id) do
    edit_entry(body, entry_id, iolist)
  end


  def add_or_edit_entry(%Body{} = body, entry_id, iolist) when is_number(entry_id) do
    # Nueva entry
    if entry_id not in body.closed_entries do
      add_entry(body, entry_id, iolist)
    # Intentando editar entry cerrada
    else
      body
    end
  end


  defp edit_entry(body, entry_id, iolist) do
    Apex.ap entry_id
    Apex.ap body.closed_entries

    if Map.has_key?(body.entries, entry_id) and entry_id not in body.closed_entries do

      updated_content = IO.iodata_to_binary([body.entries[entry_id], iolist])
      update_in(body.entries, &Map.put(&1, entry_id, updated_content))

    end


  end







end



