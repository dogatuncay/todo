import {deserialize, Types} from './Types'

const Model = {
  prototype: {}
}

function mergeData(into, from, fields) {
  fields.forEach((field) => {
    if(field in from) into[field] = from[field];
  });
}

function deserializeSchema(schema, data) {
  const newData = {};
  Object.keys(schema).forEach((field) => {
    if(field in data)
      newData[field] = deserialize(schema[field], data[field]);
  });
  return newData;
}


function validateDefinition(def) {
  function validationError(msg) {
    throw new Error(`Cannot define model: ${msg}`);
  }

  if(!def.name || typeof(def.name) !== 'string')
    validationError('invalid name');
  // does not validate types of schema
  if(!def.schema || !(def.schema instanceof Object))
    validationError('invalid schema');
  if(!def.get || typeof(def.get) !== 'function')
    validationError('invalid get');
  if(!def.update || typeof(def.update) !== 'function')
    validationError('invalid update');
  if(!def.create || typeof(def.create) !== 'function')
    validationError('invalid create');
  if(!def.destroy || typeof(def.destroy) !== 'function')
    validationError('invalid destroy');
}

Model.define = function(def) {
  validateDefinition(def);

  def.schema.id = Types.INT;
  const fields = Object.keys(def.schema);

  function NewModel(input, updateHook, destroyHook) {
    let inputData;
    if(input instanceof HTMLElement) {
      inputData = deserializeSchema(def.schema, input.dataset);
    } else if(input instanceof Object) {
      inputData = input;
    } else {
      throw new Error("invalid Model constuctor argument");
    }

    this.__update = function(data) {
      mergeData(this, data, fields);
      updateHook(this);
    }
    this.__destroy = function() {
      destroyHook(this);
    }

    mergeData(this, inputData, fields);
  }

  NewModel.prototype = {
    __proto__: Model,
    get: function() {
      return def.get.apply(this, arguments)
        .then((data) => {
          this.__update(data);
          return this;
        });
    },
    update: function() {
      return def.update.apply(this, arguments)
        .then((data) => {
          this.__update(data);
          return this;
        });
    },
    destroy: function() {
      return def.destroy.apply(this, arguments)
        .then((data) => {
          this.__destroy();
          return this;
        });
    }
  };

  NewModel.create = def.create;

  return NewModel
}

export default Model
