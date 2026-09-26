import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import {
  AuthProvider,
  AuthProviderAbstract,
} from '@hookpost/backend/services/auth/providers.interface';

const defaultRedirect = () =>
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth/google/redirect`;

const makeClient = (redirectUri: string) =>
  new google.auth.OAuth2({
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    redirectUri,
  });

@AuthProvider({ provider: 'GOOGLE' })
export class GoogleProvider extends AuthProviderAbstract {
  generateLink(query?: { redirect_uri?: string; state?: string }) {
    const redirectUri = query?.redirect_uri || defaultRedirect();
    return makeClient(redirectUri).generateAuthUrl({
      access_type: 'online',
      prompt: 'consent',
      state: query?.state || 'login',
      redirect_uri: redirectUri,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  }

  async getToken(code: string, redirectUri?: string) {
    const client = makeClient(redirectUri || defaultRedirect());
    const { tokens } = await client.getToken(code);
    return tokens.access_token!;
  }

  async getUser(providerToken: string) {
    // Google One Tap hands the browser a signed ID token (a JWT) instead of an
    // OAuth access token. Verify its signature, audience and expiry against our
    // client id; its `sub` is the same account id userinfo returns as `id`,
    // so One Tap and the redirect flow resolve to the same user.
    if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(providerToken)) {
      const ticket = await new OAuth2Client(
        process.env.YOUTUBE_CLIENT_ID
      ).verifyIdToken({
        idToken: providerToken,
        audience: process.env.YOUTUBE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || !payload.email_verified) {
        return false as any;
      }
      return { id: payload.sub, email: payload.email, name: payload.name };
    }

    const client = makeClient(defaultRedirect());
    client.setCredentials({ access_token: providerToken });
    const { data } = await google
      .oauth2({ version: 'v2', auth: client })
      .userinfo.get();

    return {
      id: data.id!,
      email: data.email!,
    };
  }
}
