import { ReactElement, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Signer } from "ethers";
import { Delegate } from "src/elf-council-delegates/delegates";
import tw from "src/elf-tailwindcss-classnames";
import H1 from "src/ui/base/H1";
import H2 from "src/ui/base/H2";
import PortfolioCard from "src/ui/delegate/PortfolioCard/PortfolioCard";
import DelegateCard from "src/ui/delegate/DelegateCard/DelegateCard";
import { t } from "ttag";
import DelegatesList from "./DelegatesList/DelegatesList";
import GradientCard from "src/ui/base/Card/GradientCard";

export default function DelegatePage(): ReactElement {
  const { account, library } = useWeb3React();
  const signer = account ? (library?.getSigner(account) as Signer) : undefined;

  const [currentDelegate, setCurrentDelegate] = useState<
    Delegate | undefined
  >();

  return (
    <div className={tw("flex", "flex-col", "items-start")}>
      <div className={tw("flex", "h-full", "w-full", "py-8")}>
        <div
          className={tw(
            "w-full",
            "flex",
            "flex-col",
            "xl:flex-row",
            "justify-center"
          )}
        >
          {/* Portfolio Card */}
          <GradientCard
            className={tw(
              "flex",
              "w-full",
              "flex-col",
              "lg:flex-row",
              "xl:flex-col",
              "xl:w-4/12",
              "h-full",
              "rounded-xl",
              "shadow",
              "mr-8"
            )}
          >
            <div className={tw("w-full", "px-6", "py-7")}>
              <H2
                className={tw(
                  "mb-4",
                  "text-white",
                  "text-2xl",
                  "tracking-wide"
                )}
              >{t`Portfolio`}</H2>
              <PortfolioCard
                account={account}
                signer={signer}
                currentDelegate={currentDelegate}
              />
            </div>
          </GradientCard>

          {/* Delegates */}
          <div className={tw("flex", "flex-col", "max-h-full", "xl:w-7/12")}>
            {/* Delegates List */}
            <div>
              <H2
                className={tw(
                  "mb-4",
                  "text-2xl",
                  "text-principalRoyalBlue",
                  "tracking-wide"
                )}
              >{t`Explore Featured Delegates`}</H2>
              <DelegatesList />
            </div>

            {/* Delegate Card */}
            <div
              className={tw(
                "w-full",
                "px-6",
                "py-7",
                "mt-auto",
                "rounded-xl",
                "bg-principalRoyalBlue"
              )}
            >
              <H2
                className={tw(
                  "mb-4",
                  "text-white",
                  "text-2xl",
                  "tracking-wide"
                )}
              >{t`Delegate`}</H2>
              <DelegateCard
                account={account}
                signer={signer}
                currentDelegate={currentDelegate}
                setCurrentDelegate={setCurrentDelegate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
