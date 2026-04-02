import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    personal_info: {
        fullName: {
            type: String,
            required: true,
            minlength: [3, 'Full name must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: [3, 'Username must be 3 letters long'],
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
        }
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'posts',
        default: [],
    },

}, { timestamps: true }
)

export const User = mongoose.model("User", userSchema)