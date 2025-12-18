// scripts/test-api-direct.js
async function testApi() {
  // This simulates what the frontend sends
  const mockData = {
    stepId: "test-step-id", // You'll need actual step ID
    answers: [0, 1, 2, 3, 0], // Example answers
    score: 85
  };
  
  console.log("Mock API payload:", JSON.stringify(mockData, null, 2));
  console.log("Score 85 >= 80?", 85 >= 80);
  console.log("Would trigger progress update: YES");
}
testApi();
