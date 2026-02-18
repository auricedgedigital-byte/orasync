import { AIResponse } from "../types/ai.types"
import crypto from "crypto"

interface CacheEntry {
    response: AIResponse
    expiry: number
}

export class CacheManager {
    private cache: Map<string, CacheEntry> = new Map()
    private readonly defaultTTL = 300000 // 5 minutes

    generateKey(prompt: string, context?: string[]): string {
        const data = prompt + (context?.join("|") || "")
        return crypto.createHash("md5").update(data).digest("hex")
    }

    get(key: string): AIResponse | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return null
        }

        return entry.response
    }

    set(key: string, response: AIResponse, ttl?: number) {
        this.cache.set(key, {
            response,
            expiry: Date.now() + (ttl || this.defaultTTL)
        })
    }

    clear() {
        this.cache.clear()
    }
}

export const novaCache = new CacheManager()
