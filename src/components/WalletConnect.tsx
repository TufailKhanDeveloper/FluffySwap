import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export const WalletConnect: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-end p-4"
    >
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl"
                    >
                      Connect Wallet
                    </motion.button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      className="bg-red-400 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
                    >
                      Wrong network
                    </motion.button>
                  );
                }

                return (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      className="bg-gradient-to-r from-blue-300 to-teal-300 hover:from-blue-400 hover:to-teal-400 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                      {chain.hasIcon && (
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-4 h-4"
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAccountModal}
                      className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </motion.button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </motion.div>
  );
};