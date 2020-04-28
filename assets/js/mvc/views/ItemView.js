import {replaceNode, toggleBinaryClass} from '../helpers';
import View from '../View';
import ItemModel from '../models/ItemModel';
import ItemController from '../controllers/ItemController';

const ItemView = View.define({
  name: 'Item',
  Model: ItemModel,
  Controller: ItemController,

  layout: `
    <div vid="root" class="item">
      <div vid="error"></div>
      <div vid="title" class="item-title"></div>
      <div vid="mainControls">
        <i vid="editButton" class="fa fa-edit"></i>
        <i vid="deleteButton" class="fa fa-trash"></i>
        <i vid="addChildButton" class="fa fa-plus"></i>
        <i vid="completedCheckbox" class="fa"></i>
      </div>
      <div vid="editControls" class="d-none">
        <i vid="saveButton" class="fa fa-check"></i>
        <i vid="cancelButton" class="fa fa-window-close"></i>
      </div>
      <div vid="addChildControls" class="item-card-children d-none">
        <div vid="childTitle" contenteditable="true" class="item-title"></div>
        <i vid="saveChildButton" class="fa fa-check"></i>
        <i vid="cancelChildButton" class="fa fa-window-close"></i>
      </div>
      <div vid="children" class="item-card-children">
        <Children></Children>
      </div>
    </div>
  `,

  update: function(item) {
    this.viewIndex.title.innerHTML = item.title;
    toggleBinaryClass(this.viewIndex.completedCheckbox, item.completed, 'fa-square-o', 'fa-check-square-o');
  },

  destroy: function() {
    replaceNode(this.viewIndex.root, this.viewIndex.children.children)
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
    setError: function(error) {
      this.viewIndex.error.innerHTML = error
    },
    getChildData: function() {
      return {
        title: this.viewIndex.childTitle.innerHTML
      };
    },
    isNewChildActive: function() {
      return this.mode === 'child';
    },
    startAddChild: function() {
      if(this.mode === 'child') return;
      this.viewIndex.addChildControls.classList.remove('d-none');
      this.mode = 'child';
    },
    addChild: function(childView) {
      this.viewIndex.children.appendChild(childView.DOM);
    },
    stopNewChild: function() {
      if(this.mode !== 'child') throw Error('invalid state transition');
      this.viewIndex.addChildControls.classList.add('d-none');
      this.mode = 'main';
    },
    isCompleted: function() {
      return this.viewIndex.completedCheckbox.classList.contains("fa-check-square-o");
    }
  }
});

export default ItemView;
