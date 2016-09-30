import React from 'react';
import { Card, CardText, CardTitle } from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

const ChatWith = ({userList, myself, newChat}) => { 
	let listItems = [];

	userList.forEach((user) => {
		if(user !== myself) {
			listItems.push(
				<ListItem primaryText={user} key={`${user}-${Math.random()}`} onClick={() => {
					newChat(user);
				}}/>
			);
		}
	});
	return (
		<div className="col-md-6">
			<Card>
				<CardTitle title="Users" />
				<List>
					{listItems}
				</List>
			</Card>
		</div>
	);
};


export default ChatWith;