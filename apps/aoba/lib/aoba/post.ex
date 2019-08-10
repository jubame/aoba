defmodule Aoba.Post do
  alias Aoba.{Post}

  @enforce_keys [:id, :username, :date, :media, :closed]
  @derive [{Msgpax.Packer, fields: [:id, :username, :date, :media, :closed, :closed_entries, :entries]}]
  defstruct [:id, :username, :date, :media, :closed, closed_entries: [], entries: %{}]

  def new(id, username) do
    #IO.puts("DENTRO DE POST.new")

    {:ok, new_post} = {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), media: "", closed: false}}
    #Apex.ap new_post
    {:ok, new_post}
  end

  def new(id, username, %{type: "text", content: content}, entry_id) do
    #IO.puts("DENTRO DE POST.new")

    {:ok, new_post} = {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), media: "", closed: false}}
    #Apex.ap new_post
    {:ok, new_post}
  end

  def new(id, username, %{type: "media", content: content}) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), media: content, closed: false}}
  end

  def add_media(%Post{closed: false} = post, media) do
    {:ok, %Post{ post | media: media }}
  end

  def close(post) do
    %Post{ post | closed: true}
  end

  def is_not_closed?(%Post{closed: false}) do
    :ok
  end

  def is_not_closed?(%Post{closed: true}) do
    {:error, :already_closed_post}
  end



  def close_entry(%Post{closed_entries: closed_entries} = post, entry_id) do
    if entry_id in closed_entries do
      {:error, :already_closed_entry}
    else
      new_post = %Post{ post |
      closed_entries: [entry_id | closed_entries]
      }
      {:ok, new_post}
    end

  end


  def operation_entry(action, %Post{closed_entries: closed_entries} = post, entry_id, text_or_reply, close_entry, reply_to) do
    if entry_id in closed_entries do
      {:error, :already_closed_entry}
    else
      aoba_operation_entry(action, post, entry_id, text_or_reply, close_entry, reply_to)
    end


  end



  defp aoba_operation_entry(:new, post, entry_id, iolist, false = _close_entry, reply_to) do
    #IO.puts("new2")

    {
      :ok,
      update_in(
        post.entries,
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

  defp aoba_operation_entry(:append, post, entry_id, iolist, false = close_entry, reply_to)  do
    if Map.has_key?(post.entries, entry_id) do
      updated_content = IO.iodata_to_binary([post.entries[entry_id].content, iolist])

      {:ok, update_in(post.entries[entry_id], &Map.put(&1, :content, updated_content))}



    else
      aoba_operation_entry(:new, post, entry_id, iolist, close_entry, reply_to)
    end
  end

  defp aoba_operation_entry(:append, post, entry_id, iolist, true = _close_entry, reply_to)  do
    {:ok, new_post} = aoba_operation_entry(:append, post, entry_id, iolist, false, reply_to)
    close_entry(new_post, entry_id)
  end

  defp aoba_operation_entry(:replace, post, entry_id, iolist, false = _close_entry, _reply_to)  do
    {:ok, update_in(post.entries[entry_id], &Map.put(&1, :content, iolist))}
  end

  defp aoba_operation_entry(:replace, post, entry_id, iolist, true = _close_entry, _reply_to)  do
    new_post = update_in(post.entries[entry_id], &Map.put(&1, :content, iolist))
    close_entry(new_post, entry_id)
  end




  def new(content, entry_id) do
    #IO.puts("new1")
    #aoba_operation_entry(:new, %Body{}, entry_id, content, false)
  end






end
