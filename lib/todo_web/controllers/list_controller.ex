defmodule TodoWeb.ListController do
  use TodoWeb, :controller
  alias Todo.Repo
  import Ecto
  import Ecto.Query
  require IEx

  defp get_user_lists(user) do
    assoc(user, :lists)
  end


  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    lists = Repo.all get_user_lists(user)
    render(conn, "index.html", lists: lists)
  end

  def new(conn, _params) do
    changeset =
      Guardian.Plug.current_resource(conn)
      |> Ecto.build_assoc(:lists)
      |> Todo.List.changeset
    render(conn, "new.html", %{changeset: changeset, post_path: Routes.list_path(conn, :create)})
  end

  def create(conn, %{"list" => list_params}) do
    changeset =
      Guardian.Plug.current_resource(conn)
      |> Ecto.build_assoc(:lists)
      |> Todo.List.changeset(list_params)

    case Repo.insert(changeset) do
      {:ok, list} ->
        conn
        |> put_flash(:info, "Item created successfully.")
        |> redirect(to: Routes.list_path(conn, :show, list))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    # from item in query, where: item.list_id == 1
    # user = Guardian.Plug.current_resource(conn)
    list = Todo.Repo.get(Todo.List, id)
    items = Todo.Repo.all(Ecto.assoc(list, :items))
    item_trees = Todo.Item.Tree.construct_tree(items)
    render(conn, "show.html", list: list, item_trees: item_trees)
  end

  def edit(conn, %{"id" => id}) do
    list = Repo.get!(Todo.List, id)
    changeset = Todo.List.changeset(list)
    render(conn, "edit.html", list: list, changeset: changeset)
  end

  @spec update(Plug.Conn.t(), map) :: Plug.Conn.t()
  def update(conn, %{"id" => id, "list" => list_params}) do
    list = Repo.get!(Todo.List, id)

    case Todo.List.changeset(list, list_params) |> Repo.update do
      {:ok, list} ->
        conn
        |> put_flash(:info, "List updated successfully.")
        |> redirect(to: Routes.list_path(conn, :show, list))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", list: list, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    list = Repo.get!(Todo.List, id)
    {:ok, _list} = Repo.delete(list)

    conn
    |> put_flash(:info, "List deleted successfully.")
    |> redirect(to: Routes.item_path(conn, :index))
  end

end
