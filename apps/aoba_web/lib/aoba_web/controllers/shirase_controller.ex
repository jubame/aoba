defmodule AobaWeb.ShiraseController do
  use AobaWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
