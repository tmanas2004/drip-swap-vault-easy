import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, bsc, arbitrum } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = 'your-project-id' // In a real app, this would come from WalletConnect Cloud

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'DripSwapWallet',
        description: 'Professional CEX-style wallet with DeFi capabilities',
        url: 'https://dripswapwallet.com',
        icons: ['https://dripswapwallet.com/logo.png']
      }
    }),
    coinbaseWallet({
      appName: 'DripSwapWallet',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}