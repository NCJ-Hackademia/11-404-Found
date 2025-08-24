// Pure browser-based real-time - Works in preview!
class RealtimeService {
  private listeners: Map<string, Function[]> = new Map()
  private isConnected = false
  private simulationInterval: NodeJS.Timeout | null = null

  constructor() {
    this.connect()
  }

  private connect() {
    // Simulate connection for preview
    setTimeout(() => {
      this.isConnected = true
      this.emit("connected", true)
      this.startSimulation()
    }, 1000)
  }

  private startSimulation() {
    // Simulate real-time events for preview
    this.simulationInterval = setInterval(() => {
      this.simulateRealtimeEvents()
    }, 5000)
  }

  private simulateRealtimeEvents() {
    const events = [
      {
        type: "new_message",
        payload: {
          id: Date.now(),
          sender: "POTENTIAL BUYER",
          content: "IS THIS ITEM STILL AVAILABLE?",
          timestamp: new Date().toISOString(),
          isOwn: false,
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
        },
      },
      {
        type: "user_online",
        payload: {
          userId: "user_" + Math.floor(Math.random() * 1000),
          name: "ACTIVE USER",
        },
      },
      {
        type: "new_listing",
        payload: {
          id: Date.now(),
          title: "NEW ITEM JUST LISTED",
          price: Math.floor(Math.random() * 100000) + 10000,
          category: "ELECTRONICS",
        },
      },
      {
        type: "price_drop",
        payload: {
          productId: Math.floor(Math.random() * 10) + 1,
          oldPrice: 50000,
          newPrice: 45000,
          discount: 10,
        },
      },
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]
    if (Math.random() > 0.6) {
      // 40% chance
      this.emit(randomEvent.type, randomEvent.payload)
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)
  }

  public off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  public send(type: string, payload: any) {
    // Simulate sending message
    console.log(`REALTIME SEND: ${type}`, payload)

    // Echo back for demo
    setTimeout(() => {
      if (type === "send_message") {
        this.emit("receive_message", payload.message)
      }
    }, 500)
  }

  public isConnectedStatus(): boolean {
    return this.isConnected
  }

  public disconnect() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }
    this.isConnected = false
  }
}

export const realtimeService = new RealtimeService()
