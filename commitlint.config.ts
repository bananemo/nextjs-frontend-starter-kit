import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  // Ignore automated dependency bumps (Dependabot).
  ignores: [(message) => message.startsWith('chore: bump') || message.startsWith('Updating')],
};

export default Configuration;
