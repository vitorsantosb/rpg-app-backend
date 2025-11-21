import express from 'express';
import {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();
import userController from '@routes/controller/user.controller';
import campaignController from '@routes/controller/campaign.controller';


app.use(cors({
	origin: '*',
	credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: ['Access-Control-Allow-Origin','Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

app.use(cookieParser());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb',
	parameterLimit: 50000
}));

app.use('/user', userController);
app.use('/campaign', campaignController);

app.use((_req: Request, res: Response, next: NextFunction): void => {
	res.header('Access-Control-Allow-Origin', ['*']);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (_req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		res.status(200).json({});
	} else {
		next();
	}
});

app.use((req: Request, res: Response, next: NextFunction) => {
	const err = new Error('Not Found');
	next(err);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	res.json({
		error: {
			message: error.message
		}
	});
});

export default app;
