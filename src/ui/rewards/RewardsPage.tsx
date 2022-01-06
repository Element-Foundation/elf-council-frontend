import React, { ReactElement, useCallback, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import Image from "next/image";
import { isValidAddress } from "src/base/isValidAddress";
import { addressesJson } from "src/elf-council-addresses";
import tw, {
  display,
  height,
  flexShrink,
  alignItems,
  justifyContent,
  textColor,
  width,
  flexDirection,
  textAlign,
  padding,
  fontSize,
  gap,
  position,
  margin,
  gridTemplateColumns,
  space,
  flexWrap,
} from "src/elf-tailwindcss-classnames";
import { elementTokenContract } from "src/elf/contracts";
import { useMerkleInfo } from "src/elf/merkle/useMerkleInfo";
import { useTokenBalanceOf } from "src/elf/token/useTokenBalanceOf";
import Button from "src/ui/base/Button/Button";
import { ButtonVariant } from "src/ui/base/Button/styles";
import GradientCard from "src/ui/base/Card/GradientCard";
import TokenInput from "src/ui/base/Input/TokenInput";
import TextInput from "src/ui/base/Input/TextInput";
import { useNumericInputValue } from "src/ui/base/Input/useNumericInputValue";
import { Label } from "src/ui/base/Label/Label";
import { useDeposited } from "src/ui/base/lockingVault/useDeposited";
import { useSetTokenAllowance } from "src/ui/base/token/useSetTokenAllowance";
import { useElementTokenBalanceOf } from "src/ui/contracts/useElementTokenBalance";
import { useDelegate } from "src/ui/delegate/useDelegate";
import { useClaimAndDepositRewards } from "src/ui/rewards/useClaimAndDepositRewards";
import { useClaimedRewards } from "src/ui/rewards/useClaimed";
import { useDepositIntoLockingVault } from "src/ui/rewards/useDepositIntoLockingVault";
import { useSigner } from "src/ui/signer/useSigner";
import { t } from "ttag";

import { useClaimRewards } from "./useClaimRewards";

interface RewardsPageProps {}

export function RewardsPage(unusedProps: RewardsPageProps): ReactElement {
  const { account, library } = useWeb3React();
  const signer = useSigner(account, library);
  const { data: balanceOf } = useElementTokenBalanceOf(account);
  const formattedBalance = balanceOf ? formatEther(balanceOf) : "-";
  const { elementToken, lockingVault } = addressesJson.addresses;

  const { claimed, balance, merkleInfo, deposited } = useRewardsInfo(account);
  const totalGrant = merkleInfo?.leaf?.value || 0;
  const unclaimed = Math.max(Number(totalGrant) - Number(claimed), 0);
  const totalBalance = Number(balance) + Number(unclaimed) + Number(deposited);

  const { mutate: claim } = useClaimRewards(signer);
  const onClaim = useCallback(() => {
    if (!account || !merkleInfo) {
      return;
    }

    const { value } = merkleInfo?.leaf;
    const { proof } = merkleInfo;
    const valueBN = parseEther(value);

    claim([valueBN, valueBN, proof, account]);
  }, [account, claim, merkleInfo]);

  const { mutate: claimAndDeposit } = useClaimAndDepositRewards(signer);
  const onClaimAndDeposit = useCallback(() => {
    if (!account || !merkleInfo) {
      return;
    }

    const { value } = merkleInfo?.leaf;
    const { proof } = merkleInfo;
    const valueBN = parseEther(value);

    claimAndDeposit([
      ethers.constants.WeiPerEther,
      // we are just depositing so we assume the delegate is already set and this address will be ignored.
      ethers.constants.AddressZero,
      valueBN,
      proof,
      account,
    ]);
  }, [account, claimAndDeposit, merkleInfo]);

  const { value: depositAmount, setNumericValue: setDepositAmount } =
    useNumericInputValue();

  const onSetMax = useCallback(() => {
    setDepositAmount(balance);
  }, [balance, setDepositAmount]);

  const { mutate: deposit } = useDepositIntoLockingVault(signer, account);
  const onDeposit = useCallback(() => {
    if (!account) {
      return;
    }

    deposit([account, parseEther(depositAmount), account]);
  }, [account, deposit, depositAmount]);

  const { mutate: allow } = useSetTokenAllowance(signer, elementToken);
  const onSetAllowance = useCallback(() => {
    if (!account) {
      return;
    }

    allow([lockingVault, ethers.constants.MaxUint256]);
  }, [account, allow, lockingVault]);

  const [delegateAddress, setDelegateAddress] = useState<string | undefined>();
  const onUpdateDelegateAddress = useCallback(() => {
    if (delegateAddress && isValidAddress(delegateAddress)) {
      setDelegateAddress(delegateAddress);
    }
  }, [delegateAddress]);

  return (
    <div
      className={tw(
        display("flex"),
        height("h-full"),
        flexShrink("shrink-0"),
        alignItems("items-center"),
        justifyContent("justify-center"),
      )}
    >
      <GradientCard
        className={tw(
          textColor("text-white"),
          width("w-96"),
          flexDirection("flex-col"),
          display("flex"),
        )}
      >
        <div
          className={tw(
            flexDirection("flex-col"),
            width("w-full"),
            display("flex"),
            alignItems("items-center"),
            textAlign("text-center"),
          )}
        >
          <div
            className={tw(padding("p-4"), fontSize("text-xl"))}
          >{t`Your ELF Balance`}</div>
          <div className="w-full border-t border-gray-300" />
        </div>

        <div
          className={tw(
            flexDirection("flex-col"),
            width("w-full"),
            display("flex"),
            alignItems("items-center"),
            textAlign("text-center"),
            padding("pt-4", "px-8", "pb-8"),
            gap("gap-4"),
          )}
        >
          <div
            className={tw(position("relative"), height("h-20"), width("w-20"))}
          >
            <Image
              layout="fill"
              src="/assets/ElementLogo--light.svg"
              alt={t`Element logo`}
            />
          </div>
          <div className={tw(display("flex"), flexDirection("flex-col"))}>
            <span className={tw(fontSize("text-3xl"), margin("mb-4"))}>
              {totalBalance.toFixed(2)}
            </span>
            <Label
              className={tw(textAlign("text-center"), padding("px-12"))}
            >{t`You have ELF ready to claim from the Element LP Program.`}</Label>
          </div>
          <Label>{t`People who provide liquidity to eligible investment pools or trade on eligible token pairs receive weekly $ELF distributions as incentives. $ELF token holders help foster the Element Protocol can shape its future by voting and engaging with our governance.`}</Label>
          <div
            className={tw(
              display("grid"),
              gridTemplateColumns("grid-cols-2"),
              width("w-full"),
              padding("px-4"),
            )}
          >
            <Label
              className={textAlign("text-left")}
            >{t`Wallet Balance:`}</Label>
            <Label className={textAlign("text-right")}>
              {formattedBalance}
            </Label>
          </div>
          <div
            className={tw(
              display("grid"),
              gridTemplateColumns("grid-cols-2"),
              width("w-full"),
              padding("px-4"),
            )}
          >
            <Label className={textAlign("text-left")}>{t`Unclaimed:`}</Label>
            <Label className={textAlign("text-right")}>
              {unclaimed.toFixed(2)}
            </Label>
          </div>
          <div
            className={tw(
              display("grid"),
              gridTemplateColumns("grid-cols-2"),
              width("w-full"),
              padding("px-4"),
            )}
          >
            <Label className={textAlign("text-left")}>{t`Deposited:`}</Label>
            <Label className={textAlign("text-right")}>
              {Number(deposited).toFixed(2)}
            </Label>
          </div>
          <Label small>{t`Go to Dashboard Overview`}</Label>
          <div className={tw(display("flex"), flexDirection("flex-col"))}>
            <div className={tw(display("flex"), gap("gap-4"))}>
              <Button
                onClick={onClaim}
                disabled={!account || !merkleInfo}
                round
                variant={ButtonVariant.OUTLINE_WHITE}
              >{t`Withdraw`}</Button>
              <TextInput
                value={delegateAddress}
                onChange={onUpdateDelegateAddress}
                screenReaderLabel={t`delegate address`}
                id={"delete-address"}
                name={"Delegate Address"}
              />
              <Button
                onClick={onClaimAndDeposit}
                round
                variant={ButtonVariant.WHITE}
              >{t`Claim & Deposit`}</Button>
            </div>
            <div
              className={tw(
                display("flex"),
                gap("gap-4"),
                space("space-y-4"),
                flexWrap("flex-wrap"),
              )}
            >
              <Button
                onClick={onSetAllowance}
                disabled={!account || !merkleInfo}
                round
                variant={ButtonVariant.OUTLINE_WHITE}
              >{t`Allow`}</Button>
              <Button
                onClick={onSetMax}
                disabled={!account || !merkleInfo}
                round
                variant={ButtonVariant.OUTLINE_WHITE}
              >{t`Max`}</Button>
              <TokenInput
                value={depositAmount}
                onChange={setDepositAmount}
                screenReaderLabel={t`deposit amount`}
                id={"deposit-amount"}
                name={"Deposit Amount"}
              />
              <Button
                onClick={onDeposit}
                disabled={!account}
                round
                variant={ButtonVariant.OUTLINE_WHITE}
              >{t`Deposit`}</Button>
            </div>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}

function useRewardsInfo(address: string | undefined | null) {
  const claimed = useClaimedRewards(address);
  const deposited = useDeposited(address);
  const delegate = useDelegate(address);

  const { data: balanceBN } = useTokenBalanceOf(elementTokenContract, address);
  const { data: merkleInfo } = useMerkleInfo(address);

  return {
    delegate,
    deposited,
    claimed,
    balance: formatEther(balanceBN || 0),
    merkleInfo,
  };
}
