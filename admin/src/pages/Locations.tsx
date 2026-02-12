import { useEffect, useState } from "react";
import { getLocations, createLocation } from "../services/api";
import MainLayout from "../components/layout/MainLayout";

type Location = {
  id: number;
  name: string;
  code: string;
};

const BASE_URL = "http://127.0.0.1:8000";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLocations = async () => {
    const res = await getLocations();
    setLocations(res.data);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLocation({ name, code });
      setName("");
      setCode("");
      loadLocations();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <MainLayout>
      <div>
        <h2 style={{ color: "#fff", fontSize: "32px", marginBottom: "8px" }}>
          Locations
        </h2>
        <p style={{ color: "#a0a0a0", marginBottom: "30px" }}>
          Create and manage QR code tracking locations
        </p>

        <div style={{
          background: "#1a1a2e",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}>
          <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "20px" }}>
            Create New Location
          </h3>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              placeholder="Location name (e.g., Store Front)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "12px 16px",
                background: "#16213e",
                border: "2px solid #0f3460",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <input
              placeholder="Unique code (e.g., store-01)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "12px 16px",
                background: "#16213e",
                border: "2px solid #0f3460",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "#555" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {loading ? "Creating..." : "Create Location"}
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "20px" }}>
            Generated Links ({locations.length})
          </h3>
          {locations.length === 0 ? (
            <div style={{
              background: "#1a1a2e",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#a0a0a0"
            }}>
              No locations yet. Create your first location above!
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {locations.map((loc) => {
                const url = `${BASE_URL}/q/${loc.code}`;
                return (
                  <div
                    key={loc.id}
                    style={{
                      background: "#1a1a2e",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #2a2a3e",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ 
                        color: "#fff", 
                        fontSize: "18px", 
                        fontWeight: "600",
                        marginBottom: "4px"
                      }}>
                        {loc.name}
                      </div>
                      <div style={{ 
                        color: "#667eea", 
                        fontSize: "14px",
                        fontFamily: "monospace"
                      }}>
                        {url}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(url)}
                      style={{
                        padding: "8px 16px",
                        background: "#16213e",
                        border: "1px solid #667eea",
                        borderRadius: "6px",
                        color: "#667eea",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#667eea";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#16213e";
                        e.currentTarget.style.color = "#667eea";
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
