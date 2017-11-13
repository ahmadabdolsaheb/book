import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllBooks, unrequestBook, acceptOffer } from '../../actions/bookActions';
import { addFlashMessage } from '../../actions/flashMessages';
import './Offers.css';

class Offers extends Component {
  constructor(props) {
  	 super(props);
    this.unrequestBook = this.unrequestBook.bind(this);
    this.acceptOffer = this.acceptOffer.bind(this);
  }

  unrequestBook(book_id) {
    this.props.unrequestBook(book_id, this.props.username).then(res => {
      this.props.addFlashMessage({
        type: this.props.messages.messageType,
        text: this.props.messages.messageMessage
      });    
    });
  }
  
  acceptOffer(book_id, reqUsername) {
    this.props.acceptOffer(book_id, this.props.username, reqUsername).then(res => {
      this.props.addFlashMessage({
        type: this.props.messages.messageType,
        text: this.props.messages.messageMessage
      });    
    });
  }
  
  isRequested(book) {
    for(let i=0; i < book.requested_From.length; i++) {
      if(book.requested_From[i] === this.props.username && !book.request_accepted) {
        return true;
      }
    }
    return false;
  }
  
  componentWillMount() {
    this.props.getAllBooks();
  }
  
  render() {
    const bookMap = this.props.allBooks.reduce((bookMap, book) => {

    	//offers - if my book && someone wants it
  	   if(this.props.username === book.current_owner && book.requested_From.length > 0 && !book.request_accepted) {
        bookMap.offers.push(book);  	 

      //requests - if i requested a book
  	   } else if (this.isRequested(book)) {
        bookMap.requests.push(book);

      //acceptedOffers - books i have traded away
  	   } else if (book.request_accepted && book.current_owner === this.props.username) {
  	     bookMap.acceptedOffers.push(book);

  	   //acceptedRequests - books i have received
  	   } else if (book.request_accepted && book.requested_From[0] === this.props.username) {
  	     bookMap.acceptedRequests.push(book);
  	   }
      return bookMap;
  	 }, {offers: [], requests: [], acceptedOffers: [], acceptedRequests: []});

    return (
      <div>
        <div className="offersContainer">
          <div className="offersTitle">Pending Offers</div>
          {bookMap.offers.map(book =>
          <div>
            {book.requested_From.map(user =>
              <div className="singleOfferContainer">
                <div className="offerDetail">{user} wants 
                  <a href={book.bookUrl} className="bookTitleDetail" target="_blank">{book.title}</a>
                  <div className="offerDetail"> from you</div>
                </div>
                <button onClick={() => this.acceptOffer(book._id, user)} className="btn btn-primary offerBtn">accept</button>
              </div>
            )}
            </div>
          )}
        </div>
        <hr />
        
        <div className="offersContainer">
          <div className="offersTitle">Current Requests</div>
          {bookMap.requests.map(book =>
            <div className="singleOfferContainer">
              <div className="offerDetail">You requested 
                <a href={book.bookUrl} className="bookTitleDetail" target="_blank">{book.title}</a>
              </div>
              <button onClick={() => this.unrequestBook(book._id)} className="btn btn-secondary offerBtn">unrequest</button>
            </div>
          )}
        </div>
        <hr />
        
        <div className="offersContainer">
          <div className="offersTitle">Books Received</div>
          {bookMap.acceptedRequests.map(book =>
            <div className="singleOfferContainer">
              <div className="offerDetail">Your request for
                <a href={book.bookUrl} className="bookTitleDetail" target="_blank">{book.title}</a>
                <div className="offerDetail"> has been accepted</div>
              </div>
            </div>
          )}
        </div>
        <hr />
        
        <div className="offersContainer">
          <div className="offersTitle">Offers Closed</div>
          {bookMap.acceptedOffers.map(book =>
            <div className="singleOfferContainer">
              <div className="offerDetail">You gave 
                <a href={book.bookUrl} className="bookTitleDetail" target="_blank">{book.title}</a>
                <div className="offerDetail">to {book.requested_From[0]}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  	 username: state.auth.user.username,
  	 id: state.auth.user.id,
    allBooks: state.books.allBooks,
    messages: state.books.message
  }
}

export default connect(mapStateToProps, {getAllBooks, unrequestBook, acceptOffer, addFlashMessage})(Offers);
