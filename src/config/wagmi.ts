import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

const infuraProjectId = import.meta.env.VITE_INFURA_API_KEY;

// Validate environment variables
if (!infuraProjectId && import.meta.env.PROD) {
  console.warn('⚠️ VITE_INFURA_API_KEY is not set. Using public providers only.');
}

const { chains: configuredChains, publicClient, webSocketPublicClient } = configureChains(
  [
    sepolia,
    ...(import.meta.env.DEV ? [hardhat] : []),
  ],
  [
    // Primary: Infura (if available)
    ...(infuraProjectId ? [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === sepolia.id) {
            return {
              http: `https://sepolia.infura.io/v3/${infuraProjectId}`,
              webSocket: `wss://sepolia.infura.io/ws/v3/${infuraProjectId}`,
            };
          }
          return null;
        },
      })
    ] : []),
    
    // Fallback: Public providers
    publicProvider(),
    
    // Local development
    ...(import.meta.env.DEV ? [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === hardhat.id) {
            return {
              http: 'http://127.0.0.1:8545',
            };
          }
          return null;
        },
      })
    ] : []),
  ]
);

// Log active configuration for debugging
console.log("🔗 Wagmi Configuration:", {
  chains: configuredChains.map(c => ({ name: c.name, id: c.id })),
  infuraConfigured: !!infuraProjectId,
  environment: import.meta.env.MODE,
});

const { connectors } = getDefaultWallets({
  appName: 'FluffySwap',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: configuredChains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
}) as any;

export const chains = configuredChains as any;