
//Api calls
window.newList = function(list_data) {
    return fetch(`/api/lists/`, {
        method: 'POST',
        body: JSON.stringify(list_data),
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

window.updateList = function(list_id, list_data) {
    return fetch(`/api/lists/${list_id}`, {
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

window.deleteList = function(list_id) {
    return fetch(`/api/lists/${list_id}`, {
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

window.listClicked = function(e) {
}

window.trashListClicked = function(e) {
}

window.editListClicked = function(e) {
}

window.acceptEditList = function(e) {
}

window.cancelEditList = function(e) {
}

window.newListClicked = function(e) {
}

window.acceptNewList = function(e) {
}

window.cancelNewList = function(e) {
}