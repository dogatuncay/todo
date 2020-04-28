import Controller from '../Controller';

const ListController = Controller.define({
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
          .catch((error) => this.view.setError(error));
      }
    },
    viewItems: {
      click: function(e) {
        window.location = "http://localhost:4000/lists/".concat(this.model.id);
      }
    }
  }
});

export default ListController