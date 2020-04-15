defmodule Todo.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    has_many :items, Todo.Item
    has_many :lists, Todo.List

    timestamps()
  end

  def registration_changeset(user, params) do
    fields = [:password]
    user
    |> changeset(params)
    |> cast(params, fields)
    |> validate_required(fields)
    |> validate_length(:password, min: 6)
    |> put_password_hash()
  end

  def changeset(user, params \\ %{}) do
    fields = [:email, :name]
    user
    |> cast(params, fields)
    |> validate_required(fields)
    |> validate_format(:email, ~r/@/)
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ -> changeset
    end
  end

end
