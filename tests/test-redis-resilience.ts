import { redisService } from '../src/lib/redis';
import { checkRateLimit } from '../src/lib/rate-limit';
import { supabase } from '../src/lib/db';

// Simple test assertion helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Store original global fetch
const originalFetch = global.fetch;

async function runRedisResilienceTests() {
  console.log('\n======================================================');
  console.log('       RUNNING REDIS RESILIENCE TEST SUITE            ');
  console.log('======================================================\n');

  let passedTests = 0;
  const totalTests = 7;

  // Setup test environment variables manually
  process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'mock_token';
  
  // Re-initialize redisService to pick up these mock envs
  (redisService as any).init();

  const testPhone = '+919999988888';
  const testIp = '192.168.1.1';

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Redis Configured and Healthy
    // -------------------------------------------------------------------------
    console.log('Running Test 1: Redis Configured and Healthy...');
    let fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return {
          ok: true,
          status: 200,
          json: async () => ({ result: '5' }),
          text: async () => '{"result": "5"}'
        } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    const res1 = await checkRateLimit(testPhone, testIp);
    assert(fetchCalled, 'Expected fetch to be called for rate-limiting');
    assert(res1.allowed === true, 'Expected allowed to be true (count = 5 <= limit = 60)');
    assert(res1.count === 5, 'Expected count to be 5');
    assert(redisService.getCircuitStateForTesting().state === 'CLOSED', 'Circuit breaker should be CLOSED');
    console.log('[✓ PASSED] Test 1: Redis Healthy path operates correctly.\n');
    passedTests++;

    // -------------------------------------------------------------------------
    // TEST 2: Redis Environment Variables Missing
    // -------------------------------------------------------------------------
    console.log('Running Test 2: Redis Environment Variables Missing...');
    process.env.UPSTASH_REDIS_REST_URL = '';
    process.env.UPSTASH_REDIS_REST_TOKEN = '';
    (redisService as any).init(); // refresh configuration state

    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return { ok: false, status: 400 } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    // This should fall back to DB immediately without calling fetch for Upstash
    const res2 = await checkRateLimit(testPhone, testIp);
    assert(!fetchCalled, 'Expected fetch NOT to be called when env variables are missing');
    assert(typeof res2.allowed === 'boolean', 'Expected db fallback to return a boolean allowed flag');
    console.log('[✓ PASSED] Test 2: Gracefully falls back to DB when env credentials are missing.\n');
    passedTests++;

    // Restore env variables for remaining tests
    process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock_token';
    (redisService as any).init();

    // -------------------------------------------------------------------------
    // TEST 3: Redis Request Timeout Handling
    // -------------------------------------------------------------------------
    console.log('Running Test 3: Redis Request Timeout Handling...');
    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        // Simulate network hanging: delay longer than the 2500ms timeout
        // Support abort signal mock to abort properly on timeout
        return new Promise<Response>((resolve, reject) => {
          const timeout = setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ result: '10' })
            } as unknown as Response);
          }, 5000); // 5 seconds delay
          
          if (options?.signal) {
            options.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              const err = new Error('The operation was aborted.');
              err.name = 'AbortError';
              reject(err);
            });
          }
        });
      }
      return originalFetch(url, options);
    };

    const startTime = Date.now();
    const res3 = await checkRateLimit(testPhone, testIp);
    const duration = Date.now() - startTime;
    
    assert(fetchCalled, 'Expected fetch to be called');
    // The request should abort before 5000ms (at ~2500ms) and fallback to DB rate limiter
    assert(duration < 4000, `Expected request to timeout and abort before 4000ms, took ${duration}ms`);
    assert(typeof res3.allowed === 'boolean', 'Expected DB fallback to execute');
    console.log('[✓ PASSED] Test 3: Request times out after short limit and falls back to DB rate limit.\n');
    passedTests++;

    // Reset circuit state for the next test
    redisService.forceStateForTesting('CLOSED');

    // -------------------------------------------------------------------------
    // TEST 4: Redis API Internal Error (500 Server Error)
    // -------------------------------------------------------------------------
    console.log('Running Test 4: Redis API Internal Error (500 Error)...');
    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return {
          ok: false,
          status: 500,
          text: async () => 'Internal Server Error'
        } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    const res4 = await checkRateLimit(testPhone, testIp);
    assert(fetchCalled, 'Expected fetch to be called');
    assert(typeof res4.allowed === 'boolean', 'Expected fallback rate limiter to run');
    console.log('[✓ PASSED] Test 4: Caught API 500 errors and fell back to DB successfully.\n');
    passedTests++;

    // Reset circuit state
    redisService.forceStateForTesting('CLOSED');

    // -------------------------------------------------------------------------
    // TEST 5: Quota Exhaustion / Rate Limit Exceeded (429 Too Many Requests)
    // -------------------------------------------------------------------------
    console.log('Running Test 5: Quota/Rate Limit Exhaustion (429 Error)...');
    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return {
          ok: false,
          status: 429,
          text: async () => 'Rate Limit Exceeded'
        } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    const res5 = await checkRateLimit(testPhone, testIp);
    assert(fetchCalled, 'Expected fetch to be called');
    assert(typeof res5.allowed === 'boolean', 'Expected DB fallback to execute');
    
    const circuitState = redisService.getCircuitStateForTesting();
    assert(circuitState.state === 'OPEN', 'Circuit breaker should trip to OPEN state immediately on 429');
    console.log('[✓ PASSED] Test 5: Trips circuit breaker immediately to OPEN on 429 Quota Exhaustion.\n');
    passedTests++;

    // -------------------------------------------------------------------------
    // TEST 6: Circuit Breaker Cooldown and Bypass Mode
    // -------------------------------------------------------------------------
    console.log('Running Test 6: Circuit Breaker Cooldown and Bypass...');
    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return {
          ok: true,
          json: async () => ({ result: '1' })
        } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    // Circuit is OPEN, so calling rate limiter should NOT trigger fetch (bypass Redis)
    const res6 = await checkRateLimit(testPhone, testIp);
    assert(!fetchCalled, 'Expected fetch to be BYPASSED while circuit breaker is OPEN');
    assert(typeof res6.allowed === 'boolean', 'Expected DB fallback to execute');
    console.log('[✓ PASSED] Test 6: Bypasses Redis network requests entirely during cooldown.\n');
    passedTests++;

    // -------------------------------------------------------------------------
    // TEST 7: Redis Recovery (Moving to CLOSED state)
    // -------------------------------------------------------------------------
    console.log('Running Test 7: Redis Recovery (Bypassing Cooldown manually)...');
    
    // Fast-forward nextRetryTime manually to simulate cooldown elapsed
    redisService.forceStateForTesting('OPEN', Date.now() - 1000);
    
    fetchCalled = false;
    global.fetch = async (url: any, options: any): Promise<Response> => {
      const urlStr = String(url);
      if (urlStr.includes('mock-redis.upstash.io')) {
        fetchCalled = true;
        return {
          ok: true,
          json: async () => ({ result: '1' }),
          text: async () => '{"result": "1"}'
        } as unknown as Response;
      }
      return originalFetch(url, options);
    };

    const res7 = await checkRateLimit(testPhone, testIp);
    assert(fetchCalled, 'Expected fetch to be called (circuit entered HALF-OPEN state)');
    assert(res7.allowed === true, 'Expected allowed to be true');
    
    const stateAfterSuccess = redisService.getCircuitStateForTesting();
    assert(stateAfterSuccess.state === 'CLOSED', 'Circuit breaker should recover to CLOSED on success');
    console.log('[✓ PASSED] Test 7: Automatically restores Redis usage once backend recovers.\n');
    passedTests++;

  } finally {
    // Restore original global fetch
    global.fetch = originalFetch;
  }

  console.log('======================================================');
  console.log(` SUMMARY: ${passedTests}/${totalTests} Resilience Tests Passed`);
  console.log('======================================================\n');

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

runRedisResilienceTests().catch((err) => {
  console.error('Fatal resilience test runner failure:', err);
  process.exit(1);
});
