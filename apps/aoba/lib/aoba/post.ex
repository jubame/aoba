defmodule Aoba.Post do
  alias Aoba.{Post, Body}

  @enforce_keys [:id, :username, :date, :body, :media]
  defstruct [:id, :username, :date, :body, :media]

  def new(id, username) do
    {:ok, %Post{id: id, username: username, date: DateTime.utc_now(), body: Body.new(), media: ""}}
  end

  def add_to_body(post, text_or_quote) do
    {:ok, %Post{post | body: [text_or_quote | post.body]}}
  end

  def edit_post(post, body_entry_id, content) do
    %Post{ post | body: Body.edit_entry(post.body, body_entry_id, content)}
  end




end
