import { NextRequest, NextResponse } from "next/server";
import { inMemoryUsers } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = inMemoryUsers.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // TODO: Hash password with bcrypt in production
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // plain text for demo only
      image: `https://picsum.photos/seed/${email}/80/80`,
    };

    inMemoryUsers.push(newUser);

    return NextResponse.json(
      { message: "Account created successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
