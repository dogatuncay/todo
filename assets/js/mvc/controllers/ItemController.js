import Controller from '../Controller';
import ItemModel from '../models/ItemModel';

const ItemController = Controller.define({
  eventBindings: {
    editButton: {
      click: function(e) {
        if(!this.view.isEditing()) {
          this.view.beginEdit();
        }
      }
    },
    cancelButton: {
      click: function(e) {
        if(this.view.isEditing()) {
          this.view.stopEdit();
        }
      }
    },
    saveButton: {
      click: function(e) {
        if(!this.view.isEditing())
          throw new Error("cannot save while not editing");

        this.model.update(this.view.getEditData())
          .then(() => this.view.stopEdit())
          .catch((error) => this.view.setError(error));
      }
    },
    deleteButton: {
      click: function(e) {
        this.model.destroy()
          .then(() => this.view.destroy())
          .catch((error) => this.view.setError(error));
      }
    },
    addChildButton: {
      click: function(e) {
        this.view.startAddChild();
      }
    },
    saveChildButton: {
      click: function(e) {
        if(!this.view.isNewChildActive())
          throw new Error("cannot save while not another add child is active");
        const data = this.view.getChildData();
        data.parent_item = this.model.id;
        ItemModel.create(this.model.list_id, data)
          .then((response) => {
            this.view.stopNewChild();
            this.view.addChild(new this.ViewClass(response.result));
          })
          .catch((error) => this.view.setError(error));
      }
    },
    cancelChildButton: {
      click: function(e) {
        if(this.view.isNewChildActive()) {
          this.view.stopNewChild();
        }
      }
    },
    completedCheckbox: {
      click: function(e) {
        this.model.update({completed: !this.view.isCompleted()})
          .catch((error) => this.view.setError(error));
      }
    }
  }
});

export default ItemController
