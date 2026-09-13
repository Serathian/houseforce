import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const strapiUrl =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

  try {
    const res = await fetch(`${strapiUrl}/api/user-preferences`, {
      headers: {
        Authorization: `Bearer ${session.strapiToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const strapiUrl =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

  try {
    const body = await req.json();
    const res = await fetch(`${strapiUrl}/api/user-preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.strapiToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
