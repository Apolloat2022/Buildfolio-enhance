cat > test-env.js << 'EOF'
console.log("=== WHAT NODE.JS SEES ===");
console.log("GITHUB_ID:", "'" + (process.env.GITHUB_ID || "") + "'");
console.log("Length:", (process.env.GITHUB_ID || "").length);
console.log("GITHUB_SECRET:", process.env.GITHUB_SECRET ? "'***" + process.env.GITHUB_SECRET.substring(process.env.GITHUB_SECRET.length - 5) + "'" : "EMPTY");
console.log("NEXTAUTH_URL:", "'" + (process.env.NEXTAUTH_URL || "") + "'");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET");
EOF