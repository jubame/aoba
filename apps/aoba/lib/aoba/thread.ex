defmodule Aoba.Thread do

  alias Aoba.{Thread, Post}
  defstruct thread_id: nil, post_id: 1, posts: %{}

  def new(thread_id, %{type: "text", content: _content} = type_and_content, entry_id) do
    add_post(
      %Thread{thread_id: thread_id},
      type_and_content,
      entry_id
    )
  end

  def new(thread_id, %{type: "media", content: _content} = type_and_content) do
    add_post(
      %Thread{thread_id: thread_id},
      type_and_content
    )
  end

  def add_post(thread, %{type: "text", content: _content} = type_and_content, entry_id) do

    {:ok, new_post} = Post.new(thread.post_id, "anon", type_and_content, entry_id)
    posts = Map.put(thread.posts, thread.post_id, new_post)

    %Thread{thread |
      posts: posts,
      post_id: thread.post_id + 1
    }

  end

  def add_post(thread, %{type: "media", content: _content} = type_and_content) do

    {:ok, new_post} = Post.new(thread.post_id, "anon", type_and_content)
    posts = Map.put(thread.posts, thread.post_id, new_post)

    %Thread{thread |
      posts: posts,
      post_id: thread.post_id + 1
    }

  end


  @docp """
  thread = Thread.new()
  thread = Thread.add_post(thread)
  thread = Thread.add_post(thread)

  alias Aoba.Body
  Body.new()
  body = Body.add_entry(body, "asdfasdf")
  body = Body.add_entry(body, "asdfasdf")
  alias Aoba.Reply


  """

end



