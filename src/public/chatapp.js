import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import ChatRoom from './chatroom';
import ChatWith from './chatwith';

class ChatApp extends React.Component {

	constructor(props) {
		super(props);
		this.socket = io('http://10.199.248.129:3000', {query:`user=${this.props.user}`});
		// this.socket = io('http://localhost:3000', {query:`user=${this.props.user}`});
		this.state = {
			userList : [],
			roomList: [],
			roomNames: []
		};

		this.socket.on('users', (users) => {
			console.log(users);
			this.setState({
				userList: users
			});
		});

		this.socket.on('newChat', (chatRoomObj) => {
			
			console.log(chatRoomObj);
			let roomTitle = `Chat between ${chatRoomObj.users[0]} and ${chatRoomObj.users[1]}`;
			let roomExists = this.state.roomNames.filter((name) => {
				return roomTitle === name;
			});
			if(roomExists.length === 0) {
				this.setState({
					roomList : this.state.roomList.concat([
						<ChatRoom key={Math.random()} roomName={chatRoomObj.room} title={roomTitle} socket={this.socket} user={this.props.user} />
					]),
					roomNames: this.state.roomNames.concat([roomTitle])
				});
			}

		});

		this.newChat = this.newChat.bind(this);

	}

	newChat(chatWithUser) {
		this.socket.emit('privatechat', [this.props.user, chatWithUser]);
	}


	render() {
		return (
			<MuiThemeProvider>
				<div>
					<AppBar
						className="appBar"
						title="Chat!" />
					<div className="container-fluid app-body" style={{ paddingTop:'10px' }}>
						<div className="row">
							<ChatRoom roomName="roomOne" socket={this.socket} title="All" user={this.props.user} />
							<ChatWith userList={this.state.userList} myself={this.props.user} newChat={this.newChat}/>
						</div>
						<div className="row" ref="newChat">
							{this.state.roomList}
						</div>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default ChatApp;