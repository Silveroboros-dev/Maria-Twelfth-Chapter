/* A parent PIN prevents casual spoilers. This static site does not provide secure authentication. */
(function (root) {
  "use strict";
  const VERIFIER = "8d4a01797a58ada8f91fafb743cc482bf7c0823bd4c6545acb4bc5bc68ea3d47";
  async function checkPin(value) {
    if (!/^\d{4}$/.test(value || "")) return false;
    const bytes = new TextEncoder().encode("maria-keeper-v1:" + value);
    const digest = await root.crypto.subtle.digest("SHA-256", bytes);
    const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    return hex === VERIFIER;
  }
  const api = { checkPin };
  root.QuestKeeper = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
