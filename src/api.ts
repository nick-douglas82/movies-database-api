import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllLists = async (userId: string) => {
    const lists = await prisma.lists.findMany({
        orderBy: {
            id: 'asc'
        },
        where: {
            userId: userId
        },
        include: { media: true }
    })

    return lists;
}

export const createListWithoutMedia = async (userId: string, title: string) => {
    const list = await prisma.lists.create({
        data: {
            title: title,
            userId: userId,
            media: {
                create: []
            }
        },
        include: { media: true }
    })

    return list;
}

export const createListWithMedia = async (userId: string, title: string, media: any) => {
    const list = await prisma.lists.create({
        data: {
            title: title,
            userId: userId,
            media: {
                create: media
            }
        },
        include: { media: true }
    })

    return list;
}

export const createMedia = async (listId: number, id: number, poster_path: string, title: string, media_type: string) => {
    const result = await prisma.media.create({
        data: {
            mediaId: Number(id),
            listId: Number(listId),
            imageUrl: poster_path,
            type: media_type,
            title: title
        },
    })

    return result;
}

export const updateListTitle = async (uid: string, listId: number, title: string) => {
    const result = await prisma.lists.update({
        where: { id: Number(listId) },
        data: {
            title: title,
            userId: uid,
        },
        include: { media: true }
    })

    return result;
}

export const deleteList = async (listId: number) => {
    const deleteMedia = prisma.media.deleteMany({
        where: {
          listId: Number(listId),
        },
      })

    const deleteListRequest = prisma.lists.delete({
        where: { id: Number(listId) },
    })

    const transaction = await prisma.$transaction([deleteMedia, deleteListRequest])
    return transaction;
}