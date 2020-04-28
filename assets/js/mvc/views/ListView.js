import View from '../View';
import ListModel from '../models/ListModel';
import ListController from '../controllers/ListController'

const ListView = View.define({
  name: 'List',
  Model: ListModel,
  Controller: ListController,

  layout: `
    <div vid="root" class="card">
      <div vid="title" class="card-title"></div>
      <div vid="mainControls">
        <i vid="editButton" class="fa fa-edit"></i>
        <i vid="deleteButton" class="fa fa-trash"></i>
        <i vid="viewItems" class="fa fa-arrow-right"></i>
      </div>
      <div vid="editControls" class="d-none">
        <i vid="saveButton" class="fa fa-check"></i>
        <i vid="cancelButton" class="fa fa-window-close"></i>
      </div>
    </div>
  `,

  update: function(list) {
    this.viewIndex.title.innerHTML = list.title;
  },

  destroy: function() {
    this.viewIndex.root.remove()
  },

  initialState: {
    mode: 'main'
  },

  actions: {
    isEditing: function() {
        return this.mode === 'edit';
    },
    beginEdit: function() {
        if(this.mode === 'edit') return;
        if(this.mode !== 'main') throw Error('invalid state transition');
        this.viewIndex.mainControls.classList.add('d-none');
        this.viewIndex.editControls.classList.remove('d-none');
        this.viewIndex.title.setAttribute('contenteditable', 'true');
        this.mode = 'edit';
    },
    stopEdit: function() {
        if(this.mode !== 'edit') throw Error('invalid state transition');
        this.viewIndex.mainControls.classList.remove('d-none');
        this.viewIndex.editControls.classList.add('d-none');
        this.viewIndex.title.removeAttribute('contenteditable');
        this.mode = 'main';
    },
    getEditData: function() {
    return {
        title: this.viewIndex.title.innerHTML
      };  
    },
  }
});

export default ListView;
