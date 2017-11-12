import React from 'react';

export function GetIfHasImage(props) {
  //if has image
  if(props.book.image) {
    return <img className="bookImage" src={props.book.image.large} alt="☒" />
  } else { 
    return <h4 className="bookImage">{props.book.title}</h4>  
  }
}

export function GetBookStatus(props) {
  //if not logged in
  if(!props.userID) {
    return <li></li>
  }

  //if my book  
  if(props.username === props.book.current_owner && !props.book.request_accepted) {
    return <li>- Your book -</li>
  }
  
  //if I already requested
  for(let i=0; i<props.book.requested_From.length; i++) {
    if (props.book.requested_From[i] === props.username && !props.book.request_accepted) {
      return <li>- You want this -</li>
    }
  }
  
  //if not my book - and not already requested by me
  if(props.username !== props.book.current_owner  && !props.book.request_accepted) {
    return <li>Available!</li>
  } 

  return <li></li>
}

export function GetBookStatus2(props) {
  //if not logged in
  if(!props.userID) {
    return <div></div>
  }

  //if my book  
  if(props.username === props.book.current_owner && !props.book.request_accepted) {
    return <button onClick={props.deleteBook} className="btn btn-danger bookButtonRight">delete</button>
  }
  
  //if I already requested
  for(let i=0; i<props.book.requested_From.length; i++) {
    if (props.book.requested_From[i] === props.username && !props.book.request_accepted) {
      return <button onClick={props.unrequestBook} className="btn btn-secondary bookButtonRight">unrequest</button>
    }
  }
  
  //if not my book - and not already requested by me
  if(props.username !== props.book.current_owner  && !props.book.request_accepted) {
    return <button onClick={props.requestBook} className="btn btn-primary bookButtonRight">request</button>
  } 

  return <div></div>
}
