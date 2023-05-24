import { postReply } from "../controller/replyController";
import { Router } from "express";


export default (router: Router, path: string = 'comments', version: string): Router => {

    router.post(`/${version}/${path}/:id/reply`, postReply);

    return router;
}