defmodule Aoba.Entry do
  @enforce_keys [:content, :reply_to]
  @derive [{Msgpax.Packer, fields: [:content, :reply_to]}]
  defstruct [:content, :reply_to]
end
