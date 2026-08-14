/**
 * Trace Auditing and P99 Latency Analysis Tool
 *
 * Reads the recorded OpenTelemetry-compatible traces JSON log, computes P99
 * and average latency profiles for all spans, flags performance bottlenecks,
 * and outputs a visual Directed Acyclic Graph (DAG) Call Graph of traced requests.
 */

const { auditLatency } = require('../packages/shared-utils/tracing');
const fs = require('fs');
const path = require('path');
const TRACE_FILE = path.join(__dirname, '..', 'artifacts', 'traces.json');

function renderDAGCallGraph() {
  if (!fs.existsSync(TRACE_FILE)) {
    console.log('⚠️ No trace file found. Execute transactions to populate traces.');
    return;
  }

  const spans = JSON.parse(fs.readFileSync(TRACE_FILE, 'utf8') || '[]');
  if (spans.length === 0) {
    console.log('⚠️ Traces log is empty.');
    return;
  }

  // Group spans by traceId
  const traces = {};
  spans.forEach(span => {
    if (!traces[span.traceId]) traces[span.traceId] = [];
    traces[span.traceId].push(span);
  });

  console.log('\n======================================================');
  console.log('🌲 DISTRIBUTED TRACE CALL GRAPH (DAG)');
  console.log('======================================================');

  Object.keys(traces).forEach(traceId => {
    console.log(`\nTrace ID: ${traceId}`);
    const traceSpans = traces[traceId];
    
    // Find root spans (no parent Span ID or parent not in this trace)
    const spanMap = {};
    traceSpans.forEach(s => { spanMap[s.spanId] = s; });
    const roots = traceSpans.filter(s => !s.parentSpanId || !spanMap[s.parentSpanId]);

    function printTree(span, indent = '  ') {
      const statusIcon = span.status.code === 'OK' ? '✅' : (span.status.code === 'ERROR' ? '❌' : '⚪');
      const serviceColor = span.attributes['service.name'] === 'order-service' ? '\x1b[36m' : '\x1b[35m';
      const reset = '\x1b[0m';
      
      console.log(`${indent}└─ ${statusIcon} [${serviceColor}${span.attributes['service.name']}${reset}] ${span.name} - \x1b[33m${span.durationMs.toFixed(2)} ms\x1b[0m`);
      
      // Find children
      const children = traceSpans.filter(s => s.parentSpanId === span.spanId);
      children.forEach(child => printTree(child, indent + '    '));
    }

    roots.forEach(root => printTree(root));
  });
}

function runAudit() {
  console.log('📊 Initiating Distributed Tracing Audit...');
  const report = auditLatency();

  if (report.error) {
    console.log(`❌ Audit Failed: ${report.error}`);
    return;
  }

  console.log('\n======================================================');
  console.log('📈 GLOBAL LATENCY PERFORMANCE PROFILE');
  console.log('======================================================');
  console.log(`Total Spans Profiled : ${report.totalSpansTracked}`);
  console.log(`Global P99 Latency    : ${report.globalP99Ms} ms`);
  console.log('======================================================');

  console.log('\n%-30s | %-12s | %-12s | %-12s | %-12s', 'SPAN NAME', 'CALLS', 'AVG LATENCY', 'P99 LATENCY', 'STATUS');
  console.log('-'.repeat(80));
  
  Object.keys(report.spans).forEach(name => {
    const span = report.spans[name];
    console.log(
      '%-30s | %-12s | %-12s | %-12s | %-12s',
      name,
      span.calls,
      `${span.avgLatencyMs} ms`,
      `${span.p99LatencyMs} ms`,
      span.bottleneckScore
    );
  });

  renderDAGCallGraph();
}

runAudit();
