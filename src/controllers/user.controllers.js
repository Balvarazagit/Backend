import { asyncHandler } from '../utilis/asyncHandler.js'
import { ApiError } from '../utilis/ApiError.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utilis/cloudinary.js'
import { ApiResponse } from '../utilis/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, password, userName } = req.body
    console.log("Register User", fullName, email, password, userName)
    if (
        [fullName, email, password, userName].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [
            { email },
            { userName }
        ]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUSer = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUSer) {
        throw new ApiError(500, "Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUSer, "User created successfully")
    )
}
)

export { registerUser }