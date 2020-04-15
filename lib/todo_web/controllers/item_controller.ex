defmodule TodoWeb.ItemController do
  use TodoWeb, :controller
  alias Todo
  alias Todo.Item
  alias Todo.Repo
  import Ecto
  # import Ecto.Query

  defp my_items(user) do
    assoc(user, :items)
  end

  # defp completed(user_items) do
  #   from t in user_items, where: t.completed == true
  # end

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    items = Repo.all my_items(user)
    render(conn, "index.html", items: items)
  end

  def render_new(conn, post_path) do
    changeset =
      Guardian.Plug.current_resource(conn)
      |> Ecto.build_assoc(:items)
      |> Item.changeset()
    render(conn, "new.html", %{changeset: changeset, post_path: post_path})
  end

  def new(conn, _params) do
    render_new(conn, Routes.item_path(conn, :create))
  end

  def new_child(conn, %{"id" => id}) do
    render_new(conn, Routes.item_create_child_path(conn, :create_child, id))
  end

  def create(conn, %{"item" => item_params}) do
    changeset =
      Guardian.Plug.current_resource(conn)
      |> Ecto.build_assoc(:items)
      |> Item.changeset(item_params)

    #user = Guardian.Plug.current_resource(conn)
    #changeset = Item.changeset(%Item{}, %{item_params | "user_id" => user.id})
    case Repo.insert(changeset) do
      {:ok, item} ->
        conn
        |> put_flash(:info, "Item created successfully.")
        |> redirect(to: Routes.item_path(conn, :show, item))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def create(conn, _) do
    conn
    |> put_status(:bad_request)
    |> text("Bad Request")
  end

  def create_child(conn, %{"id" => parent_item, "item" => item_params}) do
    item_params = Map.put(item_params, "parent_item", parent_item)

    changeset =
      Guardian.Plug.current_resource(conn)
      |> Ecto.build_assoc(:items)
      |> Item.changeset(item_params)
    case Repo.insert(changeset) do
      {:ok, item} ->
        conn
        |> put_flash(:info, "Child created successfully.")
        |> redirect(to: Routes.item_path(conn, :show, item))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    item = Repo.get!(my_items(user), id)
    render(conn, "show.html", item: item)
  end

  def edit(conn, %{"id" => id}) do
    item = Repo.get!(Item, id)
    changeset = Item.changeset(item)
    render(conn, "edit.html", item: item, changeset: changeset)
  end

  def update(conn, %{"id" => id, "item" => item_params}) do
    item = Repo.get!(Item, id)

    case Item.changeset(item, item_params) |> Repo.update do
      {:ok, item} ->
        conn
        |> put_flash(:info, "Item updated successfully.")
        |> redirect(to: Routes.item_path(conn, :show, item))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", item: item, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    item = Repo.get!(Item, id)
    {:ok, _item} = Repo.delete(item)

    conn
    |> put_flash(:info, "Item deleted successfully.")
    |> redirect(to: Routes.item_path(conn, :index))
  end
end
