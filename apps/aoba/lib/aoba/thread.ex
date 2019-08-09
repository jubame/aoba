defmodule Aoba.Thread do

  alias Aoba.{Thread, Post}
  '''
  https://stackoverflow.com/a/47616410
  Finally, if you are encoding structs, you may have to add @derive
  Msgpax.Packer attribute to the modules containing the structs as detailed in
  Msgpax's documentation.
  '''
  @derive [{Msgpax.Packer, fields: [:thread_id, :post_id, :posts]}]
  defstruct thread_id: nil, post_id: 1, posts: %{}

  def new(thread_id) do
    add_post(
      %Thread{thread_id: thread_id}
    )
  end


  def add_post(thread) do
    #IO.puts "*************************thread"
    #Apex.ap thread
    #IO.puts "*************************thread.post_id"
    #Apex.ap thread.post_id
    {:ok, new_post} = Post.new(thread.post_id, "anon")

    posts = Map.put(thread.posts, thread.post_id, new_post)
    #raise Exception

    %Thread{thread |
      posts: posts,
      post_id: thread.post_id + 1
    }
  end

  def trim_to_first_post(thread) do
    %Thread{thread |
      posts: %{1 => thread.posts[1]},
    }
  end

  def close_post(thread, post_id) do


    thread = update_in(thread.posts[post_id], fn post -> Post.close(post) end)



    {:ok,
      thread
    }
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



