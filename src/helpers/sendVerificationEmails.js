import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import apiResponse from "@/utils/apiResponse";
import { Resend } from "resend";

export async function sendVerificationEmail(
    email, username, VerificationCode
) {
    try {
        const resend = new Resend('re_123456789');
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: <VerificationEmail username={username} otp={VerificationCode} />,
        });

        apiResponse(401, {}, "Verification Email send successfully")
    } catch (emailError) {
        console.error("Error send verification Email", emailError);
        apiResponse(401, { emailError }, "Error sending Verification Email")
    }
}
