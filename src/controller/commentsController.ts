import { query } from "../database";
import { AppException } from '../exceptions';
import { NextFunction, Request, Response } from "express";

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await query(`
            SELECT 
                *
            FROM
                tbl_comments
            WHERE
                is_deleted = false
            ORDER BY 
                comment_on DESC
        `);

        const results = await query(`SELECT * FROM tbl_comments_reply ORDER BY comment_id, reply_on DESC`);

        let comments: any[] = rows.map(comment => {
            return {
                ...comment,
                replies: results.rows.filter(r => r.comment_id === comment.id)
            };
        });

        return res.status(200).json(comments);

    } catch (error) {
        return next(new AppException(error.message, 500));
    }
}

export const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment_id: string = req.params.id;

        if (!comment_id) {
            return next(new AppException('Please provide comment_id', 400));
        }

        const { rows } = await query(`SELECT * FROM tbl_comments WHERE id = $1;`, [comment_id]);

        const [comment] = rows;

        if (!comment) {
            return next(new AppException(`comment not found on id : ${comment_id}`, 404));
        }

        return res.status(200).json(comment);

    } catch (error: any) {

        return next(new AppException(error.message, 500));
    }
}

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, comment } = req.body;

        if (!name || !comment) {
            return next(new AppException('Please provide name and comment.', 400));
        }

        const { rows } = await query(`
            INSERT INTO tbl_comments (name, comment_text) 
            VALUES ($1, $2) RETURNING *;`,
            [name, comment]
        );

        const [newComment] = rows;

        if (!newComment) {
            return next(new AppException());
        }

        return res.status(201).json(newComment);

    } catch (error) {
        return next(new AppException(error.message, 500));
    }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment_id: string = req.params.id;
        const { name, comment } = req.body;

        if (!name || !comment || !comment_id) {
            return next(new AppException('Please provide parameters', 400));
        }

        const result = await query(`
            UPDATE tbl_comments SET name = $1, comment_text = $2
            WHERE id = $3`,
            [name, comment, comment_id]
        );

        if (!result.rowCount) {
            return next(new AppException('Please try again.', 400));
        }

        return res.status(200).json({ message: 'Comment Updated.' });

    } catch (error) {
        return next(new AppException(error.message, 500));
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment_id: string = req.params.id;

        if (!comment_id) {
            return next(new AppException('Please provide comment_id', 400));
        }

        const { rows } = await query(`SELECT * FROM tbl_comments WHERE id = $1 AND is_deleted = false;`, [comment_id]);

        const [comment] = rows;

        if (!comment) {
            return next(new AppException(`comment not found on id : ${comment_id}`, 404));
        }

        const { rowCount } = await query(`UPDATE tbl_comments SET is_deleted = true WHERE id = $1;`, [comment_id]);

        if (!rowCount) {
            return next(new AppException());
        }

        return res.status(200).json({ message: 'Deleted Successfully' });

    } catch (error) {
        return next(new AppException(error.message, 500));
    }
}
