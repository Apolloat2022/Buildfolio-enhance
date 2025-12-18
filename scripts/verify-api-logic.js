// scripts/verify-api-logic.js
console.log("🔍 VERIFYING QUIZ API LOGIC");
console.log("===========================");
console.log("\n✅ Current API logic:");
console.log("   const passed = score >= 80");
console.log("   → 85 >= 80 = true");
console.log("   → 5 >= 80 = false");
console.log("\n❌ But database shows: score: 5, passed: true");
console.log("\n💡 Possible causes:");
console.log("1. Old bug in quiz API (now fixed in deployment)");
console.log("2. Manual database edit corrupted data");
console.log("3. Different API endpoint creating records");
console.log("\n🎯 SOLUTION:");
console.log("1. Clean corrupted data (script above)");
console.log("2. Test with fresh data");
console.log("3. Monitor new quiz attempts");
