import { VercelRequest, VercelResponse } from "@vercel/node";
import { deleteList, updateListTitle } from "../../src/api";

export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method === 'PATCH') {
        const listId = Number(request.query.id)
        const { uid, title }: { uid: string, title: string } = request.body
        response.status(200).json(await updateListTitle(uid, listId, title))
    }
    
    if (request.method === 'DELETE') {
        const listId = Number(request.query.id)
        response.status(200).json(await deleteList(listId))
    }
}