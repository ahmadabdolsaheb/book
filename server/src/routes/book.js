import express from 'express';
import axios from 'axios';
import { without } from 'lodash';
import authenticate from '../middlewares/authenticate';
import books from '../models/books';
import user from '../models/users';

let fetch = require('node-fetch');
let router = express.Router();

router.get('/allBooks',(req,res)=>{
   books.find().then(r => {
     res.send(r)
   }).catch(e => { 
     res.send([e])
   });
});

router.post('/addBook', (req, res) => {
  const {isbn, username} = req.body;
  let message = {'messageType': 'success', 'messageMessage': 'Book Added'};
 
  async function getBookFromIsbn(isbn, username){
    //api of openbooks which returns the book details for the given isbn number
    let url = "https://openlibrary.org/api/books?bibkeys=ISBN:"+isbn+"&jscmd=data&format=json";

    books.find().then(allBooks => {  
	   fetch(url).then(json => {
	     json.json().then(output0 => {    	  
	       let output = output0[`ISBN:${isbn}`];
	        
	       //save as a model
	       var newBook = new books({
	         ISBN: parseInt(isbn),
	         title: output.title,
	         current_owner: username,
	         image: output.cover,
	         bookUrl: output.url
	       });
	       
	       message.messageMessage = '"' + output.title + '" has been added';
	
	       //save in the db
          newBook.save().then(() => {
	         books.find().then(r => {
	           res.send([r,message]);
	         }).catch(e => {
              message = {'messageType': 'error', 'messageMessage': 'ISBN not found'};	         	
	           res.send([[e], message]);
	         });   
	       }).catch(e => {
	         message = {'messageType': 'error', 'messageMessage': 'ISBN not found'};    
	         res.send([allBooks, message]);
	       });
	     }).catch(e => {
	       message = {'messageType': 'error', 'messageMessage': 'ISBN not found'};    
	       res.send([allBooks, message]);
	     });
	   }).catch(e => {
	     message = {'messageType': 'error', 'messageMessage': 'ISBN not found'};    
        res.send([allBooks, message]);
	   });
	 }).catch(e => { 
      message = {'messageType': 'error', 'messageMessage': 'ISBN not found'};    
	   res.send([[e], message]); 
    });
  }
  
  getBookFromIsbn(isbn, username);
});

router.patch('/deleteBook/:id', (req, res) => {
  const _id = req.params.id;
  let message = {'messageType': 'error', 'messageMessage': 'This book has been removed'};
 
  async function deleteBookID(_id){
  	 books.find().then(allBooks => {
  	 	books.findOne({"_id":_id}, (err, book) => {
	     if (err) {
	       message = {'messageType': 'error', 'messageMessage': 'server error'};
	       res.send([allBooks, message])      	
	     }

  	     message.messageMessage = '"' + book.title + '" has been removed';
  	     
		  books.remove({_id:_id}).then(() => {
		    books.find().then(r => {
		      res.send([r,message]);
		    }).catch(e => {
		      message = {'messageType': 'error', 'messageMessage': 'server error'};
		      res.send([[e],message]);
		    });
	     }).catch(e => {
		    message = {'messageType': 'error', 'messageMessage': 'server error'};    
		    res.send([allBooks, message]);
		  });
	   });
	 }).catch(e => {
	   message = {'messageType': 'error', 'messageMessage': 'server error'};    
	   res.send([[e], message]);  
	 });
  }

  deleteBookID(_id);
});

router.post('/requestBook', (req, res) => {
  const {_id, username} = req.body;

  let message = {'messageType': 'success', 'messageMessage': 'Book Requested'};

  async function request(_id, username){
    books.find().then(allBooks => {	    
	   books.findOne({ "_id": _id }, (err, book) => {
	     if (err) {
	       message = {'messageType': 'error', 'messageMessage': 'server error'};
	       res.send([allBooks, message])      	
	     }

	     message.messageMessage = '"' + book.title + '" has been requested';
	     book.requested_From.push(username);
	     book.save().then(() => {
	       books.find().then(r => {
	         res.send([r, message])
	       }).catch(e => {
	         message = {'messageType': 'error', 'messageMessage': 'server error'};
	         res.send([[e], message])
	       });		  
	     }).catch(e => {
	       message = {'messageType': 'error', 'messageMessage': 'server error'};
	       res.send([allBooks, message])
	     });
      });
    }).catch(e => {
	   message = {'messageType': 'error', 'messageMessage': 'server error'};    
	   res.send([[e], message]);  
	 });
  }

  request(_id, username);
});

router.post('/unrequestBook', (req, res) => {
  const {_id, username} = req.body;
  let message = {'messageType': 'error', 'messageMessage': 'Book Unrequested'};

  async function unrequest(_id, username){
    books.findOne({"_id":_id}, (err, book) => {
    	if (err) {
        message = {'messageType': 'error', 'messageMessage': 'server error'};
        res.send([[err], message]);
    	}
    	
      message.messageMessage = '"' + book.title + '" is no longer requested';
      let index = book.requested_From.indexOf(username);
         
      if (index > -1) {
        book.requested_From.splice(index, 1);
      }
           
      book.save().then((err) => {
        books.find().then(r => {
          res.send([r, message]);
        }).catch(e => {
          message = {'messageType': 'error', 'messageMessage': 'server error'};    
          res.send([[e], message]);
        });
      }).catch(e => {
        message = {'messageType': 'error', 'messageMessage': 'server error'};    
        res.send([[e], message]);
      }); 
    })
  }

  unrequest(_id, username);
});

router.patch('/acceptOffer', (req, res) => {
	const {_id, username, reqUsername} = req.body;
   let message = {'messageType': 'success', 'messageMessage': 'Offer Accepted'};

   async function accept(_id, username, reqUsername){
     books.find().then(allBooks => {
       books.findOne({"_id":_id}, (err, book) => {
         if (err) {
           message = {'messageType': 'error', 'messageMessage': 'server error'};
           res.send([[err], message]);  	
      	}
    	
    		message.messageMessage = 'Offer for "' + book.title + '" has been accepted';
         book.requested_From = [reqUsername];
         book.request_accepted = true;

         book.save().then(() => {
           books.find().then(r => {
             res.send([r, message]);
           }).catch(e => {
             message = {'messageType': 'error', 'messageMessage': 'server error'};    
             res.send([[e], message]);
           });
         }).catch(e => {
           message = {'messageType': 'error', 'messageMessage': 'server error'};    
           res.send([allBooks, message]);
         });
       }).catch(e => {
         message = {'messageType': 'error', 'messageMessage': 'server error'};    
         res.send([[e], message]); 
       });
     });
   }
   
   accept(_id, username, reqUsername);
});

export default router;
