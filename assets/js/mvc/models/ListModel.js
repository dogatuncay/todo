import Model from '../Model';
import Types from '../Types';


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

function fetchAPI(path, method, jsonData) {
  return fetch(path, {
    method,
    body: JSON.stringify(jsonData),
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
    });
}

const ListModel = Model.define({
  name: 'List',
  schema: {
    title: Types.STRING
  },
  create: function(data) {
    return fetchAPI(`/api/lists/`, 'POST', {list: data});
  },
  get: function(id) {
    return new Promise((success, failure)  => {
      success({id, title: "yolo"});
    });
  },
  update: function(data) {
    return fetchAPI(`/api/lists/${this.id}`, 'PUT', {list: data})
      .then(() => data);
  },
  destroy: function() {
    return fetchAPI(`/api/lists/${this.id}`, 'DELETE', {});
  }
});

export default ListModel;
