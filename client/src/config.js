const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim();
const isLoopbackUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredServerUrl || "");

export const server_url = import.meta.env.PROD && isLoopbackUrl
    ? "https://smartexam-backend-ypxk.onrender.com"
    : configuredServerUrl || "http://localhost:5000";
