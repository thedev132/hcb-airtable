import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encode } from "@auth/core/jwt";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const { code } = await req.json();  

  if (!code) {
    return NextResponse.json(
      { error: "Auth code is required" },
      { status: 400 },
    );
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch(process.env.OAUTH_TOKEN_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.OAUTH_CLIENT_ID!,
        client_secret: process.env.OAUTH_CLIENT_SECRET!,
        redirect_uri: "https://hackclub.com",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange auth code for token");
    }

    const tokenData = await tokenResponse.json();

    // Fetch user info
    const userInfoResponse = await fetch(process.env.OAUTH_USERINFO_URL!, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await userInfoResponse.json();
    console.log("User info:", userInfo, tokenData);

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {
        name: userInfo.name,
        image: userInfo.avatar,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + 7200000).toISOString(), // 2 hours
      },
      create: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.avatar,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + 7200000).toISOString(), // 2 hours
      },
    });

    // Create session
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };

    // Encode session as JWT
    const token = await encode({
      token: session,
      secret: process.env.AUTH_SECRET!,
      salt: "__Secure-authjs.session-token",
    });

    // Set session cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    };

    
    const response = NextResponse.json({ success: true });
    response.cookies.set("__Secure-authjs.session-token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
