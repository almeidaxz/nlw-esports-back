import express from 'express';
import { PrismaClient } from '@prisma/client';
import { formatHoursToMinutes, formatMinutesToHours } from './utils/format';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    // log: ['query']
});

app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })

    return res.json(games);
});
app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const body = req.body;

    console.log(body)
    console.log(gameId)

    try {
        const ad = await prisma.ad.create({
            data: {
                gameId,
                name: body.name,
                yearsPlaying: body.yearsPlaying,
                discord: body.discord,
                weekDays: body.weekDays,
                hourStart: formatHoursToMinutes(body.hourStart),
                hourEnd: formatHoursToMinutes(body.hourEnd),
                useVoiceChat: body.useVoiceChat
            }
        })
        return res.status(201).json(ad);
    } catch (error) {
        console.log(error)
    }

});

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChat: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return res.json(ads.map(ad => {
        return {
            ...ad,
            hourStart: formatMinutesToHours(ad.hourStart),
            hourEnd: formatMinutesToHours(ad.hourEnd)
        }
    }))
});

app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id;


    try {
        const discord = await prisma.ad.findUniqueOrThrow({
            select: {
                discord: true
            },
            where: {
                id: adId
            }
        })

        return res.json(discord);
    } catch (error) {
        console.log(error)
    }
});

app.listen(3333);