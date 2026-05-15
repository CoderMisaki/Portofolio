const assert = require('assert');

// --- Global Mocks for js/main.js ---
global.document = {
  getElementById: (id) => {
    if (id === 'project-list') return { innerHTML: '', setAttribute: () => {} };
    if (id === 'main-nav') return { classList: { toggle: () => {}, remove: () => {} }, querySelectorAll: () => [] };
    return { setAttribute: () => {} };
  },
  querySelector: () => ({ style: {}, addEventListener: () => {}, setAttribute: () => {} }),
  querySelectorAll: () => ([]),
};

global.window = {
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {},
  requestAnimationFrame: () => {}
};

global.IntersectionObserver = class { observe() {} };

// --- Load and Test ---
import('../js/main.js').then(({ sanitizeURL }) => {
  let passed = 0;
  let failed = 0;

  const runTest = (name, input, expected) => {
    try {
      const result = sanitizeURL(input);
      assert.strictEqual(result, expected);
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Expected: "${expected}"`);
      console.error(`   Got:      "${sanitizeURL(input)}"`);
      failed++;
    }
  };

  console.log("🧪 Running Tests for sanitizeURL...\n");

  // Standard valid URLs
  runTest("Valid HTTP URL", "http://example.com", "http://example.com");
  runTest("Valid HTTPS URL", "https://example.com", "https://example.com");
  runTest("Relative path", "/about", "/about");

  // Basic XSS payloads
  runTest("javascript: protocol", "javascript:alert(1)", "about:blank");
  runTest("JAVASCRIPT: mixed casing", "JaVaScRiPt:alert(1)", "about:blank");

  // Whitespace bypass attempts
  runTest("Leading space before javascript:", " javascript:alert(1)", "about:blank");
  runTest("Leading tab before javascript:", "\tjavascript:alert(1)", "about:blank");
  runTest("Leading newline before javascript:", "\njavascript:alert(1)", "about:blank");

  // Other potential protocols and edge cases
  runTest("Data URI (base64 image)", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", "about:blank");

  // URL encoded and null byte injection edge cases
  runTest("URL Encoded javascript:", "javascript%3Aalert(1)", "about:blank");
  runTest("Null byte injection", "java\x00script:alert(1)", "about:blank");

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}).catch(err => {
  console.error("Failed to load js/main.js or run tests:", err);
  process.exit(1);
});
