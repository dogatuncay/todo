defmodule TodoWeb.ApiController do
  use TodoWeb, :controller
  alias Todo
  alias Todo.Item
  alias Todo.Repo
  require IEx

  def new_item(conn, %{"list_id" => list_id, "item" => item_params}) do
    user = Guardian.Plug.current_resource(conn)
    changeset =
      Repo.get(Todo.List, list_id)
      |> Ecto.build_assoc(:items)
      |> Item.changeset(item_params)
      |> Ecto.Changeset.put_assoc(:user, user)

    case Repo.insert(changeset) do
      {:ok, _} ->
        render(conn, "ok.json")
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:bad_request)
        |> render("changeset_errors.json", errors: changeset.errors)
    end
  end

  def update_item(conn, %{"id" => id, "item" => item_params}) do
    item = Repo.get!(Item, id)

    case Item.changeset(item, item_params) |> Repo.update do
      {:ok, _} ->
        render(conn, "ok.json")
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render("changeset_errors.json", errors: changeset.errors)
    end
  end

  def delete_item(conn, %{"id" => id}) do
    item = Repo.get!(Item, id)
    case Todo.Item.delete_and_reorg_children(item) do
      {:ok, _} ->
        render(conn, "ok.json")
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render("changeset_errors.json", errors: changeset.errors)
    end
    # case Repo.delete(item) do
    #   {:ok, _} ->
    #     render(conn, "ok.json")
    #   {:error, changeset} ->
    #     conn
    #     |> put_status(:bad_request)
    #     |> render("changeset_errors.json", errors: changeset.errors)
    # end
  end

  # def create_child(conn, %{"list_id" => list_id, "item" => item_params}) do
  #   #item_params = Map.put(item_params, "parent_item", parent_item)
  #   list = Repo.get!(Todo.List, list_id)
  #   changeset =
  #     Guardian.Plug.current_resource(conn)
  #     |> Ecto.build_assoc(:items)
  #     |> Item.changeset(item_params)
  #     |> Ecto.Changeset.put_assoc(:list, list)

  #   case Repo.insert(changeset) do
  #     {:ok, _} ->
  #       render(conn, "ok.json")
  #     {:error, %Ecto.Changeset{} = changeset} ->
  #       conn
  #       |> put_status(:bad_request)
  #       |> render("changeset_errors.json", errors: changeset.errors)
  #   end
  # end
end
