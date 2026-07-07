import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { postController } from "./post.controller";

const router = Router()


router.post('/',auth(Role.ADMIN,Role.AUTHOR,Role.USER),postController.createPosts)
router.get('/',postController.getAllPosts)
router.get('/status',auth(Role.ADMIN),postController.getPostStatus)
router.get('/my-post',auth(Role.ADMIN,Role.AUTHOR,Role.USER),postController.getMyPosts)
router.get('/:postId',postController.getPostById)
router.patch('/:postId',auth(Role.ADMIN,Role.AUTHOR,Role.USER),postController.updatePost)
router.delete('/:postId',auth(Role.ADMIN,Role.AUTHOR,Role.USER),postController.deletePost)

export const postRoutes = router