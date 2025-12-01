// パフォーマンス測定と最適化のためのユーティリティ

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.metrics.set(`${label}_start`, Date.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`Timer ${label} was not started`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    this.metrics.set(`${label}_duration`, duration);
    this.metrics.delete(`${label}_start`);
    
    console.log(`${label}: ${duration}ms`);
    return duration;
  }

  getDuration(label: string): number {
    return this.metrics.get(`${label}_duration`) || 0;
  }

  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      if (key.endsWith('_duration')) {
        result[key.replace('_duration', '')] = value;
      }
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// API呼び出しのパフォーマンス測定
export const measureApiCall = async <T>(
  apiCall: () => Promise<T>,
  label: string
): Promise<T> => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(label);
  
  try {
    const result = await apiCall();
    monitor.endTimer(label);
    return result;
  } catch (error) {
    monitor.endTimer(label);
    throw error;
  }
};

// デバウンス関数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// スロットル関数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// メモリ使用量の監視
export const getMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};

// パフォーマンス警告
export const checkPerformance = () => {
  const memory = getMemoryUsage();
  if (memory && memory.used > memory.limit * 0.8) {
    console.warn('High memory usage detected:', memory);
  }
};




