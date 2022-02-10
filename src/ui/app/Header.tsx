import React, { ReactElement } from "react";
import { useWeb3React } from "@web3-react/core";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { t } from "ttag";
import { WalletProfileButton } from "src/ui/wallet/ConnectWalletButton";
import { useGasPrice } from "src/ui/ethereum/useGasPrice";
import { RESOURCES_URL } from "src/ui/resources";

const GAS_URL = "https://www.etherchain.org/tools/gasnow";

function Header(): ReactElement {
  const { account, active } = useWeb3React();
  const { data: gasPrice } = useGasPrice();

  return (
    <div className="flex w-full justify-between">
      <div className="flex space-x-3"></div>
      <div className="mr-3 flex items-center space-x-4 text-gray-400">
        {account ? (
          <div className="flex items-center">
            <div className="mr-8 flex items-center gap-1">
              <a
                target="_blank"
                rel="noreferrer"
                href={RESOURCES_URL}
                className="hidden items-center gap-2 md:flex"
              >
                <span className="text-principalRoyalBlue">{t`Learn how to vote`}</span>
                <ExternalLinkIcon className="h-4 shrink-0 text-principalRoyalBlue" />
              </a>
            </div>
            <a
              href={GAS_URL}
              target="_blank"
              rel="noreferrer"
              className="mr-8 flex items-center"
            >
              <div className="relative h-5 w-5">
                <Image
                  layout="fill"
                  src="/assets/gas.svg"
                  alt={t`Gas pump icon`}
                />
              </div>
              <span className="ml-2 mr-1 font-bold text-principalRoyalBlue">
                {gasPrice?.recommendedBaseFee || 0.0}
              </span>
            </a>
          </div>
        ) : null}

        <WalletProfileButton
          account={account}
          walletConnectionActive={active}
        />
      </div>
    </div>
  );
}

export default Header;
