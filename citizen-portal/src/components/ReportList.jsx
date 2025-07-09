import React from "react";

export default function ReportList({ reports, onFeedback, onBack }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#1565c0", marginBottom: 18 }}>My Reports</h2>
      {reports.length === 0 && (
        <div style={{ color: "#888", marginBottom: 24 }}>No reports yet.</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {reports.map((r) => {
          const [imgError, setImgError] = React.useState(false);
          const showImage =
            typeof r.photo === "string" &&
            r.photo.trim() !== "" &&
            !imgError;
          return (
            <div
              key={r._id || r.id}
              style={{
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 2px 10px 0 rgba(0,0,0,0.07)",
                padding: 18,
                borderLeft:
                  r.status === "pending"
                    ? "5px solid #ffb300"
                    : r.status === "resolved"
                    ? "5px solid #43a047"
                    : "5px solid #bbb",
                marginBottom: 8,
                minWidth: 0,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>
                {r.description}
              </div>
              <div style={{ color: "#666", fontSize: 15, marginBottom: 3 }}>
                {r.address}
              </div>
              {r.location && (
                <div style={{ color: "#888", fontSize: 13, marginBottom: 3 }}>
                  Lat: <b>{r.location.lat}</b>, Lng: <b>{r.location.lng}</b>
                </div>
              )}
              <div style={{ color: "#aaa", fontSize: 13 }}>
                {new Date(r.createdAt).toLocaleString()}
              </div>
              {showImage ? (
                <img
                  src={r.photo}
                  alt="Report"
                  style={{
                    maxWidth: 120,
                    maxHeight: 80,
                    borderRadius: 7,
                    marginTop: 10,
                    boxShadow: "0 1px 4px #ccc",
                    border: "1px solid #eee",
                    display: "block",
                  }}
                  onError={() => setImgError(true)}
                />
              ) : null}
              {r.adminRemarks && (
                <div style={{ color: '#1976d2', fontSize: 14, marginTop: 6 }}>
                  <b>Admin Remarks:</b> {r.adminRemarks}
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#fff",
                    background:
                      r.status === "pending"
                        ? "#ffb300"
                        : r.status === "resolved"
                        ? "#43a047"
                        : "#888",
                    marginRight: 8,
                  }}
                >
                  {r.status === "pending"
                    ? "Pending"
                    : r.status === "resolved"
                    ? "Resolved"
                    : "Closed"}
                </span>
                {r.status === "resolved" && !r.feedback && (
                  <button
                    style={{
                      padding: "4px 16px",
                      background: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    onClick={() => onFeedback(r)}
                  >
                    Give Feedback
                  </button>
                )}
                {r.feedback && (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: 12,
                      color: "#43a047",
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    Feedback: {r.feedback}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        style={{
          marginTop: 32,
          padding: "8px 32px",
          background: "#fff",
          color: "#1565c0",
          border: "2px solid #1565c0",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
        }}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}