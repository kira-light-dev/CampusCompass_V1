"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Login failed");
            return;
        }

        router.push("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don’t have an account?{" "}
                            <span
                                className="cursor-pointer text-primary underline"
                                onClick={() => router.push("/register")}
                            >
                Register
              </span>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
