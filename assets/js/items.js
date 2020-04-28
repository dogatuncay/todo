import {findChildWithClass} from './helpers'

class RequestError extends Error {
    constructor(response, ...params) {
        super(...params)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        this.name = 'RequestError'
        this.response = response
    }
}

class ApiError extends Error {
    constructor(json, ...params) {
      super(...params)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ApiError)
      }
  
      this.name = 'ApiError'
      this.json = json
    }
  }


//Api calls
window.newItem = function(list_id, item_data) {
    return fetch(`/api/lists/${list_id}/items`, {
        method: 'POST',
        body: JSON.stringify(item_data),
        headers: {'Content-Type': 'application/json'}
    })
    .then(function(response) {
        if(response.headers.get('Content-Type').indexOf('application/json') === 0) {
            return response.json()
        } else {
            throw new RequestError(response, 'response did not have "Content-Type" of "application/json"')
        }
    })
    .then(function(json) {
        if(json.ok) {
            return json;
        } else {
            throw new ApiError(json);
        }
    })
}

window.updateItem = function(item_id, item_data) {
    return fetch(`/api/items/${item_id}`, {
        method: 'PUT',
        body: JSON.stringify(item_data),
        headers: {'Content-Type': 'application/json'}
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        if(json.ok) {
            return json;
        } else {
            throw json;
        }
    })
}

window.deleteItem = function(item_id) {
    return fetch(`/api/items/${item_id}`, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        if(json.ok) {
            return json;
        } else {
            throw json;
        }
    })
}

//events for the view
window.acceptNewItem = function(e){
    const root = e.target.parentElement.parentElement
    const list_id = document.getElementById("list").getAttribute('data-list-id')
    const [el] = root.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'false')
    const item_title = el.innerText
    if (item_title != "") {
        const data = {
            item: {
                title: item_title
            }
        }
        newItem(list_id, data)
            .then(function(response) {
                root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('invisible'))
                root.querySelectorAll('.new-state-btn').forEach((node) => node.classList.add('invisible'))
                //todo copy item and append
            })
            .catch(function(error) {
                console.error(error)
                document.getElementById('error-message').innerHTML = '<p>There was a system error. Please try again later</p>'
            })

    }
    else
    {
        document.getElementById('error-message').innerHTML = '<p>Item title can\'t be empty</p>'
        el.setAttribute('contenteditable', 'true')
        root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.add('invisible'))
        root.querySelectorAll('.new-state-btn').forEach((node) => node.classList.remove('invisible'))
    }
}

window.cancelNewItem = function(e){
    const [el] = e.target.parentElement.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'false')
    e.target.parentElement.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('invisible'))
    e.target.parentElement.querySelectorAll('.new-state-btn').forEach((node) => node.classList.add('invisible'))
}

window.newItemClicked = function(e) {
    const root = e.target.parentElement.parentElement
    root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.add('invisible'))
    root.querySelectorAll('.new-state-btn').forEach((node) => node.classList.remove('invisible'))
}

window.itemCheckboxClicked = function(e) {
    const item_id = e.target.parentElement.parentElement.getAttribute('data-id')
    const checked_status = e.target.checked
    const data = {
        item: {
            completed: checked_status
        }
    }

    updateItem(item_id, data)
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.error(error)
            document.getElementById('error-message').innerHTML = '<p>There was a system error. Please try again later</p>'
        })
}

window.trashItemClicked = function(e){
    const item_id = e.target.parentElement.parentElement.getAttribute('data-id')
    deleteItem(item_id)
    .then(function(response) {
        e.target.parentElement.parentElement.remove()
    })
    .catch(function(error) {
        document.getElementById('error-message').innerHTML = '<p>There was a system error. Please try again later</p>'
    })
}

window.editItemClicked = function(e){
    const root = e.target.parentElement.parentElement
    const item_id = root.getAttribute('data-id')
    const [el] = root.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'true')
    findChildWithClass(root, 'main-state-btn').classList.add('d-none')
    findChildWithClass(root, 'edit-state-btn').classList.remove('d-none')
}

window.cancelEditItem = function(e){
    const root = e.target.parentElement.parentElement
    const item_id = root.getAttribute('data-id')
    const [el] = root.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'false')
    root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('d-none'))
    root.querySelectorAll('.edit-state-btn').forEach((node) => node.classList.add('d-none'))
}

window.acceptEditItem = function(e){
    const root = e.target.parentElement.parentElement
    const item_id = root.getAttribute('data-id')
    const [el] = root.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'false')
    const item_title = el.innerText
    if (item_title != "") {
        const data = {
            item: {
                title: item_title
            }
        }
        updateItem(item_id, data)
            .then(function(response) {
                console.log(response)
            })
            .catch(function(error) {
                console.error(error)
                document.getElementById('error-message').innerHTML = '<p>There was a system error. Please try again later</p>'
            })
        root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('invisible'))
        root.querySelectorAll('.edit-state-btn').forEach((node) => node.classList.add('invisible'))
    }
    else
    {
        document.getElementById('error-message').innerHTML = '<p>Item title can\'t be empty</p>'
        el.setAttribute('contenteditable', 'true')
        root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.add('invisible'))
        root.querySelectorAll('.edit-state-btn').forEach((node) => node.classList.remove('invisible'))
    }

}

window.newSubItemClicked = function(e) {
    if($('#subitem-form').length > 0) {
        document.getElementById('error-message').innerHTML = '<p>Already opened</p>'
    } else {
        const subitem_div = $('<div>')
                            .addClass('subitem')
                            .attr('id', 'subitem-form')
        const title = $('<div>')
                        .addClass('item-title')
                        .attr('contenteditable', true)
        const accept = $('<i/>')
                        .addClass('fa fa-check')
                        .attr({onclick: 'acceptNewSubItem(event)'})
        const cancel = $('<i/>')
                        .addClass('fa fa-window-close')
                        .attr({onclick:'cancelNewSubItem(event)'})
        subitem_div.append(title, accept, cancel)

        const root = e.target.parentElement
        root.after(subitem_div[0])
    }
    // const root = e.target.parentElement.parentElement
    // var main_state_buttons= root.getElementsByClassName('main-state-btn')
    // Array.from(main_state_buttons).forEach((el) => {
    //     el.disabled = true;
    // });
    
    // const [item_div] = root.getElementsByClassName('item-card-children')
    // item_div.append(subitem_div[0]  )
}

window.acceptNewSubItem = function(e) {
    const root = e.target.parentElement.parentElement
    const list_id = document.getElementById("list").getAttribute('data-list-id')
    const parent_item = root.getAttribute('data-id')
    console.log(parent_item)
    const [el] = e.target.parentElement.getElementsByClassName('item-title')
    el.setAttribute('contenteditable', 'false')
    const item_title = el.innerText
    if (item_title != "") {
        const data = {
            item: {
                title: item_title,
                parent_item: parent_item
            }
        }

        newItem(list_id, data)
            .then(function(response) {
                root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('invisible'))
                root.querySelectorAll('.subitem').forEach((node) => node.classList.add('invisible'))
                //todo copy item and append

            })
            .catch(function(error) {
                console.error(error)
                document.getElementById('error-message').innerHTML = '<p>There was a system error. Please try again later</p>'
            })
    }
    else
    {
        document.getElementById('error-message').innerHTML = '<p>Item title can\'t be empty</p>'
        el.setAttribute('contenteditable', 'true')
        root.querySelectorAll('.main-state-btn').forEach((node) => node.classList.add('invisible'))
        root.querySelectorAll('.new-state-btn').forEach((node) => node.classList.remove('invisible'))

    }

}

window.cancelNewSubItem = function(e){
    const root = e.target.parentElement.parentElement
    root.querySelectorAll('.subitem').forEach((node) => node.remove())
    // root.removeChild(subitem_div);

    // root.querySelectorAll('.subitem').forEach((node) => node.

    // root.parentElement.parentElement.querySelectorAll('.main-state-btn').forEach((node) => node.classList.remove('invisible'))
    // root.parentElement.parentElement.querySelectorAll('.edit-state-btn').forEach((node) => node.classList.add('invisible'))

}
