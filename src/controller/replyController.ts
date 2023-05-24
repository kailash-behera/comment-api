import { query } from '../database';
import { AppException } from '../exceptions';
import { Request, Response, NextFunction } from 'express';


export const postReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, comment } = req.body;
        const comment_id: string = req.params.id;

        if (!name || !comment || !comment_id) {
            return next(new AppException('Please provide name and reply_text.', 400));
        }

        const { rows } = await query(`
            INSERT INTO tbl_comments_reply (comment_id, name, reply_text) 
            VALUES ($1, $2, $3) RETURNING *;`,
            [comment_id, name, comment]
        );

        const [newReply] = rows;

        if (!newReply) {
            return next(new AppException());
        }

        return res.status(201).json(newReply);

    } catch (error) {
        return next(new AppException(error.message, 500));
    }
}