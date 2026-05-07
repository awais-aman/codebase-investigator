import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Provides } from '@/shared/constants';

export const AnthropicProvider: Provider = {
  provide: Provides.Anthropic,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Anthropic => {
    const apiKey = config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    return new Anthropic({ apiKey });
  },
};
