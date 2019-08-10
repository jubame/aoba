defmodule Aoba.Entry do
  @enforce_keys [:content, :reply_to, :closed]
  @derive [{Msgpax.Packer, fields: [:content, :reply_to, :closed]}]
  defstruct [:content, :reply_to, :closed]
end
