import {Server} from 'socket.io';
import { Server as HttpServer } from 'http';
import {WebSocketLogMessage} from '@configs/logs/logMessages';

const io = new Server();

export function SetupWebSocket(server: HttpServer) {
	const io = new Server(server, {
		cors: {
			origin: ['http://localhost:3001'],
			methods: ['GET,PUT,PATCH,POST'],
			allowedHeaders: ['Access-Control-Allow-Origin','Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
			credentials: true,
		},
	});
	
	io.on('connection', (socket) => {
		WebSocketLogMessage('[WEBSOCKET_SERVER]','New client connected:', socket.id);
		
		socket.on('message', (data) => {
			WebSocketLogMessage('[WEBSOCKET_SERVER]','Message received:', data);
			io.emit('message', data);
		});
		
		socket.on('client_connected', (data) => {
			WebSocketLogMessage('[WEBSOCKET_SERVER]','Client connected:', socket.id);
			
		});
		
		socket.on('disconnect', () => {
			WebSocketLogMessage('[WEBSOCKET_SERVER]','Client disconnected:', socket.id);
		});
	});
	
	return io;
}