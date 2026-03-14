const API = {
  getOverview: async () => {
    const res = await fetch("/api/stats/overview");
    return res.json();
  },

  getTraffic: async () => {
    const res = await fetch("/api/stats/traffic");
    return res.json();
  },

  getTopIPs: async () => {
    const res = await fetch("/api/stats/top-ips");
    return res.json();
  },

  getAlerts: async () => {
    const res = await fetch("/api/alerts");
    return res.json();
  },

  resolveAlert: async (id) => {
    const res = await fetch(`/api/alerts/${id}/resolve`, {
      method: "PATCH"
    });
    return res.json();
  },

  getLogs: async () => {
    const res = await fetch("/api/logs");
    return res.json();
  },

  getIPs: async () => {
    const res = await fetch("/api/ips");
    return res.json();
  },

  blockIP: async (ip, reason) => {
    const res = await fetch("/api/ips/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip, reason })
    });
    return res.json();
  },

  unblockIP: async (ip) => {
    const res = await fetch("/api/ips/unblock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip })
    });
    return res.json();
  }
};

export default API;