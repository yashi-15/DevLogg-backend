import fs from 'fs'
import cloudinary from '../utils/cloudinary.js';


export const uploadImageCloudinary = async (req, res) =>{
    try {
        if (!req.file) return res.status(400).json({"error": "No file provided"})

        console.log("doing");
        
        //upload file on cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image"
        })
        console.log("done");
        
        fs.unlinkSync(req.file.path)

        res.status(200).json({
            secure_url: result.secure_url,
            public_id: result.public_id
        })

    } catch (error) {
        if (req.file?.path) fs.unlinkSync(req.file.path)  //remove locally saved temp file as operation got failed
        res.status(500).json({ "error": error.message })
    }
}
export const deleteImageCloudinary = async (req, res) =>{
    try {
        const { public_id } = req.body
        if (!public_id) return res.status(400).json({ "error": 'public_id is required' })

        const result = await cloudinary.uploader.destroy(public_id)

        if (result.result !== 'ok') {
            return res.status(400).json({ "error": 'Failed to delete image' })
        }

        res.status(200).json({ "message": 'Image deleted successfully' })
    } catch (error) {
        res.status(500).json({ "error": error.message })
    }
}
