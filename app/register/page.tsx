"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        branch: "CSE",
        year: "1",
        collegeId: "",
    });

    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, year: Number(form.year) }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Registration failed");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Register</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input name="name" placeholder="Name" onChange={handleChange} required />
                        <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                        <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                        <Input name="collegeId" placeholder="College ID" onChange={handleChange} />

                        <Select
                            defaultValue="CSE"
                            onValueChange={(value) => setForm({ ...form, branch: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].map((b) => (
                                    <SelectItem key={b} value={b}>
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            name="year"
                            type="number"
                            min={1}
                            max={4}
                            placeholder="Year"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button type="submit" className="w-full">
                            Register
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <span
                                className="cursor-pointer text-primary underline"
                                onClick={() => router.push("/login")}
                            >
                Login
              </span>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
