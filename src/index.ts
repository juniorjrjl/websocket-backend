import dotenv from 'dotenv'
import  express from 'express';
import cors from 'cors'
import { routes } from './routes';
import { connect } from './database';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
connect()

app.listen(process.env.SERVER_PORT!, () => console.log(`Application started on http://localhost:${process.env.SERVER_PORT!}`))