defmodule TodoWeb.Router do
  use TodoWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    # plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  pipeline :browser_auth do
    plug Guardian.Plug.EnsureAuthenticated, handler: TodoWeb.BrowserAuthController
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated
  end

  scope "/", TodoWeb do
    pipe_through :browser

    get "/", PageController, :index
    resources "/users", UserController, only: [:new, :create]
    resources "/sessions", SessionController, only: [:new, :create, :delete]
  end

  scope "/", TodoWeb do
    pipe_through [:browser, :browser_auth]
    resources "/users", UserController, only: [:show, :index, :update, :delete]
    resources "/lists", ListController, except: [:update]
    resources "/items", ItemController
    # get "/items/:id/children/new", ItemController, :new_child
    # post "/items/:id/children", ItemController, :create_child, as: :item_create_child
    # index "/items/:id/children", ItemController, :index_children
  end

  scope "/api", TodoWeb do
    pipe_through [:api]
    put "/items/:id", ApiController, :update_item
    delete "/items/:id", ApiController, :delete_item
    post "/lists/:list_id/items", ApiController, :new_item

  end

  # Other scopes may use custom stacks.
  # scope "/api", TodoWeb do
  #   pipe_through :api
  # end
end
