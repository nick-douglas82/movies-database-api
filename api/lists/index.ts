import { VercelRequest, VercelResponse } from "@vercel/node";
import { createListWithMedia, createListWithoutMedia, getAllLists } from "../../src/api";

type Media = {
    listId: number
    id: number
    poster_path: string
    media_type: string
    title: string
}

export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method === 'GET') {
        const { userId }: { userId: string } = request.body
        response.status(200).json(await getAllLists(userId))
    }

    if (request.method === 'POST') {
        const { title, userId }: { title: string, userId: string } = request.body

        if (!request?.body?.mediaItem) {
            response.status(200).json(await createListWithoutMedia(userId, title))
        } else {
            const { id, poster_path, title: mediaTitle, media_type }: Media = request.body.mediaItem
            response.status(200).json(await createListWithMedia(userId, title, {
                title: mediaTitle,
                mediaId: id,
                type: media_type,
                imageUrl: poster_path
            }))
        }

    }
};