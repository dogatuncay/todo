defmodule Todo.Repo.Migrations.AssociateListToItem do
  use Ecto.Migration

  def change do
    alter table(:items) do
      add :list_id, references(:lists, on_delete: :nothing)
    end
  end
end
