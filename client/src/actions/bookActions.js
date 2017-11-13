import axios from 'axios';
import {LOAD_ALL_BOOKS, BOOKS_AND_MESSAGE } from './types';

export function loadAllBooks(allBooks) {
  return {
    type: LOAD_ALL_BOOKS,
    allBooks
  };
}

export function allBooksPlusMessage(allBooks, messages) {
  return {
    type: BOOKS_AND_MESSAGE,
    allBooks,
    messages
  };
}

export function getAllBooks() {
  return dispatch => {
    return axios.get('/api/book/allBooks').then(res => {
      const allBooks = res.data;
      dispatch(loadAllBooks(allBooks));
    });
  }
}

export function addNewBook(data) {
  return dispatch => {
    return axios.post('/api/book/addBook', data).then(res => {
      const allBooks = res.data[0];
      const messages = res.data[1];
      dispatch(allBooksPlusMessage(allBooks, messages));
    });
  }
}

export function requestBook(_id, username) {
  return dispatch => {
    return axios.post('/api/book/requestBook', {_id, username}).then(res => {
      const allBooks = res.data[0];
      const messages = res.data[1];
      dispatch(allBooksPlusMessage(allBooks, messages));
    });
  }
}

export function deleteBook(_id) {
  return dispatch => {
    return axios.patch('/api/book/deleteBook/' + _id).then(res => {
      const allBooks = res.data[0];
      const messages = res.data[1];
      dispatch(allBooksPlusMessage(allBooks, messages));
    });
  }
}

export function unrequestBook(_id, username) {
  return dispatch => {
    return axios.post('/api/book/unrequestBook', {_id, username}).then(res => {
      const allBooks = res.data[0];
      const messages = res.data[1];
      dispatch(allBooksPlusMessage(allBooks, messages));
    });
  }
}

export function acceptOffer(_id, username, reqUsername) {
  return dispatch => {
    return axios.patch('/api/book/acceptOffer', {_id, username, reqUsername}).then(res => {
      const allBooks = res.data[0];
      const messages = res.data[1];
      dispatch(allBooksPlusMessage(allBooks, messages));
    });
  }
}
