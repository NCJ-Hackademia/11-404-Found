// Next.js API Route for Server-Sent Events - No Express needed!
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = JSON.stringify({
        type: "connected",
        payload: { timestamp: new Date().toISOString() },
      })
      controller.enqueue(encoder.encode(`data: ${data}\n\n`))

      // Send periodic updates
      const interval = setInterval(() => {
        // Simulate real-time events
        const events = [
          {
            type: "user_activity",
            payload: { activeUsers: Math.floor(Math.random() * 100) + 50 },
          },
          {
            type: "new_listing_alert",
            payload: {
              title: "NEW ITEM AVAILABLE",
              category: "ELECTRONICS",
              price: Math.floor(Math.random() * 50000) + 10000,
            },
          },
        ]

        const randomEvent = events[Math.floor(Math.random() * events.length)]
        const eventData = JSON.stringify(randomEvent)

        try {
          controller.enqueue(encoder.encode(`data: ${eventData}\n\n`))
        } catch (error) {
          clearInterval(interval)
        }
      }, 5000) // Send update every 5 seconds

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
