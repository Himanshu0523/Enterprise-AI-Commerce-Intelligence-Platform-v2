/**
 * Shared Chaos Engineering & Fault Injection Interceptor
 *
 * Implements run-time configurable network dropouts, partitions, and latencies
 * for both Node.js HTTP calls and route handlers. Enables testing "Jepsen-style"
 * split-brain or network partitions in local development or Docker without root privileges.
 */

const chaosState = {
  partitionActive: false,
  blockedHosts: [], // List of hostnames/ports to drop packets/block traffic to
  latencyMs: 0,     // Artificial latency for handlers/calls
  dropRate: 0,      // Probability (0.0 to 1.0) of dropping the request/call
};

/**
 * Configure Chaos State
 */
function configureChaos(config) {
  if (config.partitionActive !== undefined) chaosState.partitionActive = config.partitionActive;
  if (config.blockedHosts !== undefined) chaosState.blockedHosts = config.blockedHosts;
  if (config.latencyMs !== undefined) chaosState.latencyMs = config.latencyMs;
  if (config.dropRate !== undefined) chaosState.dropRate = config.dropRate;
  console.log(`[CHAOS] Updated configuration:`, chaosState);
  return chaosState;
}

/**
 * Check if a target host/URL is blocked under the current partition
 */
function isHostBlocked(targetUrl) {
  if (!chaosState.partitionActive) return false;
  return chaosState.blockedHosts.some(host => targetUrl.includes(host));
}

/**
 * Express Middleware to inject chaos into inbound route handlers
 */
const chaosMiddleware = (req, res, next) => {
  // 1. Simulate packet drop/network partition
  if (chaosState.partitionActive && Math.random() < chaosState.dropRate) {
    console.log(`[CHAOS] Dropping inbound request: ${req.method} ${req.url}`);
    return; // Request hangs indefinitely (simulates packet drop)
  }

  // 2. Simulate blocked host (partitioned client)
  const clientHost = req.headers.host || '';
  if (isHostBlocked(clientHost)) {
    console.log(`[CHAOS] Blocking inbound request from ${clientHost}: ${req.method} ${req.url}`);
    return res.status(503).json({ error: 'Service Unavailable (Partitioned)' });
  }

  // 3. Simulate latency
  if (chaosState.latencyMs > 0) {
    return setTimeout(next, chaosState.latencyMs);
  }

  next();
};

/**
 * Chaos-wrapped native fetch. Use this in microservices for downstream HTTP calls.
 */
async function chaosFetch(url, options = {}) {
  // Check if target is blocked under current partition
  if (isHostBlocked(url)) {
    console.log(`[CHAOS] Partition Active: Blocked outbound call to ${url}`);
    throw new TypeError('fetch failed: Connection timed out (Network Partition)');
  }

  // Inject latency
  if (chaosState.latencyMs > 0) {
    await new Promise(resolve => setTimeout(resolve, chaosState.latencyMs));
  }

  // Simulate packet drop on outgoing call
  if (chaosState.partitionActive && Math.random() < chaosState.dropRate) {
    console.log(`[CHAOS] Dropping outbound call to ${url}`);
    await new Promise(() => {}); // Hangs forever
  }

  return fetch(url, options);
}

/**
 * Register Chaos Admin endpoints on an Express app
 */
function registerChaosRoutes(app, serviceName) {
  app.get('/api/chaos/status', (req, res) => {
    res.json({ service: serviceName, config: chaosState });
  });

  app.post('/api/chaos/configure', (req, res) => {
    const updated = configureChaos(req.body);
    res.json({ success: true, service: serviceName, config: updated });
  });
}

module.exports = {
  configureChaos,
  isHostBlocked,
  chaosMiddleware,
  chaosFetch,
  registerChaosRoutes,
  chaosState
};
