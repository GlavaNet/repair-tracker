import React from 'react';

const LoginScreen = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Repair Request Tracker</h1>
        <p className="mb-6 text-center text-gray-600">Sign in with your Microsoft account</p>
        <button 
          onClick={onLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In (Demo)
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;