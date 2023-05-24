import { deleteComment, getComment, getComments, postComment, updateComment } from "../controller/commentsController";
import { Router } from "express";

export default (router: Router, path: string = 'comments', version: string): Router => {

    router.get(`/${version}/${path}`, getComments);

    router.get(`/${version}/${path}/:id`, getComment);

    router.post(`/${version}/${path}`, postComment);

    router.put(`/${version}/${path}/:id`, updateComment);

    router.delete(`/${version}/${path}/:id`, deleteComment);

    return router;
}