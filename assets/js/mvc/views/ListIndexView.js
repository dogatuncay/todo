
import View from '../View';
import ListIndexController from '../controllers/ListIndexController'
import ListView from './ListView';

const ListIndexView = View.define({
  name: 'ListIndex',
  Model: null,
  Controller: ListIndexController,

  layout: `
    <div vid="root">
      <div vid="error"></div>
      <div vid="lists">
        <Children></Children>
      </div>
      <div class="list card new-card">
        <div vid="newControls">
          <div vid="newButton">
            <i class="fa fa-plus"></i>
            New List
          </div>
        </div>
        <div vid="newEditControls" class="d-none">
          <div vid="title" class="card-title" contenteditable="true"></div>
          <i vid="saveButton" class="fa fa-check"></i>
          <i vid="cancelButton" class="fa fa-window-close"></i>
        </div>
      </div>
    </div>
  `,

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
        title: this.viewIndex.title.innerHTML
      };  
    },
    addList: function(listData) {
      const listView = new ListView(listData.result);
      this.viewIndex.lists.appendChild(listView.DOM);
    },
    setError: function(error) {
      this.viewIndex.error.innerHTML = error
    },
  }
});

export default ListIndexView;
