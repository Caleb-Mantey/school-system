import { SetMetadata } from '@nestjs/common';

export const IgnoreApiKey = () => SetMetadata('ignore-api-key', true);
