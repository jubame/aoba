defmodule Aoba.Post do
  alias Aoba.{Post, Body}

  @enforce_keys [:id, :username, :date, :body, :media]
  defstruct [:id, :username, :date, :body, :media]

  def new(id, username, %{type: "text", content: content}, entry_id) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: Body.new(content, entry_id), media: ""}}
  end

  def new(id, username, %{type: "media", content: content}) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: %Body{}, media: content}}
  end


  def add_to_body(post, text_or_quote) do
    {:ok, %Post{post | body: [text_or_quote | post.body]}}
  end

  def edit_post(post, body_entry_id, content) do
    %Post{ post | body: Body.edit_entry(post.body, body_entry_id, content)}
  end

  def add_media(post, media) do
    {:ok, %Post{ post | media: media }}
  end




end
