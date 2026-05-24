import jwt from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/secrets";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthService {
  async authenticateUserByGoogleToken(idToken: string) {
    const response = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    return response.getPayload() as {
      sub: string;
      email: string;
      name: string;
      picture: string;
    };
  }

  async generateToken(id: string) {
    const accessToken = jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    const refreshToken = jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
      const userId = decoded.id;
      return this.generateToken(userId);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
export default new AuthService();
