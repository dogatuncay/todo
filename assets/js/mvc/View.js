import {traverseDOM, replaceNode} from './helpers';
import Controller from './Controller';
import Model from './Model';

const keyBlacklist = ['DOM', 'model', 'controller'];

const __viewRegistry = {}

const View = {
  prototype: {}
};

function validateDefinition(def) {
  function validationError(msg) {
    throw new Error(`Cannot define view: ${msg}`);
  }

  if(!def.name || typeof(def.name) !== 'string')
    validationError('invalid name');
  if(def.Model !== null && (!def.Model || def.Model.prototype.__proto__ !== Model))
    validationError('invalid Model');
  if(!def.Controller || def.Controller.prototype.__proto__ !== Controller)
    validationError('invalid Controller');
  if(def.Model !== null && (!def.update || typeof(def.update) !== 'function'))
    validationError('invalid update');
  if(def.Model !== null && (!def.destroy || typeof(def.destroy) !== 'function'))
    validationError('invalid destroy');
  if(!def.initialState || !(def.initialState instanceof Object))
    validationError('invalid initialState');
  Object.keys(def.initialState).forEach((stateKey) => {
    if(stateKey in keyBlacklist)
      validationError(`invalid initialState key: ${stateKey}`);
  });
  if(!def.actions || !(def.actions instanceof Object))
    error('invalid actions');
  Object.keys(def.actions).forEach((methodName) => {
    if(methodName in keyBlacklist)
      validationError(`invalid method name: ${methodName}`);
    if(typeof(def.actions[methodName]) !== 'function')
      validationError(`invalid method ${methodName}: not a function`);
  });
}

function renderLayout(layout, children) {
  const fragment = document.createRange().createContextualFragment(layout);

  const viewIndex = {};
  let childrenReplaced = false;

  [...fragment.children].forEach((root) => {
    traverseDOM(root, (node) => {
          if(node.hasAttribute('vid')) {
            const vid = node.getAttribute('vid')
            node.removeAttribute('vid')
            node.classList.add(vid)
            if (vid in viewIndex) {
              throw new Error("duplicate vid")
            }
            viewIndex[vid] = node
          }

          if(node.tagName === "CHILDREN"){
            if (childrenReplaced){
              throw new Error("multiple children tags")
            }
            replaceNode(node, children)
            childrenReplaced = true;
          }
        }
      )
  });

  if(!childrenReplaced && children.length > 0)
    console.error('view did not render a <CHILDREN /> tag, but there were children to render!');

  return {fragment, viewIndex};
}

View.define = function(def) {
  validateDefinition(def)

  function NewView(dataSource, children = []) {
    const {fragment, viewIndex} = renderLayout(def.layout, children);
    this.DOM = fragment;
    this.viewIndex = viewIndex;

    const model = def.Model ? new def.Model(dataSource, def.update.bind(this), def.destroy.bind(this)) : null;
    new def.Controller(NewView, model, this, viewIndex);

    Object.assign(this, def.initialState);

    if(model) def.update.apply(this, [model]);
  }

  NewView.prototype = {
    __proto__: View
  };
  Object.assign(NewView.prototype, def.actions);

  __viewRegistry[def.name.toUpperCase()] = NewView;

  return NewView;
}

View.__initialize = function(node) {
  const ViewClass = __viewRegistry[node.tagName];
  if(ViewClass) {
    const view = new ViewClass(node, [...node.children]);
    View.__initialize(view.DOM);
    replaceNode(node, view.DOM);
  } else {
    [...node.children].forEach((child) => View.__initialize(child));
  }
}

export default View;
