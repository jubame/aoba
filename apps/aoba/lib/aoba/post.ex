defmodule Aoba.Post do
  alias Aoba.{Post, Body}

  @enforce_keys [:id, :username, :date, :body, :media, :closed]
  defstruct [:id, :username, :date, :body, :media, :closed]

  def new(id, username) do
    #IO.puts("DENTRO DE POST.new")

    {:ok, new_post} = {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: %Body{}, media: "", closed: false}}
    #Apex.ap new_post
    {:ok, new_post}
  end

  def new(id, username, %{type: "text", content: content}, entry_id) do
    #IO.puts("DENTRO DE POST.new")
    {:ok, body} = Body.new(content, entry_id)
    {:ok, new_post} = {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: body, media: "", closed: false}}
    #Apex.ap new_post
    {:ok, new_post}
  end

  def new(id, username, %{type: "media", content: content}) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: %Body{}, media: content, closed: false}}
  end

  def add_media(%Post{closed: false} = post, media) do
    {:ok, %Post{ post | media: media }}
  end

  def close(post) do
    %Post{ post | closed: true}
  end

  def close(post, body) do
    %Post{ post | closed: true, body: body}
  end

  def is_not_closed?(%Post{closed: false}) do
    :ok
  end

  def is_not_closed?(%Post{closed: true}) do
    {:error, :already_closed_post}
  end



end
