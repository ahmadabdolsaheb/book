import React, { Component } from 'react';
import { getAllBooks } from '../../actions/bookActions';
import Book from './Book';
import './Books.css';
import { connect } from 'react-redux';

class Books extends Component { 
  componentWillMount() {
    this.props.getAllBooks();
  }

  render() {
    return (
      <div className="manyBooksContainer">
        {this.props.allBooks.map((book, index) =>
          <Book key={index} book={book} userID={this.props.id} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
      id: state.auth.user.id,
      allBooks: state.books.allBooks
    }
}

export default connect(mapStateToProps, {getAllBooks})(Books);
