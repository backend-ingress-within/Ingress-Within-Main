interface RedisCallConfig {
  timeoutMs?: number;
}

class UpstashRedisService {
  private url: string | null = null;
  private token: string | null = null;
  private isAvailable: boolean = false;
  
  // Circuit Breaker State
  private state: 'CLOSED' | 'OPEN' | 'HALF-OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private nextRetryTime: number = 0;
  
  // Configuration
  private readonly FAILURE_THRESHOLD = 3;      // Number of failures before tripping circuit breaker
  private readonly COOLDOWN_DURATION_MS = 60000; // Bypass Redis for 1 minute when tripped
  private readonly DEFAULT_TIMEOUT_MS = 2500;   // Timeout for Rest API requests (prevent blocking requests)
  
  constructor() {
    this.init();
  }
  
  private init() {
    try {
      const rawUrl = process.env.UPSTASH_REDIS_REST_URL || '';
      const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';
      
      // Strip any outer quotes that may have been parsed literally from the .env file
      this.url = rawUrl.replace(/^["']|["']$/g, '').trim() || null;
      this.token = rawToken.replace(/^["']|["']$/g, '').trim() || null;
      
      if (this.url && this.token) {
        this.isAvailable = true;
        this.state = 'CLOSED';
      } else {
        this.isAvailable = false;
      }
    } catch (err) {
      console.error('[Redis Service] Initialization error:', err);
      this.isAvailable = false;
    }
  }
  
  /**
   * Safe availability check. Checks both config status and circuit breaker state.
   */
  public checkAvailability(): boolean {
    if (!this.isAvailable || !this.url || !this.token) {
      return false;
    }
    
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now >= this.nextRetryTime) {
        // Move to HALF-OPEN to attempt recovery
        this.state = 'HALF-OPEN';
        console.log('[Redis Service] Circuit Breaker entering HALF-OPEN state. Attempting recovery check...');
        return true;
      }
      // Circuit is open, bypass Redis
      return false;
    }
    
    return true;
  }
  
  /**
   * Tracks a successful operation to reset or maintain CLOSED state.
   */
  private recordSuccess() {
    this.failureCount = 0;
    if (this.state !== 'CLOSED') {
      console.log('[Redis Service] Circuit Breaker CLOSED. Upstash Redis recovered.');
      this.state = 'CLOSED';
    }
  }
  
  /**
   * Tracks a failed operation. Trips breaker to OPEN state if threshold is reached.
   */
  private recordFailure(error: any) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    const isQuotaError = this.isQuotaOrRateLimitError(error);
    
    if (isQuotaError || this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = 'OPEN';
      this.nextRetryTime = Date.now() + this.COOLDOWN_DURATION_MS;
      console.warn(
        `[Redis Service] Circuit Breaker tripped to OPEN. Cooldown for ${this.COOLDOWN_DURATION_MS}ms. Reason: ${
          isQuotaError ? 'Quota/RateLimit Exceeded' : `${this.failureCount} consecutive failures`
        }. Error:`,
        error?.message || error
      );
    } else {
      console.warn(`[Redis Service] Operation failed. Failure count: ${this.failureCount}/${this.FAILURE_THRESHOLD}. Error:`, error?.message || error);
    }
  }

  private isQuotaOrRateLimitError(error: any): boolean {
    const msg = String(error?.message || '').toLowerCase();
    const status = error?.status;
    // Upstash returns 429 for rate limit or quota exceeded
    return status === 429 || msg.includes('quota') || msg.includes('rate limit') || msg.includes('429');
  }

  /**
   * Safe wrapper to perform operations (fetch) against Upstash REST API with timeouts and graceful failure.
   */
  public async eval(script: string, keys: string[], args: string[], config?: RedisCallConfig): Promise<any | null> {
    if (!this.checkAvailability()) {
      return null;
    }
    
    const timeoutMs = config?.timeoutMs || this.DEFAULT_TIMEOUT_MS;
    const cleanUrl = this.url!.replace(/^https?:\/\//, '');
    const endpoint = `https://${cleanUrl}`;
    
    // Abort controller for timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          'EVAL',
          script,
          String(keys.length),
          ...keys,
          ...args
        ]),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        const errObj = { status: response.status, message: errorText };
        throw errObj;
      }
      
      const data = await response.json() as any;
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      // Success! Record it.
      this.recordSuccess();
      return data.result !== undefined ? data.result : null;
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      // Check if it was aborted (timeout)
      let finalError = err;
      if (err.name === 'AbortError') {
        finalError = new Error(`Request timed out after ${timeoutMs}ms`);
      }
      
      this.recordFailure(finalError);
      return null;
    }
  }

  // Helper method for testing/triggering manual states inside tests
  public forceStateForTesting(state: 'CLOSED' | 'OPEN' | 'HALF-OPEN', nextRetryTime = 0) {
    this.state = state;
    this.nextRetryTime = nextRetryTime;
    if (state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  public getCircuitStateForTesting() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextRetryTime: this.nextRetryTime
    };
  }
}

export const redisService = new UpstashRedisService();
