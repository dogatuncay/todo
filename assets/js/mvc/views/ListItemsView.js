import View from '../View';
import ListModel from '../models/ListModel';
import ListItemsController from '../controllers/ListItemsController'
import ItemView from './ItemView';

const ListItemsView = View.define({
  name: 'ListItems',
  Model: ListModel,
  Controller: ListItemsController,

  layout: `
    <div vid="root" class="list card">
      <div vid="error"></div>
      <div class="card-body">
        <div vid="title" class="card-title"></div>
        <div vid="items" class="card-text">
          <Children></Children>
        </div>
        <div class="list new-card">
          <div vid="newControls">
            <div vid="newItemButton">
              <i class="fa fa-plus"></i>
              New Item
            </div>
          </div>
          <div vid="newEditControls" class="d-none">
            <div vid="newTitle" class="item-title" contenteditable="true"></div>
            <i vid="saveNewItemButton" class="fa fa-check"></i>
            <i vid="cancelNewItemButton" class="fa fa-window-close"></i>
          </div>
        </div>
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
      this.viewIndex.newControls.classList.add('d-none');
      this.viewIndex.newEditControls.classList.remove('d-none');
      this.mode = 'edit';
    },
    stopEdit: function() {
      if(this.mode !== 'edit') throw Error('invalid state transition');
      this.viewIndex.newEditControls.classList.add('d-none');
      this.viewIndex.newControls.classList.remove('d-none');
      this.mode = 'main';
    },
    getData: function() {
      return {
        title: this.viewIndex.newTitle.innerHTML
      };  
    },
    addItem: function(itemData) {
      const itemView = new ItemView(itemData.result);
      this.viewIndex.items.appendChild(itemView.DOM);
    },
    setError: function(error) {
      this.viewIndex.error.innerHTML = error
    }
  }
});

export default ListItemsView;
