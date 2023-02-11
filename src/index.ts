import dotenv from 'dotenv'
import  express from 'express';
import cors from 'cors'
import { routes } from './routes';
import { connect } from './database';
import http from 'node:http'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Topic } from './models/Topic';

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*'} })

app.use(cors())
app.use(express.json())
app.use(routes)
io.on("connection", (socket) =>{

    socket.on("join_room", async ({name, topicId}) =>{
        socket.join(topicId)

        const systemMessage = {
            _id: new mongoose.Types.ObjectId(),
            content: `${name} entrou na sala`,
            createdAt: new Date()
        }

        io.to(topicId).emit('new_message', systemMessage)
    })

    socket.on("send_message", async ({content, author, topicId}) =>{
        const topic = await Topic.findById(topicId)

        const message = {
            _id: new mongoose.Types.ObjectId(),
            content,
            author,
            createdAt: new Date()
        }

        topic?.messages.push(message)
        await topic?.save()
        io.to(topicId).emit("new_message", message)
    })

    socket.on("leave_room",async ({name, topicId}) => {
        socket.leave(topicId)

        const systemMessage = {
            _id: new mongoose.Types.ObjectId(),
            content: `${name} saiu na sala`,
            createdAt: new Date()
        }

        io.to(topicId).emit('new_message', systemMessage)
    })
})
connect()

server.listen(process.env.SERVER_PORT!, () => console.log(`Application started on http://localhost:${process.env.SERVER_PORT!}`))