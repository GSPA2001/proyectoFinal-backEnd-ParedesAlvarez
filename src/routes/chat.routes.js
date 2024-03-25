/* import { Router } from 'express';
import messageModel from '../models/messages.model.js';

const router = Router()

router.get('/chat', async (req, res) => {
    try {
        const messages = await messageModel.find().lean().exec()
        res.render('chat', { messages })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router */