defmodule Aoba.Media do
  @enforce_keys [:mime, :buffer]
  @derive [{Msgpax.Packer, fields: [:mime, :buffer]}]
  defstruct [:mime, :buffer]
end
