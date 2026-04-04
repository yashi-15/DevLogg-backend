import express from 'express'
import { deleteImageCloudinary, uploadImageCloudinary } from '../controllers/cloudinary.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = express.Router()

router.post("/upload", upload.single('file') , uploadImageCloudinary)
router.post("/delete", deleteImageCloudinary)

export default router