defmodule TreeCons do
  defmodule Item do
    defstruct [:id, :title, :parent_id]
  end

  defmodule TreeNode do
    defstruct [:data, :children]

    def map_depth_first(node, f) do
      xs = Enum.map(node.children, &map_depth_first(&1, f))
      f.(node.data, xs)
    end
  end

  def index_tree(data) do
    Enum.reduce(data, {[], %{}}, fn item, {roots, relationships} ->
      if item.parent_id == nil do
        {[item|roots], relationships}
      else
        {roots, Map.update(relationships, item.parent_id, [item],  fn children -> [item|children] end)}
      end
    end)
  end

  def build_by_index(item, children) do
    ## same thing but less functional way
    # if children[index] do
    #   %TreeNode{
    #     data: index,
    #     children: Enum.map(children[index], &build_by_index(&1, children))
    #   }
    # else
    #   %TreeNode{data: index, children: []}
    # end

    #canbans way
    children = Enum.map(Map.get(children, item.id, []), &build_by_index(&1, children))
    %TreeNode{
      data: item,
      children: children
    }
  end

  def construct_tree(data) do
    {roots, child_index} = index_tree(data)
    Enum.map(roots, fn root -> build_by_index(root, child_index) end)
    |> Enum.reverse
  end

  def test1_data do
    [
      %Item{
        id: 1,
        title: :a,
        parent_id: nil
      },
      %Item{
        id: 2,
        title: :b,
        parent_id: 1
      },
      %Item{
        id: 3,
        title: :c,
        parent_id: 1
      },
      %Item{
        id: 9,
        title: :j,
        parent_id: 6
      },
      %Item{
        id: 4,
        title: :d,
        parent_id: nil
      },
      %Item{
        id: 5,
        title: :e,
        parent_id: 4
      },
      %Item{
        id: 6,
        title: :f,
        parent_id: 5
      },
      %Item{
        id: 7,
        title: :g,
        parent_id: 5
      },
      %Item{
        id: 8,
        title: :h,
        parent_id: 7
      },
      %Item{
        id: 11,
        title: :i,
        parent_id: 7
      },
      %Item{
        id: 10,
        title: :k,
        parent_id: nil
      }
    ]
  end

  def test1 do
    expected = [
      %TreeNode{
        data: :a,
        children: [
          %TreeNode{data: :b, children: []},
          %TreeNode{data: :c, children: []}
        ]
      },
      %TreeNode{
        data: :d,
        children: [
          %TreeNode{data: :e, children: []},
          %TreeNode{
            data: :f,
            children: [
              %TreeNode{
                data: :g,
                children: [
                  %TreeNode{data: :h, children: []},
                  %TreeNode{data: :i, children: []}
                ]
              },
              %TreeNode{data: :j, children: []}
            ]
          }
        ]
      },
      %TreeNode{data: :k, children: []}
    ]
    {:ok, actual} = construct_tree(test1_data)
    ^actual = expected
  end

  def test2 do
    invalid_data = [
      %Item{
        id: 1,
        title: :a,
        parent_id: nil
      },
      %Item{
        id: 2,
        title: :b,
        parent_id: 1
      },
      %Item{
        id: 3,
        title: :c,
        parent_id: 7
      }
    ]
    case construct_tree(invalid_data) do
      {:error, _} -> true
      true -> raise "test2 failed"
    end
  end

end

TreeCons.test1
#  TreeCons.test2
