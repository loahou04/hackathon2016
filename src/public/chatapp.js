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
		this.socket = io('http://localhost:3000', {query:`user=${this.props.user}`});
		this.state = {
			userList : [],
			roomList: []
		};

		this.socket.on('users', (users) => {
			console.log(users);
			this.setState({
				userList: users
			});
		});

		this.socket.on('newChat', (chatRoom) => {
			// this.refs.newChat.appendChild(
			// 	<ChatRoom roomName={chatRoom} socket={this.socket} user={this.props.user} />
			// );
			this.setState({
				roomList : this.state.roomList.concat([
					<ChatRoom key={Math.random()} roomName={chatRoom} socket={this.socket} user={this.props.user} />
				])
			});
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
							<ChatRoom roomName="roomOne" socket={this.socket} user={this.props.user} />
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