defmodule TodoWeb.UserController do
    require IEx
    use TodoWeb, :controller
    alias Todo.User
    alias Todo.Repo
    
    def index(conn, _params) do
        users = Repo.all(User)
        render(conn, "index.html", users: users)
    end

    def new(conn, _params) do
        changeset = User.changeset(%User{})
        render(conn, "new.html", changeset: changeset)
    end

    def create(conn, %{"user" => user_params}) do
        changeset = User.registration_changeset(%User{}, user_params)
        case Repo.insert(changeset) do
            {:ok, user} -> 
                conn
                |> TodoWeb.Auth.login(user)
                |> put_flash(:info, "User created.")
                |> redirect(to: Routes.item_path(conn, :index))
            {:error, changeset} -> 
                conn
                |> render("new.html", changeset: changeset)
        end
    end

    def show(conn, %{"id" => id}) do
        user = Repo.get(User, id)
        changeset = User.changeset(user)
        cond do
            user == Guardian.Plug.current_resource(conn) ->
              conn
              |> render("show.html", user: user, changeset: changeset)
            true ->
              conn
              |> put_flash(:info, "No access")
              |> redirect(to: Routes.page_path(conn, :index))
        end
    end

    def update(conn, %{"id" => id, "user" => user_params}) do
        user = Repo.get(User, id)
        changeset = User.registration_changeset(user, user_params)
        # IEx.pry
        cond do
            user == Guardian.Plug.current_resource(conn) ->
                case Repo.update(changeset) do
                    {:ok, user} ->
                      conn
                      |> put_flash(:info, "User updated.")
                      |> redirect(to: Routes.user_path(conn, :index))
                    {:error, changeset} ->
                      conn
                      |> render("show.html", user: user, changeset: changeset)
                end
            true ->
              conn
              |> put_flash(:info, "No access")
              |> redirect(to: Routes.page_path(conn, :index))
          end
    end

    def delete(conn, %{"id" => id}) do
        user = Repo.get(User, id)
        cond do
            user == Guardian.Plug.current_resource(conn) -> 
                case Repo.delete(user) do
                    {:ok, user} -> 
                        conn
                        |> put_flash(:info, "User deleted.")
                        |> Guardian.Plug.sign_out
                        |> redirect(to: Routes.page_path(conn, :index))
                    true -> 
                        conn
                        |> render("show.html", user: user)
                end
        end
    end

end
