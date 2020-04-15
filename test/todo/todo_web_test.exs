defmodule TodoTest do
  use Todo.DataCase

  alias Todo

  describe "items" do
    alias Todo.Item

    @valid_attrs %{completed: true, title: "some title"}
    @update_attrs %{completed: false, title: "some updated title"}
    @invalid_attrs %{completed: nil, title: nil}

    def item_fixture(attrs \\ %{}) do
      {:ok, item} =
        attrs
        |> Enum.into(@valid_attrs)
        |> TodoWeb.create_item()

      item
    end

    test "list_items/0 returns all items" do
      item = item_fixture()
      assert TodoWeb.list_items() == [item]
    end

    test "get_item!/1 returns the item with given id" do
      item = item_fixture()
      assert TodoWeb.get_item!(item.id) == item
    end

    test "create_item/1 with valid data creates a item" do
      assert {:ok, %Item{} = item} = TodoWeb.create_item(@valid_attrs)
      assert item.completed == true
      assert item.title == "some title"
    end

    test "create_item/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = TodoWeb.create_item(@invalid_attrs)
    end

    test "update_item/2 with valid data updates the item" do
      item = item_fixture()
      assert {:ok, %Item{} = item} = TodoWeb.update_item(item, @update_attrs)
      assert item.completed == false
      assert item.title == "some updated title"
    end

    test "update_item/2 with invalid data returns error changeset" do
      item = item_fixture()
      assert {:error, %Ecto.Changeset{}} = TodoWeb.update_item(item, @invalid_attrs)
      assert item == TodoWeb.get_item!(item.id)
    end

    test "delete_item/1 deletes the item" do
      item = item_fixture()
      assert {:ok, %Item{}} = TodoWeb.delete_item(item)
      assert_raise Ecto.NoResultsError, fn -> TodoWeb.get_item!(item.id) end
    end

    test "change_item/1 returns a item changeset" do
      item = item_fixture()
      assert %Ecto.Changeset{} = TodoWeb.change_item(item)
    end
  end
end
