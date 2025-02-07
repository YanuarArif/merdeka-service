import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const resendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${domain}/verification-email?token=${token}&email=${email}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Verifikasi <onboarding@resend.dev>",
      to: email,
      subject: "Verifikasi Email Anda",
      html: `<p>Klik <a href="${verificationLink}">di sini</a> untuk verifikasi email Anda.</p>`,
    });

    if (error) {
      console.error("Gagal mengirim email:", error);
      throw new Error("Gagal mengirim email verifikasi");
    }

    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
