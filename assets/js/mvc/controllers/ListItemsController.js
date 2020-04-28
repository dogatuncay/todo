import Controller from '../Controller';
import ItemModel from '../models/ItemModel';

const ListItemsController = Controller.define({
  eventBindings: {
    newItemButton: {
      click: function(e) {
        if(!this.view.isEditing()) {
          this.view.beginEdit();
        }
      }
    },
    cancelNewItemButton: {
      click: function(e) {
        if(this.view.isEditing()) {
          this.view.stopEdit();
        }
      }
    },
    saveNewItemButton: {
      click: function(e) {
        if(!this.view.isEditing())
          throw new Error("cannot save while not editing");

        ItemModel.create(this.model.id, this.view.getData())
          .then((itemData) =>{ 
              this.view.addItem(itemData)
              this.view.stopEdit()
            })
          .catch((error) => this.view.setError(error));
      }
    },
    back: {
      click: function(e) {
        window.location = "http://localhost:4000/lists/";
      }
    }
  }
});

export default ListItemsController
