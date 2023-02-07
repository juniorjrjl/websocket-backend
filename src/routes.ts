import express from "express"
import { StatusCodes } from "http-status-codes"
import { Topic } from "./models/Topic"
import { User } from "./models/User"

export const routes = express.Router()

routes.post("/users", async (req, res) => {
    try {
        const { name } = req.body

        const userExists = await User.findOne({ name })
        if (userExists) {
            return res.json(userExists)
        }

        const user = new User({ name })
        await user.save()
        return res.status(StatusCodes.CREATED).json(user)

    } catch (err) {
        if (err instanceof Error) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    }
})

routes.get("/topics", async (req, res) => {
    try {
        const topics = await Topic.find({}, "title")
        return res.json(topics)
    } catch (err) {
        if (err instanceof Error) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    }
})

routes.get("/topics/:_id", async (req, res) => {
    try {
        const { _id } = req.params
        const topic = await Topic.findById(_id).populate("messages.author").exec()
        return res.json(topic)
    } catch (err) {
        if (err instanceof Error) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    }
})

routes.post("/topics", async (req, res) => {
    try {
        const { title } = req.body

        const topic = new Topic({ title })
        await topic.save()
        return res.status(StatusCodes.CREATED).json(topic)

    } catch (err) {
        if (err instanceof Error) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    }
})

routes.delete("/topics/:_id", async (req, res) => {
    try {
        const { _id } = req.params

        const topic = await Topic.findById(_id)

        if(!topic) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "topic not found"})
        }

        await topic.delete()
        return res.status(StatusCodes.NO_CONTENT).end()

    } catch (err) {
        if (err instanceof Error) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    }
})
