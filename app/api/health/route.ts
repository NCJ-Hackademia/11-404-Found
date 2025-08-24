import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      services: {
        database: "connected", // In real app, check actual DB connection
        cache: "connected",
        external_apis: "connected",
      },
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
