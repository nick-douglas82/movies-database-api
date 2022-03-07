import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import { type } from 'os';
const cors = require('cors');
const bodyParser = require('body-parser');

const prisma = new PrismaClient()
const app = express()

app.use(cors());

app.use(express.json())

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

interface List {
    title: string
    userId: string
}

type Media = {
    listId: number
    id: number
    poster_path: string
    media_type: string
    title: string
  }

  app.get('/api/lists', async (req, res) => {
    const userId = <string>req.query.userId

    const lists = await prisma.lists.findMany({
        where: {
            userId: userId
        },
        include: { media: true }
    })
    res.json(lists)
  })

  // Create a new list
  app.post('/api/list/new', async (req, res) => {
    const { title, userId }: List = req.body
    const result = await prisma.lists.create({
        data: {
            title: title,
            userId: userId,
            media: {
                create: []
            }
        },
        include: { media: true }
    })

    res.json(result)
  })

  // Create list and add the current media item
  app.post(`/api/list`, async (req, res) => {
    const { title, userId }: List = req.body
    const { id, poster_path, title: mediaTitle, media_type }: Media = req.body.mediaItem

    const result = await prisma.lists.create({
        data: {
            title: title,
            userId: userId,
            media: {
                create: {
                    title: mediaTitle,
                    mediaId: id,
                    type: media_type,
                    imageUrl: poster_path
                }
            }
        },
        include: { media: true }
    })

    res.json(result)
  })

  // Add media to list id
  app.post(`/api/list/:id`, async (req, res) => {
    const { listId }: { listId: number } = req.body
    const { id, poster_path, title: mediaTitle, media_type }: Media = req.body.mediaItem
    const result = await prisma.media.create({
        data: {
            mediaId: id,
            listId: listId,
            imageUrl: poster_path,
            type: media_type,
            title: mediaTitle
        },
    })

    res.json(result)
  })

const server = app.listen(8080, () => console.log(`🚀 Server ready at: http://localhost:8080`))
