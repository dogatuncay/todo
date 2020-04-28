import './View'

const Controller = {
  prototype: {}
}

const eventWhitelist = ['click']

function validateDefinition(def) {
  function validationError(msg) {
    throw new Error(`Cannot define controller: ${msg}`)
  }

  if(def.eventBindings && !(def.eventBindings instanceof Object))
    validationError('invalid eventBindings')
}

function attachControllerEvents(controller, viewIndex, eventBindings) {
  Object.keys(eventBindings).forEach(function (viewKey) {
    const element = viewIndex[viewKey]
    if(!element) throw new Error("key doesn't exist in the view index")
    const events = eventBindings[viewKey]
    Object.keys(events).forEach(function (eventKey) {
      if(!eventWhitelist.includes(eventKey)) throw new Error("event doesn't exist in the event white list")
      element.addEventListener(eventKey, events[eventKey].bind(controller))
    })
  })
}

Controller.define = function(def) {
  validateDefinition(def)

  function NewController(ViewClass, model, view, viewIndex) {
    this.ViewClass = ViewClass;
    this.model = model
    this.view = view
    attachControllerEvents(this, viewIndex, def.eventBindings)
  }

  NewController.prototype = {
    __proto__: Controller
  }

  return NewController
}

export default Controller
