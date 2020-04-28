defmodule Todo.Item do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  @derive {Jason.Encoder, only: [:id, :title, :completed, :user_id, :list_id, :parent_item]}
  schema "items" do
    field :completed, :boolean, default: false
    field :title, :string

    belongs_to :user, Todo.User
    belongs_to :list, Todo.List

    belongs_to :parent, Todo.Item, foreign_key: :parent_item
    has_many :children, Todo.Item, foreign_key: :parent_item

    timestamps()
  end

  def changeset(item \\ %__MODULE__{}, attrs \\ %{}) do
    item
    |> cast(attrs, [:title, :completed, :parent_item])
    |> assoc_constraint(:parent)
    |> validate_required([:title, :completed])
  end

  def delete_and_reorg_children(item) do
    query = from i in Todo.Item, where: i.parent_item == ^item.id
    Todo.Repo.update_all(query, set: [parent_item: item.parent_item])
    Todo.Repo.delete(item)
  end

  defmodule Tree do
    defstruct [:data, :children]

    def map_depth_first(node, f) do
      mapped_children = Enum.map(node.children, &map_depth_first(&1, f))
      f.(node.data, mapped_children)
    end

    defp index_tree(data) do
      Enum.reduce(data, {[], %{}}, fn item, {roots, relationships} ->
        if item.parent_item == nil do
          {[item|roots], relationships}
        else
          {roots, Map.update(relationships, item.parent_item, [item],  fn children -> [item|children] end)}
        end
      end)
    end

    defp build_by_index(item, children) do
      children = Enum.map(Map.get(children, item.id, []), &build_by_index(&1, children))
      %__MODULE__{
        data: item,
        children: children
      }
    end

    def construct_tree(items) do
      {roots, child_index} = index_tree(items)
      Enum.map(roots, fn root -> build_by_index(root, child_index) end)
      |> Enum.reverse
    end
  end
end
