import { useEffect, useState } from "react";
import { getLocations, createLocation } from "../services/api";
import MainLayout from "../components/layout/MainLayout";
import { MapPin, Plus, Copy, Check, ExternalLink } from "lucide-react";
import "./Locations.css";

type Location = {
  id: number;
  name: string;
  code: string;
};

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://qr-tracker-server.onrender.com";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <MainLayout>
      <div className="locations-container">
        {/* Header */}
        <div className="locations-header">
          <div>
            <h1 className="locations-title">Locations</h1>
            <p className="locations-subtitle">
              Create and manage QR code tracking locations
            </p>
          </div>
          <div className="locations-count-badge">
            <MapPin size={20} />
            <span className="count-number">{locations.length}</span>
            <span className="count-label">Locations</span>
          </div>
        </div>

        {/* Create Form */}
        <div className="create-card">
          <div className="create-header">
            <div className="create-icon">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="create-title">Create New Location</h3>
              <p className="create-subtitle">
                Generate a unique tracking link for a new location
              </p>
            </div>
          </div>
          <form onSubmit={handleCreate} className="create-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location Name</label>
                <input
                  type="text"
                  placeholder="e.g., Store Front, Office Entrance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unique Code</label>
                <input
                  type="text"
                  placeholder="e.g., store-01, office-main"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="form-input"
                  pattern="[a-zA-Z0-9-_]+"
                  title="Only letters, numbers, hyphens, and underscores allowed"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Location
                </>
              )}
            </button>
          </form>
        </div>

        {/* Locations List */}
        <div className="locations-list">
          <div className="list-header">
            <h3 className="list-title">Generated Links</h3>
            {locations.length > 0 && (
              <span className="list-badge">{locations.length} active</span>
            )}
          </div>

          {locations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MapPin size={64} strokeWidth={1} />
              </div>
              <h3>No Locations Yet</h3>
              <p>Create your first location above to start tracking QR code scans!</p>
            </div>
          ) : (
            <div className="locations-grid">
              {locations.map((loc, index) => {
                const url = `${BASE_URL}/q/${loc.code}`;
                const isCopied = copiedId === loc.id;
                return (
                  <div
                    key={loc.id}
                    className="location-item fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="location-item-header">
                      <div className="location-badge">{index + 1}</div>
                      <h4 className="location-item-name">{loc.name}</h4>
                    </div>
                    <div className="location-item-body">
                      <div className="location-code">
                        <span className="code-label">Code:</span>
                        <code className="code-value">{loc.code}</code>
                      </div>
                      <div className="location-url">
                        <span className="url-label">URL:</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="url-link"
                        >
                          {url}
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                    <div className="location-item-footer">
                      <button
                        onClick={() => copyToClipboard(url, loc.id)}
                        className={`copy-btn ${isCopied ? "copied" : ""}`}
                      >
                        {isCopied ? (
                          <>
                            <Check size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
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
