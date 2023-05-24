import { Router } from "express";
import commentsRoutes from "./commentsRoutes";
import replyRoutes from "./replyRoutes";

const router: Router = Router();

export default (version: string = 'v1'): Router => {
    commentsRoutes(router, 'comments', version);

    replyRoutes(router, 'comments', version)

    return router;
}