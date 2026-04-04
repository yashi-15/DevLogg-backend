import fs from 'fs'


export const uploadImageCloudinary = async (req, res) =>{
    try {
        if (!req.file) return res.status(400).json({"error": "No file provided"})

        // Convert buffer to base64 and upload to Cloudinary
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

        console.log("doing");
        
        //upload file on cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            resource_type: "image"
        })
        console.log("done");
        
        
        res.status(200).json({
            secure_url: result.secure_url,
            public_id: result.public_id
        })

    } catch (error) {
        fs.unlinkSync(req.file)  //remove locally saved temp file as operation got failed
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
