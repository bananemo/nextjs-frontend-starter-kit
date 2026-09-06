import { afterEach, describe, expect, it, vi } from 'vitest';
import { consoleAnalyticsProvider } from './console-provider';
import { getAnalyticsProvider, identify, page, reset, setAnalyticsProvider, track } from './index';
import type { AnalyticsProvider } from './types';

function createSpyProvider(): AnalyticsProvider {
  return {
    track: vi.fn<AnalyticsProvider['track']>(),
    identify: vi.fn<AnalyticsProvider['identify']>(),
    page: vi.fn<AnalyticsProvider['page']>(),
    reset: vi.fn<AnalyticsProvider['reset']>(),
  };
}

describe('analytics layer', () => {
  afterEach(() => {
    setAnalyticsProvider(consoleAnalyticsProvider);
    vi.restoreAllMocks();
  });

  it('defaults to the console provider', () => {
    expect(getAnalyticsProvider()).toBe(consoleAnalyticsProvider);
  });

  it('routes every call to the registered provider', () => {
    const provider = createSpyProvider();
    setAnalyticsProvider(provider);

    track('signed_up', { plan: 'pro' });
    identify('user-1', { email: 'ada@example.com' });
    page('/pricing', { referrer: '/' });
    reset();

    expect(provider.track).toHaveBeenCalledWith('signed_up', { plan: 'pro' });
    expect(provider.identify).toHaveBeenCalledWith('user-1', { email: 'ada@example.com' });
    expect(provider.page).toHaveBeenCalledWith('/pricing', { referrer: '/' });
    expect(provider.reset).toHaveBeenCalledOnce();
  });

  it('stops calling a provider once it has been replaced', () => {
    const first = createSpyProvider();
    const second = createSpyProvider();

    setAnalyticsProvider(first);
    setAnalyticsProvider(second);
    track('event');

    expect(first.track).not.toHaveBeenCalled();
    expect(second.track).toHaveBeenCalledWith('event', undefined);
  });
});
