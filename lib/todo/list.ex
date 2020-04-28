defmodule Todo.List do
  use Ecto.Schema
  import Ecto.Changeset

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
end
