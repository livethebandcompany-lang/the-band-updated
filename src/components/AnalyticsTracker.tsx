"use client"

import { useEffect } from "react"

export default function AnalyticsTracker() {
    useEffect(() => {
        // Fire and forget
        fetch("/api/analytics/track", { method: "POST" }).catch(err => console.error(err))
    }, [])

    return null
}
