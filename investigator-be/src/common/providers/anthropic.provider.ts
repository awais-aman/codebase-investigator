import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Provides } from '@/shared/constants';

/**
 * Returns an Anthropic client. The key is read lazily so the app can boot
 * without ANTHROPIC_API_KEY in the environment — calls only fail when an
 * actual API request is made (so health/sessions endpoints stay usable).
 */
export const AnthropicProvider: Provider = {
  provide: Provides.Anthropic,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Anthropic => {
    const logger = new Logger('AnthropicProvider');
    const apiKey = config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      logger.warn(
        'ANTHROPIC_API_KEY not set. Agent / audit calls will fail until it is configured.',
      );
    }
    // Anthropic SDK accepts an empty string and will throw on actual requests,
    // which is exactly the behavior we want.
    return new Anthropic({ apiKey: apiKey ?? '' });
  },
};
