defmodule Aoba.Post do
  alias Aoba.{Post, Body}

  @enforce_keys [:id, :username, :date, :body, :media]
  defstruct [:id, :username, :date, :body, :media]

  def new(id, username, %{type: "text", content: content}, entry_id) do
    IO.puts("DENTRO DE POST.new")
    {:ok, body} = Body.new(content, entry_id)
    {:ok, new_post} = {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: body, media: ""}}
    Apex.ap new_post
    {:ok, new_post}
  end

  def new(id, username, %{type: "media", content: content}) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: %Body{}, media: content}}
  end

  def add_media(post, media) do
    {:ok, %Post{ post | media: media }}
  end




end
