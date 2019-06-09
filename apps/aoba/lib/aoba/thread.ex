defmodule Aoba.Thread do

  alias Aoba.{Thread, Post}
  defstruct auto_id: 1, posts: %{}

  def new(), do: %Thread{}

  def add_post(thread) do

    {:ok, new_post} = Post.new(thread.auto_id, "anon")
    posts = Map.put(thread.posts, thread.auto_id, new_post)

    %Thread{thread |
      posts: posts,
      auto_id: thread.auto_id + 1
    }

  end


  def edit_post_body(thread, post_id, body_entry_id, content) do
    post = thread.posts[post_id]
    edited_post = Post.edit_post(post, body_entry_id, content)
    update_in(thread.posts, &Map.put(&1, post_id, edited_post))
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



