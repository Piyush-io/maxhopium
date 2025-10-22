import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    revalidatePath("/api/f1-data")
    revalidatePath("/")

    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to revalidate",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
