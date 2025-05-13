'use client';

import { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>

      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Appearance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div 
            className="border rounded-lg p-4 border-gray-700 bg-gray-700/20"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full text-blue-400 bg-blue-900/50">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-white">Dark Mode</h3>
                <p className="text-sm text-gray-400">
                  App is currently running in dark mode
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            The application is currently set to dark mode only to ensure consistent display on all screens.
          </p>
        </div>
      </div>
    </div>
  );
} 