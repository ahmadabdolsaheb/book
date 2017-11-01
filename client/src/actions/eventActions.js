import axios from 'axios';

export function createEvent(event) {
  return dispatch => {
    return axios.post('/api/events', event)
  };
}

var config = {
  headers: {'Authorization': 'Bearer ' + process.env.REACT_APP_ACCESS_TOKEN}
};

export function loadBars(location) {
  return dispatch => {
    return axios.get('/api/events', location, config)
  };
}
