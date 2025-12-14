// test-quiz-api.js
async function testQuizAPI() {
  const stepId = "cmj507fyn0011hecd65dq49vv"
  
  try {
    console.log('Testing quiz API for step:', stepId)
    
    const response = await fetch(\http://localhost:3000/api/quiz/questions?stepId=\cmj507fyn0011hecd65dq49vv\)
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      return
    }
    
    const data = await response.json()
    console.log('Quiz data received:', {
      hasQuestions: !!data.questions,
      questionCount: data.questions?.length || 0,
      firstQuestion: data.questions?.[0]?.question?.substring(0, 50) + '...'
    })
    
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

// Run if in browser console, or use node-fetch for Node.js
if (typeof window !== 'undefined') {
  testQuizAPI()
}
