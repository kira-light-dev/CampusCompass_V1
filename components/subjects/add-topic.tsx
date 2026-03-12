"use client"

import { useState } from "react"

interface AddTopicProps {
  subjectId: string
}

export default function AddTopic({ subjectId }: AddTopicProps) {
  const [showInput, setShowInput] = useState(false)
  const [topicName, setTopicName] = useState("")
  const [loading, setLoading] = useState(false)

  async function addTopic() {
    if (!topicName.trim()) return

    setLoading(true)
    try {
      await fetch(`/api/subjects/${subjectId}/topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: topicName })
      })
      setTopicName("")
      setShowInput(false)
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        style={{
          marginTop: "12px",
          padding: "8px 12px",
          fontSize: "14px",
          border: "none",
          background: "none",
          color: "#3b82f6",
          cursor: "pointer",
          textDecoration: "underline"
        }}
      >
        + Add Topic
      </button>
    )
  }

  return (
    <div
      style={{
        marginTop: "12px",
        display: "flex",
        gap: "8px"
      }}
    >
      <input
        type="text"
        placeholder="Topic name"
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTopic()}
        style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "6px 8px",
          fontSize: "14px"
        }}
      />
      <button
        onClick={addTopic}
        disabled={loading}
        style={{
          padding: "6px 12px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontSize: "14px"
        }}
      >
        {loading ? "Adding..." : "Add"}
      </button>
      <button
        onClick={() => {
          setShowInput(false)
          setTopicName("")
        }}
        style={{
          padding: "6px 12px",
          backgroundColor: "#e5e7eb",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Cancel
      </button>
    </div>
  )
}
