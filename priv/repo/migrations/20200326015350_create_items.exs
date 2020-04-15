defmodule Todo.Repo.Migrations.CreateItems do
  use Ecto.Migration

  def change do
    create table(:items) do
      add :title, :string
      add :completed, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :nothing), null: true

      timestamps()
    end

    create index(:items, [:user_id])
  end
end
