defmodule Todo.Repo.Migrations.AddItemReference do
  use Ecto.Migration

  def change do
    alter table(:items) do
      add :parent_item, references(:items, on_delete: :nothing)
    end
  end
end
