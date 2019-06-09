defmodule Aoba.Reply do
  alias __MODULE__

  @enforce_keys [:post_ids, :text]
  defstruct [:post_ids, :text]

  def new(post_ids, text) do
    {:ok, %Reply{post_ids: post_ids, text: text}}
  end

end
