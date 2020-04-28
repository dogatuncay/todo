import Controller from '../Controller';
import ListModel from '../models/ListModel';

const ListIndexController = Controller.define({
  eventBindings: {
    newButton: {
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

        ListModel.create(this.view.getData())
          .then((listData) =>{ 
              this.view.addList(listData)
              this.view.stopEdit()
            })
          .catch((error) => this.view.setError(error));
      }
    }
  }
});

export default ListIndexController