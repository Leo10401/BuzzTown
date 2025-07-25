// frontend/src/components/ui/loader.jsx
import React from "react";

export function Loader() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div className="spinner" />
      Loading...
      <style jsx>{`
        .spinner {
          margin: 0 auto 1rem;
          width: 32px;
          height: 32px;
          border: 4px solid #ccc;
          border-top: 4px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}