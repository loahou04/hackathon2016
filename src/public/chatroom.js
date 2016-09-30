import React from 'react';
import { Card, CardText, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class ChatRoom extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			messages: []
		};
	}

	componentDidMount() {
		this.props.socket.emit('subscribe', {room: this.props.roomName, user: this.props.user});
		this.props.socket.on(`${this.props.roomName}message`, (data) => {
			console.log(data.message);
			this.setState({
				messages: this.state.messages.concat(data)
			});
		});
	}

	keyDown(ev) {
		if(ev.keyCode === 13) {
			this.sendMessage();
		}
	}

	sendMessage() {
		if(this.refs.messageField.getValue().length > 0) {
			this.props.socket.emit('send', {
				room: this.props.roomName, 
				text: this.refs.messageField.getValue(),
				user: this.props.user
			});
			this.refs.messageField.input.value = '';
		}
	}	

	render() {
		let chatText = [];
		this.state.messages.forEach((message) => {
			chatText.push(
				<div key={`${message.text}-${Math.random()}`}>
					{message.user}: {message.text}
				</div>
			);
		});
		return (
			<div className="col-md-6" style={{ paddingTop: '10px' }}>
				<Card>
					<CardTitle title={this.props.title} />
					<CardText>
						{chatText}
					</CardText>
					<div>
						<TextField name="messageText" ref="messageField" onKeyDown={(ev) => {this.keyDown(ev)}}/>
						<FlatButton onClick={() => { this.sendMessage() }} label="Send" />
					</div>
				</Card>
			</div>
		);
	}
}

export default ChatRoom;