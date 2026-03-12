"use client"

import { useState } from "react"

export default function AddSubject() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function addSubject() {
    if (!name.trim()) return

    setLoading(true)
    try {
      await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, topics: [] })
      })

      setName("")
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSubject()
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}
    >
      <input
        type="text"
        placeholder="Subject name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "14px"
        }}
      />

      <button
        onClick={addSubject}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        {loading ? "Adding..." : "Add Subject"}
      </button>
    </div>
  )
}
