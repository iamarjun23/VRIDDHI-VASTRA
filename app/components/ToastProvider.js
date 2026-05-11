"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#103323',
          color: '#F4D2A6',
          border: '1px solid #c9a76d',
        },
        success: {
          iconTheme: {
            primary: '#F4D2A6',
            secondary: '#103323',
          },
        },
        error: {
          style: {
            background: '#8b0000',
            color: '#fff',
            border: '1px solid #ff4c4c',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#8b0000',
          },
        },
      }}
    />
  );
}
