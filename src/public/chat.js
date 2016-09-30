'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './chatapp';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var user = getParameterByName('user');
// var socket = io();
// socket.on('message', function (data) {
// 	console.log(data);
// });
// function createRoomOne() {
// 	let roomOneDiv = document.getElementById('roomOne');
// 	socket.emit('subscribe', 'roomOne');
// }

if(user && user.length > 0 && user !== '<Pick') {
	ReactDOM.render(<Chat user={user}/>, document.getElementById('app'));
} else {
	alert("change the user query parameter to your name");
}
