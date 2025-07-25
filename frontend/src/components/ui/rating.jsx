import React from "react";

export function Rating({ value = 0, max = 5 }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? "#FFD700" : "#ccc", fontSize: "1.2em" }}>
          ★
        </span>
      ))}
    </div>
  );
}
