import { VercelRequest, VercelResponse } from "@vercel/node";
import { createMedia } from "../../src/api";

export default async (request: VercelRequest, response: VercelResponse) => {
    const { listId, id, poster_path, title, media_type  }: { listId: number, id: number, poster_path: string, title: string, media_type: string } = request.body
    response.status(200).json(await createMedia(listId, id, poster_path, title, media_type))
}