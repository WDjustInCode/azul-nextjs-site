"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuoteObjectInfo {
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface QuoteData {
  address?: string;
  segment?: string;
  serviceCategory?: string;
  email?: string;
  poolSize?: string;
  poolType?: string;
  [key: string]: any;
}

export default function QuotesAdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [quoteObjects, setQuoteObjects] = useState<QuoteObjectInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [selectedPathname, setSelectedPathname] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [auditEmailFilter, setAuditEmailFilter] = useState("");
  const [editablePricing, setEditablePricing] = useState<any | null>(null);
  const [savingPricing, setSavingPricing] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showPricingConfig, setShowPricingConfig] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<any | null>(null);
  const [loadingPricingConfig, setLoadingPricingConfig] = useState(false);
  const [savingPricingConfig, setSavingPricingConfig] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: 'include',
    });

    const result = await response.json();

    if (result.success) {
      setAuthenticated(true);
      fetchQuotes();
    } else {
      let errorMsg = result.error || "Invalid password";
      if (result.remainingAttempts !== undefined) {
        errorMsg += ` (${result.remainingAttempts} attempts remaining)`;
      }
      setAuthError(errorMsg);
    }
  };

  useEffect(() => {
    // Check if already authenticated (session check)
    const checkAuth = async () => {
      const response = await fetch("/api/admin/auth", {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.authenticated) {
        setAuthenticated(true);
        fetchQuotes();
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Auto-refresh audit logs when filter changes
    if (showAuditLogs && authenticated) {
      const timeoutId = setTimeout(() => {
        fetchAuditLogs();
      }, 500); // Debounce
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditEmailFilter, showAuditLogs, authenticated]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quotes/list", {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setQuoteObjects(result.objects);
      } else {
        setError(result.error || "Failed to load quotes");
      }
    } catch (err) {
      setError("Error fetching quotes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingAuditLogs(true);
      const url = auditEmailFilter
        ? `/api/admin/audit?email=${encodeURIComponent(auditEmailFilter)}&limit=200`
        : `/api/admin/audit?limit=200`;
      const response = await fetch(url, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setAuditLogs(result.logs);
      } else {
        setError(result.error || "Failed to load audit logs");
      }
    } catch (err) {
      setError("Error fetching audit logs");
      console.error(err);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  const fetchQuote = async (pathname: string) => {
    if (selectedPathname === pathname && selectedQuote) {
      // Already loaded, just toggle
      setSelectedQuote(null);
      setSelectedPathname(null);
      setActionMessage(null);
      return;
    }

    try {
      setLoadingQuote(true);
      setError(null);
      setActionMessage(null);
      const response = await fetch(`/api/quotes/get?pathname=${encodeURIComponent(pathname)}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setSelectedQuote(result.data);
        setSelectedPathname(pathname);
        setEditablePricing(result.data?.pricing || null);
      } else {
        setError(result.error || "Failed to load quote");
      }
    } catch (err) {
      setError("Error fetching quote");
      console.error(err);
    } finally {
      setLoadingQuote(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handlePricingChange = (key: string, value: any) => {
    setEditablePricing((prev: any) => ({
      ...(prev || {}),
      [key]: value,
    }));
  };

  const handleFrequencyChange = (key: string, value: any) => {
    setEditablePricing((prev: any) => ({
      ...(prev || {}),
      frequencyVariants: {
        ...(prev?.frequencyVariants || {}),
        [key]: value,
      },
    }));
  };

  const savePricing = async () => {
    if (!selectedPathname) return;
    setSavingPricing(true);
    setActionMessage(null);
    try {
      const response = await fetch("/api/quotes/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname: selectedPathname,
          pricing: editablePricing,
          status: "updated",
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSelectedQuote(result.data);
        setEditablePricing(result.data.pricing || null);
        setActionMessage(`Pricing saved for ${selectedPathname}.`);
      } else {
        setError(result.error || "Failed to save pricing");
      }
    } catch (err) {
      setError("Error saving pricing");
      console.error(err);
    } finally {
      setSavingPricing(false);
    }
  };

  const acceptQuote = async () => {
    if (!selectedPathname) return;
    setAccepting(true);
    setActionMessage(null);
    try {
      const response = await fetch("/api/quotes/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname: selectedPathname,
          pricing: editablePricing,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSelectedQuote(result.data);
        setEditablePricing(result.data.pricing || null);
        setActionMessage(`Quote accepted and emails sent for ${selectedPathname}.`);
      } else {
        setError(result.error || "Failed to accept quote");
      }
    } catch (err) {
      setError("Error accepting quote");
      console.error(err);
    } finally {
      setAccepting(false);
    }
  };

  const fetchPricingConfig = async () => {
    try {
      setLoadingPricingConfig(true);
      setError(null); // Clear any previous errors
      const response = await fetch("/api/admin/pricing", {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setPricingConfig(result.config);
        setError(null); // Clear errors on success
      } else {
        setError(result.error || "Failed to load pricing configuration");
      }
    } catch (err) {
      setError("Error fetching pricing configuration");
      console.error(err);
    } finally {
      setLoadingPricingConfig(false);
    }
  };

  const savePricingConfig = async () => {
    if (!pricingConfig) return;
    setSavingPricingConfig(true);
    setActionMessage(null);
    try {
      const response = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: pricingConfig }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setPricingConfig(result.config);
        setActionMessage("Pricing configuration saved successfully!");
        setError(null); // Clear any previous errors
      } else {
        setError(result.error || "Failed to save pricing configuration");
        setActionMessage(null); // Clear success message on error
      }
    } catch (err) {
      setError("Error saving pricing configuration");
      setActionMessage(null); // Clear success message on error
      console.error(err);
    } finally {
      setSavingPricingConfig(false);
    }
  };

  const handlePricingConfigChange = (section: string, key: string, value: any) => {
    setPricingConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: typeof value === 'string' && value !== '' ? parseFloat(value) || 0 : value,
      },
    }));
  };

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Admin Access
          </h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
                autoFocus
              />
            </div>
            {authError && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee",
                  color: "#c00",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                {authError}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Quote Submissions Admin</h1>
        <button
          onClick={() => {
            fetch("/api/admin/auth", { 
              method: "DELETE",
              credentials: 'include',
            }).finally(() => {
              setAuthenticated(false);
              setQuoteObjects([]);
              setSelectedQuote(null);
              router.push("/");
            });
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={fetchQuotes}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Refresh List"}
        </button>
        <button
          onClick={() => {
            setShowAuditLogs(!showAuditLogs);
            if (!showAuditLogs) {
              fetchAuditLogs();
            }
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: showAuditLogs ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showAuditLogs ? "Hide" : "Show"} Audit Logs
        </button>
        <button
          onClick={() => {
            setShowPricingConfig(!showPricingConfig);
            if (!showPricingConfig && !pricingConfig) {
              fetchPricingConfig();
            }
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: showPricingConfig ? "#ff6b35" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showPricingConfig ? "Hide" : "Show"} Pricing Config
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {showPricingConfig && (
        <div
          style={{
            marginBottom: "2rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "1rem",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>Pricing Configuration</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={fetchPricingConfig}
                disabled={loadingPricingConfig}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loadingPricingConfig ? "not-allowed" : "pointer",
                }}
              >
                {loadingPricingConfig ? "Loading..." : "Refresh"}
              </button>
              <button
                onClick={savePricingConfig}
                disabled={savingPricingConfig || !pricingConfig}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: savingPricingConfig ? "not-allowed" : "pointer",
                }}
              >
                {savingPricingConfig ? "Saving..." : "Save Config"}
              </button>
            </div>
          </div>
          {actionMessage && (
            <div style={{ 
              padding: "0.75rem 1rem", 
              background: "#e7f7ed", 
              border: "1px solid #cde8d9", 
              borderRadius: "6px", 
              marginBottom: "1rem",
              color: "#155724"
            }}>
              {actionMessage}
            </div>
          )}
          {loadingPricingConfig ? (
            <p>Loading pricing configuration...</p>
          ) : pricingConfig ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {/* Base Prices */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Base Prices</h3>
                {Object.entries(pricingConfig.basePrices || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("basePrices", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>

              {/* Size Multipliers */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Size Multipliers</h3>
                {Object.entries(pricingConfig.sizeMultipliers || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.001"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("sizeMultipliers", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>

              {/* Pool Type Multipliers */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Pool Type Multipliers</h3>
                {Object.entries(pricingConfig.poolTypeMultipliers || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("poolTypeMultipliers", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>

              {/* Special Condition Fees */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Special Condition Fees</h3>
                {Object.entries(pricingConfig.specialConditionFees || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("specialConditionFees", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>

              {/* Equipment Prices */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Equipment Prices</h3>
                {Object.entries(pricingConfig.equipmentPrices || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("equipmentPrices", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>

              {/* Frequency Multipliers */}
              <div style={{ background: "white", padding: "1rem", borderRadius: "4px", border: "1px solid #ddd" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Frequency Multipliers</h3>
                {Object.entries(pricingConfig.frequencyMultipliers || {}).map(([key, value]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value as number}
                      onChange={(e) => handlePricingConfigChange("frequencyMultipliers", key, e.target.value)}
                      style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p>No pricing configuration loaded.</p>
          )}
        </div>
      )}

      {showAuditLogs && (
        <div
          style={{
            marginBottom: "2rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "1rem",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>Audit Logs ({auditLogs.length})</h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="email"
                placeholder="Filter by email..."
                value={auditEmailFilter}
                onChange={(e) => setAuditEmailFilter(e.target.value)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <button
                onClick={fetchAuditLogs}
                disabled={loadingAuditLogs}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loadingAuditLogs ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {loadingAuditLogs ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
          {loadingAuditLogs ? (
            <p>Loading audit logs...</p>
          ) : auditLogs.length === 0 ? (
            <p>No audit logs found.</p>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0", position: "sticky", top: 0 }}>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Timestamp</th>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Action</th>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Email</th>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>IP</th>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Success</th>
                    <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: log.success ? "white" : "#fff5f5",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td style={{ padding: "0.5rem" }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor:
                              log.action === "delete"
                                ? "#fee"
                                : log.action === "access"
                                ? "#e3f2fd"
                                : log.action === "view"
                                ? "#f3e5f5"
                                : "#f0f0f0",
                            color:
                              log.action === "delete"
                                ? "#c00"
                                : log.action === "access"
                                ? "#1976d2"
                                : log.action === "view"
                                ? "#7b1fa2"
                                : "#666",
                          }}
                        >
                          {log.action.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "0.5rem" }}>{log.email || "-"}</td>
                      <td style={{ padding: "0.5rem", fontSize: "0.75rem", color: "#666" }}>{log.ip || "-"}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {log.success ? (
                          <span style={{ color: "#28a745" }}>✓</span>
                        ) : (
                          <span style={{ color: "#dc3545" }}>✗</span>
                        )}
                      </td>
                      <td style={{ padding: "0.5rem", fontSize: "0.75rem", color: "#dc3545" }}>
                        {log.error || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Quote objects list */}
        <div>
          <h2 style={{ marginBottom: "1rem" }}>
            All Quotes ({quoteObjects.length})
          </h2>
          {loading ? (
            <p>Loading quotes...</p>
          ) : quoteObjects.length === 0 ? (
            <p>No quotes found.</p>
          ) : (
            <div style={{ border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
              {quoteObjects.map((obj) => (
                <div
                  key={obj.pathname}
                  onClick={() => fetchQuote(obj.pathname)}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    backgroundColor:
                      selectedPathname === obj.pathname ? "#f0f8ff" : "white",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPathname !== obj.pathname) {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPathname !== obj.pathname) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {obj.pathname.split("/").pop()}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>
                    {formatDate(obj.uploadedAt)} • {formatSize(obj.size)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quote Details */}
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Quote Details</h2>
          {loadingQuote ? (
            <p>Loading quote...</p>
          ) : selectedQuote ? (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "1rem",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <strong>Pathname:</strong> {selectedPathname}
              </div>
              <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {selectedQuote.status && (
                  <span style={{ padding: "0.35rem 0.6rem", background: "#eef2ff", borderRadius: "6px", fontWeight: 600 }}>
                    Status: {selectedQuote.status}
                  </span>
                )}
                {selectedQuote.createdAt && <span>Created: {new Date(selectedQuote.createdAt).toLocaleString()}</span>}
                {selectedQuote.updatedAt && <span>Updated: {new Date(selectedQuote.updatedAt).toLocaleString()}</span>}
                {selectedQuote.acceptedAt && <span>Accepted: {new Date(selectedQuote.acceptedAt).toLocaleString()}</span>}
              </div>
              {actionMessage && (
                <div style={{ padding: "0.75rem 1rem", background: "#e7f7ed", border: "1px solid #cde8d9", borderRadius: "6px", marginBottom: "1rem" }}>
                  {actionMessage}
                </div>
              )}
              {selectedQuote.pricing && (
                <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "6px", padding: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ margin: 0 }}>Pricing (editable)</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={savePricing}
                        disabled={savingPricing}
                        style={{ padding: "0.5rem 0.75rem", background: "#0d6efd", color: "white", border: "none", borderRadius: "4px", cursor: savingPricing ? "not-allowed" : "pointer" }}
                      >
                        {savingPricing ? "Saving..." : "Save Pricing"}
                      </button>
                      <button
                        onClick={acceptQuote}
                        disabled={accepting}
                        style={{ padding: "0.5rem 0.75rem", background: "#198754", color: "white", border: "none", borderRadius: "4px", cursor: accepting ? "not-allowed" : "pointer" }}
                      >
                        {accepting ? "Accepting..." : "Accept & Email"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
                    {["basePrice","sizeAdjustment","poolTypeAdjustment","specialConditionFees","equipmentFees","subtotal","monthlyTotal"].map((field) => (
                      <label key={field} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <span style={{ fontWeight: 600 }}>{field}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editablePricing?.[field] ?? ""}
                          onChange={(e) => handlePricingChange(field, e.target.value === "" ? null : Number(e.target.value))}
                          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                      </label>
                    ))}
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                      <span style={{ fontWeight: 600 }}>Is One-Time</span>
                      <input
                        type="checkbox"
                        checked={!!editablePricing?.isOneTime}
                        onChange={(e) => handlePricingChange("isOneTime", e.target.checked)}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </label>
                  </div>
                  <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                    {["weekly","biWeekly","monthly"].map((freq) => (
                      <label key={freq} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                        <span style={{ fontWeight: 600 }}>Frequency: {freq}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editablePricing?.frequencyVariants?.[freq] ?? ""}
                          onChange={(e) => handleFrequencyChange(freq, e.target.value === "" ? null : Number(e.target.value))}
                          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: "0.75rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                      <span style={{ fontWeight: 600 }}>Breakdown (one per line)</span>
                      <textarea
                        value={(editablePricing?.breakdown || []).join("\n")}
                        onChange={(e) => handlePricingChange("breakdown", e.target.value.split("\n"))}
                        rows={6}
                        style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                      />
                    </label>
                  </div>
                </div>
              )}
              <pre
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "0.875rem",
                  maxHeight: "600px",
                }}
              >
                {JSON.stringify(selectedQuote, null, 2)}
              </pre>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "2rem",
                textAlign: "center",
                color: "#999",
              }}
            >
              Select a quote to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

