import express from 'express';
import db from './config/sequelize';
import cors from 'cors';

const app = express();

// Port
const PORT = process.env.PORT || 5000;

import * as dotenv from 'dotenv';
dotenv.config();

// Sequelize
db.sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err: any) => console.log('Error: '+err));

app.use(cors({
    origin: process.env.WEB_URL,
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Set-Cookie','Authorization'],
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Session cookie
import session from 'express-session';
declare module 'express-session' {
    interface SessionData {
      id_person:number;
    }
}
import SequelizeStoreImport from 'connect-session-sequelize';
const SequelizeStore = SequelizeStoreImport(session.Store);
const sessionStore = new SequelizeStore({db: db.sequelize});
if (process.env.NODE_ENV==='production') app.set('trust proxy', 1);
app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET as string,
        store: sessionStore,
        cookie: { 
            path: '/',
            maxAge: 1000*3600*24, // 1 day in milliseconds
            sameSite: 'lax',
            secure: false,
            httpOnly: true
        },
        saveUninitialized: false,
        resave: false
    })
);
sessionStore.sync();

// Routes : services
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/person', require('./routes/person')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/follow', require('./routes/follow')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/post', require('./routes/post')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/hashtag', require('./routes/hashtag')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/likepost', require('./routes/likepost')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/comment', require('./routes/comment')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/likecomment', require('./routes/likecomment')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/notification', require('./routes/notification')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/login', require('./routes/login')); 
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/auth', require('./routes/auth'));

// Swagger
import swaggerUI from 'swagger-ui-express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('../api/swagger/swagger.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));