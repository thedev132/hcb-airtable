"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  const [authCode, setAuthCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [randomJoke, setRandomJoke] = useState<string | null>(null); // Ensure initial state matches SSR

  useEffect(() => {
    const jokes = [
      "🔒 Logging in... because magic links don’t exist (yet).",
      "🛡️ Your token is safe. Probably.",
      "🤖 Authenticated by very serious robots.",
      "🔑 This login is 99% secure. The 1% is your fault.",
      "🏴‍☠️ No pirates allowed... unless they know OAuth.",
    ];
    setRandomJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  const handleOAuthLogin = () => {
    const oauthUrl =
      `${process.env.OAUTH_AUTHORIZATION_URL}?` +
      `client_id=${process.env.OAUTH_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent("https://hackclub.com")}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("read write")}`;
    window.open(oauthUrl, "_blank");
  };

  const handleAuthCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/callback/hack-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Successful authentication
      router.push("/dashboard");
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  };

  return (
    <div
      className="flex min-h-svh items-center justify-center bg-gray-50 dark:bg-gray-900 bg-repeat bg-[length:100%] bg-center"
      style={{ backgroundImage: "url(/banner.png)" }}
    >
      <div className="absolute inset-0 bg-black/75"></div>
      <Card className="w-full max-w-md shadow-lg bg-white/90 dark:bg-black/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleOAuthLogin}>
            <Image
              alt="HCB logo"
              width={32}
              height={32}
              src="https://icons.hackclub.com/api/icons/black/bank-account"
            />
            Sign in with HCB
          </Button>
          {/* divider */}
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 w-1/3"></div>
            <p className="text-sm text-gray-500 px-2">then</p>
            <div className="border-t border-gray-300 w-1/3"></div>
          </div>
          <form onSubmit={handleAuthCodeSubmit}>
            <Input
              type="text"
              placeholder="Enter Auth Code"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="mb-4"
            />
            <Button type="submit" className="w-full">
              Submit Auth Code
            </Button>
          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>{randomJoke}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
