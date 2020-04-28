defmodule TodoWeb.ListController do
  use TodoWeb, :controller
  alias Todo.Repo
  import Ecto
  require IEx

  defp get_user_lists(user) do
    assoc(user, :lists)
  end

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    lists = Repo.all get_user_lists(user)
    render(conn, "index.html", lists: lists)
  end

  def show(conn, %{"id" => id}) do
    # from item in query, where: item.list_id == 1
    # user = Guardian.Plug.current_resource(conn)
    list = Todo.Repo.get(Todo.List, id)
    items = Todo.Repo.all(Ecto.assoc(list, :items))
    item_trees = Todo.Item.Tree.construct_tree(items)
    render(conn, "show.html", list: list, item_trees: item_trees)
  end
end
