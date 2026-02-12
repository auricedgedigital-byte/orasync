import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/supabase'

const DENTAL_RESPONSES = {
  greeting: [
    "Hello! I'm your Orasync AI assistant. I can help you schedule appointments, answer questions about dental services, or assist with practice management. How can I help you today?",
    "Welcome to Orasync! I'm here to help with your dental practice needs. What can I assist you with?",
    "Hi there! I'm your AI dental assistant. Ready to help you streamline your practice and patient care."
  ],
  appointment: [
    "I can help you schedule an appointment. What type of dental service do you need? (cleaning, checkup, consultation, emergency)",
    "Let's find you the perfect appointment time. What treatment are you looking for?",
    "I'd be happy to schedule an appointment for you. Which service would you like to book?"
  ],
  services: [
    "We offer comprehensive dental services including preventive care, restorative treatments, cosmetic dentistry, orthodontics, and emergency care. Which service interests you?",
    "Our practice provides full-service dental care from routine cleanings to advanced procedures. What specific treatment are you interested in?",
    "We specialize in general dentistry, cosmetic procedures, and specialized treatments. How can I help you explore our services?"
  ],
  pricing: [
    "I can provide information about our treatment costs and insurance options. Which specific treatment are you interested in learning about?",
    "Let me help you understand our pricing and payment options. What treatment would you like pricing information for?",
    "I can discuss our fees and insurance coverage. Which service are you considering?"
  ],
  emergency: [
    "I understand this is urgent. Let me connect you with our emergency line immediately, or I can help schedule the earliest available appointment.",
    "Dental emergencies need prompt attention. I'll help you get seen right away. Please describe your symptoms.",
    "Don't worry - we're here to help. Let me prioritize you for immediate care."
  ],
  general: [
    "I'm here to help with your dental practice needs. You can ask me about scheduling, services, pricing, or practice management.",
    "As your AI assistant, I can help with appointments, treatment information, practice operations, and patient care questions.",
    "I'm designed to assist with all aspects of your dental practice. What specific information do you need?"
  ]
}

function classifyMessage(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting'
  }
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('booking')) {
    return 'appointment'
  }
  if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('procedure')) {
    return 'services'
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('insurance')) {
    return 'pricing'
  }
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('pain')) {
    return 'emergency'
  }
  
  return 'general'
}

function getResponse(message: string): { response: string; sentiment: string } {
  const category = classifyMessage(message)
  const responses = DENTAL_RESPONSES[category as keyof typeof DENTAL_RESPONSES]
  const response = responses[Math.floor(Math.random() * responses.length)]
  
  let sentiment = 'neutral'
  if (category === 'greeting' || category === 'appointment') {
    sentiment = 'positive'
  } else if (category === 'emergency') {
    sentiment = 'concerned'
  }
  
  return { response, sentiment }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversation, context } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // For now, use rule-based responses. In a full implementation, you would:
    // 1. Check if OpenAI API key is available
    // 2. If yes, use OpenAI with dental-specific prompts
    // 3. If no, fall back to rule-based responses
    // 4. Maintain conversation context for better responses
    
    const { response, sentiment } = getResponse(message)
    
    // Log the conversation for analytics
    const supabase = getClient()
    try {
      await supabase.from('ai_conversations').insert({
        user_message: message,
        bot_response: response,
        sentiment: sentiment,
        context: context || 'dental_assistant',
        created_at: new Date().toISOString()
      })
    } catch (logError) {
      console.error('Failed to log conversation:', logError)
      // Continue even if logging fails
    }

    return NextResponse.json({
      response,
      sentiment,
      category: classifyMessage(message)
    })

  } catch (error) {
    console.error('AI chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI response' },
      { status: 500 }
    )
  }
}