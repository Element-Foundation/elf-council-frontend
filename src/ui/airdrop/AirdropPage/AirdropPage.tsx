import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useState } from "react";
import tw, {
  display,
  flexDirection,
  alignItems,
  margin,
  fontSize,
  textColor,
  flex,
} from "src/elf-tailwindcss-classnames";
import { DelegateStepCard } from "src/ui/airdrop/AirdropPage/DelegateStepCard";
import { StartClaimingCard } from "src/ui/airdrop/AirdropPage/StartClaimingCard";
import { AirdropPreview } from "src/ui/airdrop/AirdropPreview/AirdropPreview";
import Steps from "src/ui/base/Steps/Steps";
import { ElementLogo } from "src/ui/base/ElementLogo";
import { useSigner } from "src/ui/signer/useSigner";
import { t } from "ttag";
import { parseEther } from "ethers/lib/utils";
import { useMerkleInfo } from "src/elf/merkle/useMerkleInfo";
import { useUnclaimedAirdrop } from "src/ui/airdrop/useUnclaimedAirdrop";
import { MerkleProof } from "src/elf/merkle/MerkleProof";
import { StepItem, StepStatus } from "src/ui/base/Steps/StepItem";
import { StepDivider } from "src/ui/base/Steps/StepDivider";
import { DelegateInstructions } from "src/ui/airdrop/DelegateInstructions/DelegateInstructions";

enum AirdropStep {
  START_CLAIMING,
  AIRDROP_PREVIEW,
  ALREADY_CLAIMED,
  DELEGATE_INSTRUCTIONS,
  CHOOSE_DELEGATE,
  DELEGATE_PREVIEW,
  CLAIM_AND_DELEGATE_PREVIEW,
}

export default function AirdropPage(): ReactElement {
  const { account, active, library } = useWeb3React();
  const signer = useSigner(account, library);
  const merkleInfoQueryData = useMerkleInfo(account);

  const { data: merkleInfo } = merkleInfoQueryData;
  const claimableBalance = useUnclaimedAirdrop(account, merkleInfo);

  const [activeStep, setActiveStep] = useState<AirdropStep | undefined>();

  const connectWalletStatus = getConnectWalletStatus(account, activeStep);
  const delegateStatus = getDelegateStatus(activeStep);
  const claimAndDelegateStatus = getClaimAndDelegateStatus(
    activeStep,
    merkleInfo,
    claimableBalance,
  );

  return (
    <div className="flex flex-col space-y-8 w-full justify-center items-center">
      <div style={{ width: 600 }}>
        <Steps className="w-full">
          <StepItem
            stepLabel="1"
            status={connectWalletStatus}
          >{t`Connect wallet`}</StepItem>
          <StepDivider />
          <StepItem
            stepLabel="2"
            status={delegateStatus}
          >{t`Delegate`}</StepItem>
          <StepDivider />
          <StepItem
            stepLabel="3"
            status={claimAndDelegateStatus}
          >{t`Claim and delegate`}</StepItem>
        </Steps>
      </div>

      <div className="w-full md:w-3/5 h-full">
        {(() => {
          switch (activeStep) {
            case AirdropStep.START_CLAIMING:
            default:
              return (
                <StartClaimingCard
                  account={account}
                  walletConnectionActive={active}
                  onNextStep={() => {
                    // user has no airdrop if they have a merkle value but have already claimed
                    // the full amount
                    if (hasClaimedAirdrop(merkleInfo, claimableBalance)) {
                      setActiveStep(AirdropStep.ALREADY_CLAIMED);
                      return;
                    }
                    setActiveStep(AirdropStep.AIRDROP_PREVIEW);
                  }}
                />
              );

            case AirdropStep.AIRDROP_PREVIEW:
              return (
                <AirdropPreview
                  account={account}
                  onPrevStep={() => setActiveStep(AirdropStep.START_CLAIMING)}
                  onNextStep={() =>
                    setActiveStep(AirdropStep.DELEGATE_INSTRUCTIONS)
                  }
                />
              );

            case AirdropStep.DELEGATE_INSTRUCTIONS:
              return (
                <DelegateInstructions
                  account={account}
                  onPrevStep={() => setActiveStep(AirdropStep.AIRDROP_PREVIEW)}
                  onNextStep={() => setActiveStep(AirdropStep.CHOOSE_DELEGATE)}
                />
              );
            case AirdropStep.CHOOSE_DELEGATE:
              return <DelegateStepCard signer={signer} account={account} />;
          }
        })()}
      </div>
      <div
        className={tw(
          display("flex"),
          flex("flex-1"),
          flexDirection("flex-col"),
          alignItems("items-center"),
          margin("mt-auto"),
          textColor("text-principalRoyalBlue"),
        )}
      >
        <span className={fontSize("text-sm")}>{t`Powered by`}</span>
        <ElementLogo height={"40"} />
      </div>
    </div>
  );
}
function getConnectWalletStatus(
  account: string | null | undefined,
  activeStep: AirdropStep | undefined,
): StepStatus {
  let connectWalletStatus: StepStatus = StepStatus.UPCOMING;
  if (account) {
    connectWalletStatus = StepStatus.COMPLETE;
  } else if (activeStep === AirdropStep.START_CLAIMING) {
    connectWalletStatus = StepStatus.COMPLETE;
  }
  return connectWalletStatus;
}

function getDelegateStatus(activeStep: AirdropStep | undefined): StepStatus {
  if (
    activeStep === undefined ||
    [AirdropStep.START_CLAIMING, AirdropStep.AIRDROP_PREVIEW].includes(
      activeStep,
    )
  ) {
    return StepStatus.UPCOMING;
  }

  if (
    [
      AirdropStep.DELEGATE_INSTRUCTIONS,
      AirdropStep.DELEGATE_PREVIEW,
      AirdropStep.CHOOSE_DELEGATE,
    ].includes(activeStep)
  ) {
    return StepStatus.CURRENT;
  }

  return StepStatus.COMPLETE;
}

function getClaimAndDelegateStatus(
  activeStep: AirdropStep | undefined,
  merkleInfo: MerkleProof | undefined,
  claimableBalance: string,
): StepStatus {
  return activeStep === AirdropStep.CLAIM_AND_DELEGATE_PREVIEW &&
    hasClaimedAirdrop(merkleInfo, claimableBalance)
    ? StepStatus.COMPLETE
    : activeStep === AirdropStep.CLAIM_AND_DELEGATE_PREVIEW
    ? StepStatus.CURRENT
    : StepStatus.UPCOMING;
}

function hasClaimedAirdrop(
  merkleInfo: MerkleProof | undefined,
  claimableBalance: string,
) {
  return merkleInfo && parseEther(claimableBalance).isZero();
}
