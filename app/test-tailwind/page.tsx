export default function StyleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        🎉 Tailwind CSS v4 Test
      </h1>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mb-6">
        <p className="text-gray-700 mb-4">
          If this has proper styling (rounded corners, shadow, padding),
          your Tailwind setup is working!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          Test Button
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-xl p-6 max-w-md mb-6 text-white">
        <h2 className="text-2xl font-bold mb-3">Gradient Test</h2>
        <p>This tests gradient backgrounds.</p>
      </div>
      
      <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
        <p className="text-green-800">
          <strong>Success:</strong> Your <code>postcss.config.js</code> is now correct!
        </p>
        <p className="text-green-800 mt-2">
          Tailwind version: 4.1.17
        </p>
      </div>
    </div>
  );
}