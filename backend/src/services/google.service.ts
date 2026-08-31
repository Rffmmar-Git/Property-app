import { googleOAuth2Client } from "../config/google";
import { authRepository } from "../repositories/auth.repository";
import { generateAccessToken } from "../utils/auth";
import { ApiError } from "../utils/core";

export class GoogleService {
  async getAuthorizationUrl() {
    return googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "openid",
        "email",
        "profile",
      ],
      prompt: "select_account",
    });
  }

  async handleCallback(code: string) {
    const { tokens } =
      await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new ApiError(
        400,
        "Unable to retrieve Google account information",
      );
    }

    const email = payload.email;
    const fullName =
      payload.name ?? email.split("@")[0];

    const profilePicture =
      payload.picture ?? undefined;

    let user =
      await authRepository.findUserByEmail(email);

    if (!user) {
      user = await authRepository.createGoogleUser(
        fullName,
        email,
        profilePicture,
      );
    } else {
      if (user.role !== "CUSTOMER") {
        throw new ApiError(
          403,
          "Google login is only available for customers",
        );
      }

      if (user.provider !== "GOOGLE") {
        throw new ApiError(
          409,
          "An account with this email already exists. Please login using email and password.",
        );
      }
    }

    const accessToken = generateAccessToken({
      userId: user.id.toString(),
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id.toString(),
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const googleService = new GoogleService();