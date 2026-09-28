import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

export const { appId } = appParams;
const { token, functionsVersion, appBaseUrl } = appParams;
export const authRedirectBaseUrl = appBaseUrl || 'https://reelchess.org';

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl: authRedirectBaseUrl
});
