'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative bg-gradient-to-r from-[#f37c1b] to-[#ff9d4d] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <span className="flex p-2 rounded-lg bg-white/10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-sm sm:text-base truncate">
                <span className="md:hidden">Visit Suubi Medical Centre for quality healthcare!</span>
                <span className="hidden md:inline">Experience exceptional healthcare services at Suubi Medical Centre - Your trusted partner in health and wellness</span>
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
              <Link
                href="https://suubi.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#f37c1b] bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Visit Now
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="flex-shrink-0 sm:ml-4">
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="flex p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
