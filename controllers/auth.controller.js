import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin'
import {getAuth} from 'firebase-admin/auth'

const formatDataToSend = (user, msg) => {
    const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
    return {
        message: msg,
        data: {
            access_token,
            fullName: user.personal_info.fullName,
            username: user.personal_info.username,
            profile_img: user.personal_info.profile_img
        }
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0]

    const usernameExists = await User.exists({ 'personal_info.username': username }).then(result => result)

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz-_', 4)
    usernameExists ? username += nanoid() : "";

    return username
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(403).json({ "error": "Please provide all necessary fields" })
    }
    if (fullName.length < 3) {
        return res.status(403).json({ "error": "Full name must be atlease 3 letters long" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter email" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Enter a valid email" })
    }

    const userExists = await User.findOne({ 'personal_info.email': email })
    if (userExists) {
        return res.status(500).json({ "error": "Email already exists" })
    } else {

        const username = await generateUsername(email)

        bcrypt.hash(password, 12, (err, hashed_pass) => {
            let user = new User({
                personal_info: {
                    fullName,
                    email,
                    username,
                    password: hashed_pass
                }
            })
            user.save().then((u) => res.status(200).json(formatDataToSend(u, "Sign In successful!"))).catch(err => res.status(500).json({ 'error': err.message }))

        })
    }

}
const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(403).json({ "error": "Please provide all necessary fields" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter email" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Enter a valid email" })
    }

    const existingUser = await User.findOne({ 'personal_info.email': email })
    if (!existingUser) {
        return res.status(403).json({ "error": "User does not exist" })
    }
    if(existingUser.google_auth){
        return res.status(403).json({"error": "This account was created using google"})
    }
    else {
        bcrypt.compare(password, existingUser.personal_info.password, (err, result) => {
            if (err) {
                return res.status(403).json({ "error": "Error logging in" })
            }
            if (!result) {
                return res.status(403).json({ "error": "Incorrect credentials" })
            }
            else {
                return res.status(200).json(formatDataToSend(existingUser, "Login successful!"))
            }
        })

    }
}

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

const googleAuth = async (req, res) => {
    let {access_token} = req.body

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        let { name, email, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c"); //to get bigger resolution picture
        let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullName personal_info.email personal_info.profile_img google_auth").then((u) => u ||null).catch(err => res.status(500).json({"error": err.message}))
        if(user){ //google loginnn
            if(!user.google_auth){
                return res.status(403).json({"error": "This account was signed in without google so please use email & password"})
            } 
        }
        else{ // google signup
            let username = await generateUsername(email)

            user = new User ({
                personal_info: {
                    fullName: name,
                    email: email,
                    profile_img: picture,
                    username,
                },
                google_auth: true
            })

            await user.save().then((u) => {
                user = u
            }).catch(err => {
                return res.status(500).json({"error": err.message})
            })
        }

        return res.status(200).json(formatDataToSend(user, "Sign In successful!"))

    }).catch(err => {
        return res.status(500).json({"error": "Failed to signin using google"})
    })
    
}

export { registerUser, loginUser, googleAuth }