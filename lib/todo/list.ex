defmodule Todo.List do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  @derive {Jason.Encoder, only: [:id, :title, :user_id]}
  schema "lists" do
    field :title, :string

    belongs_to :user, Todo.User
    has_many :items, Todo.Item

    timestamps()
  end

  @doc false
  def changeset(list \\ %__MODULE__{}, attrs \\ %{}) do
    list
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end

  def delete_list_w_items(list) do
    query = from i in Todo.Item, where: i.list_id == ^list.id
    Todo.Repo.delete_all(query)
    Todo.Repo.delete(list)
  end
end
