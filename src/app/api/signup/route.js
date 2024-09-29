import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import apiResponse from "@/utils/apiResponse";

export async function POST(req, res) {
    // get details
    // check the user by username and also if he is verified if it exists then return user already exists
    // check the user by email and check if he is verified then return false but if he is not verified then update the user like his password and verifyCode and sendVerification email
    // if the user doesnot exists then create user by following steps
    // hashed password
    // generate expiryDate for verify token and create a new user
    // and in the end send verification email to verify
    await dbConnection()
    try {
        const { userName, email, password } = await req.json()
        const existingUserVerifiedByUsename = await UserModel.findOne({
            userName,
            isVerified: true
        })
        if (existingUserVerifiedByUsename) {
            return Response.json({
                success: false,
                message: "Username is already Taken"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(verifyCode);

        if (existingUserByEmail) {
            if (!existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User alrady exists with this email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                userName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save()
        }
        const emailResponse = await sendVerificationEmail(
            email,
            userName,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User Registered Successfully, please verify your email"
        }, { status: 200 })
    } catch (error) {
        console.error("Error Registering User", error)
        return Response.json({
            success: false,
            message: "Error Registering User"
        }, { status: 500 })

    }
}