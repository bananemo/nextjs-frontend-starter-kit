import { afterEach, describe, expect, it, vi } from 'vitest';
import { consoleObservabilityProvider } from './console-provider';
import {
  captureException,
  captureMessage,
  getObservabilityProvider,
  setObservabilityProvider,
  setUser,
} from './index';
import type { ObservabilityProvider } from './types';

function createSpyProvider(): ObservabilityProvider {
  return {
    captureException: vi.fn<ObservabilityProvider['captureException']>(),
    captureMessage: vi.fn<ObservabilityProvider['captureMessage']>(),
    setUser: vi.fn<ObservabilityProvider['setUser']>(),
  };
}

describe('observability layer', () => {
  afterEach(() => {
    setObservabilityProvider(consoleObservabilityProvider);
    vi.restoreAllMocks();
  });

  it('defaults to the console provider', () => {
    expect(getObservabilityProvider()).toBe(consoleObservabilityProvider);
  });

  it('routes every call to the registered provider', () => {
    const provider = createSpyProvider();
    setObservabilityProvider(provider);

    const error = new Error('boom');
    captureException(error, { level: 'error' });
    captureMessage('something odd');
    setUser({ id: 'user-1' });

    expect(provider.captureException).toHaveBeenCalledWith(error, { level: 'error' });
    expect(provider.captureMessage).toHaveBeenCalledWith('something odd', undefined);
    expect(provider.setUser).toHaveBeenCalledWith({ id: 'user-1' });
  });

  it('accepts non-Error throwables, since Next.js types them as unknown', () => {
    const provider = createSpyProvider();
    setObservabilityProvider(provider);

    captureException('a string was thrown');
    captureException({ digest: 'abc123' });

    expect(provider.captureException).toHaveBeenCalledTimes(2);
  });

  it('writes to the console by default rather than throwing', () => {
    // oxlint-disable-next-line unicorn/no-useless-undefined -- silences the spy
    const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);

    captureException(new Error('boom'));

    expect(spy).toHaveBeenCalledWith('[observability] exception', expect.any(Error), '');
  });
});
