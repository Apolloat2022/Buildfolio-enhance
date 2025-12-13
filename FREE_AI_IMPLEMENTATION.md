# Free AI Integration Plan

## 🆓 Best Free AI Options

### Option 1: Groq (RECOMMENDED ⭐)
**Why Choose:**
- ✅ FREE tier is VERY generous
- ✅ Super fast responses (important for UX)
- ✅ Good models (Llama 3.1, Mixtral)
- ✅ Easy API integration
- ✅ No credit card required

**Free Tier Limits:**
- 14,400 requests per day
- 30 requests per minute
- Enough for 100-200 active users

**Cost when scaling:**
- FREE until you need more
- Then very cheap (~$0.10 per million tokens)

**Setup:**
```bash
# 1. Sign up: https://console.groq.com
# 2. Get API key (free)
# 3. Add to .env: GROQ_API_KEY=xxx
```

**API Example:**
```typescript
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.1-70b-versatile', // Free!
    messages: [
      { role: 'system', content: 'You are a coding tutor...' },
      { role: 'user', content: 'Why use Decimal for prices?' }
    ],
    temperature: 0.7,
    max_tokens: 1000
  })
})
```

---

### Option 2: Google Gemini
**Why Choose:**
- ✅ Completely free
- ✅ Good quality responses
- ✅ 1500 requests per day
- ✅ 60 requests per minute

**Free Tier Limits:**
- 1500 requests/day = ~50 active users
- 60 requests/minute
- Generous token limits

**Setup:**
```bash
# 1. Get key: https://makersuite.google.com/app/apikey
# 2. Add to .env: GEMINI_API_KEY=xxx
```

---

### Option 3: Cohere
**Free Tier:**
- 1000 requests/month (limited)
- Good for testing
- Upgrade needed for production

---

## 🎯 RECOMMENDED APPROACH

**Start with Groq:**
- Best free tier
- Fastest responses
- Scales well

**Fallback to Gemini:**
- If Groq rate limit hit
- Automatic switching
- Backup reliability

---

## 💰 Cost Comparison (100 users)

| Provider | Free Tier | Cost at 5K requests/day |
|----------|-----------|------------------------|
| Groq | ✅ FREE | FREE (under limit) |
| Gemini | ✅ FREE | FREE (under limit) |
| Anthropic | ❌ No free | ~$150/month |
| OpenAI GPT-4 | ❌ Limited | ~$300/month |

**Break-even point:**
- Free AI: 0-200 users = $0
- When revenue > $50/mo → Consider upgrading to Anthropic for better quality

---

## ⚡ Implementation (45 minutes)

### Step 1: Get Groq API Key (5 min)
1. Visit: https://console.groq.com
2. Sign up (free, no card)
3. Create API key
4. Add to `.env`: `GROQ_API_KEY=your_key_here`

### Step 2: Create AI Helper API (20 min)
```typescript
// app/api/ai/ask/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { question, stepId } = await req.json()

  // Get step context
  const step = await prisma.step.findUnique({
    where: { id: stepId },
    include: { projectTemplate: true }
  })

  // Build context
  const systemPrompt = `You are a helpful coding tutor for the "${step.projectTemplate.title}" project.
Current step: "${step.title}"

Guidelines:
- Give clear, concise answers
- Provide code examples when helpful
- Explain WHY, not just HOW
- Encourage best practices
- Be supportive and patient

Step context: ${step.description}
`

  // Call Groq (FREE!)
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  })

  const data = await response.json()

  return NextResponse.json({
    answer: data.choices[0].message.content
  })
}
```

### Step 3: Create AI Chat Component (15 min)
```tsx
// components/AIHelper.tsx
'use client'
import { useState } from 'react'

interface AIHelperProps {
  stepId: string
  stepTitle: string
}

export default function AIHelper({ stepId, stepTitle }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, stepId })
      })
      
      const data = await res.json()
      setAnswer(data.answer)
    } catch (error) {
      setAnswer('Sorry, I had trouble answering that. Please try again!')
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-40 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-semibold"
      >
        🤖 Ask AI Tutor
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-8 z-40 w-96 bg-white rounded-lg shadow-2xl border-2 border-blue-500">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">AI Tutor - {stepTitle}</h3>
        <button onClick={() => setIsOpen(false)} className="text-xl">×</button>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        {answer && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 whitespace-pre-wrap">
            {answer}
          </div>
        )}
        
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything about this step..."
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
        />
        
        <button
          onClick={askQuestion}
          disabled={loading}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by free AI - Help us improve!
        </p>
      </div>
    </div>
  )
}
```

### Step 4: Add to Project Page (5 min)
Add `<AIHelper stepId={step.id} stepTitle={step.title} />` to each step

---

## 📊 Usage Tracking

Track AI usage to know when to upgrade:
```typescript
// Track in database
model AIUsage {
  id        String   @id @default(cuid())
  userId    String
  stepId    String
  question  String   @db.Text
  answer    String   @db.Text
  createdAt DateTime @default(now())
}
```

**Monitor:**
- Questions per day
- Response quality (user ratings)
- Rate limit hits
- When to upgrade to paid

---

## 🎯 Upgrade Path

**When to switch to paid AI:**
1. Revenue > $100/month → Consider Anthropic
2. Users complaining about quality → Upgrade
3. Hitting rate limits → Scale up
4. Want better responses → Premium AI

**Free → Paid transition:**
- Start: Groq (free)
- 100 users: Still free
- 500 users: Mix free/paid (~$50/mo)
- 1000+ users: Full Anthropic (~$150/mo)

By then you'll have revenue to cover it!

---

## ✅ Action Plan

**Next 45 Minutes:**
1. Get Groq API key (5 min)
2. Create AI API endpoint (20 min)
3. Build AI chat component (15 min)
4. Test with E-commerce project (5 min)

**Cost: $0**
**Value: Huge competitive advantage**

Ready to build it? 🚀
