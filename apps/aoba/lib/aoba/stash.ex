defmodule Aoba.Stash do
  use Agent

  def start_link([]) do
    Agent.start_link(fn -> [] end, name: __MODULE__)
  end

  def add_thread_id(thread_id) do
    Agent.update(
      __MODULE__,
      fn list -> [thread_id | list] end
    )
  end

  def greater_than(thread_start_id) do
    Agent.get(
      __MODULE__,
      fn list ->
        Enum.filter(
          list,
          fn(thread_id) -> thread_id > thread_start_id end
        )
      end
    )
  end

end
