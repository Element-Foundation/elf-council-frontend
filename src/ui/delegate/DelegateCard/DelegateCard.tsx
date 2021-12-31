import { ReactElement, useState, useCallback, useEffect } from "react";
import { Signer } from "ethers";
import { ButtonVariant } from "src/ui/base/Button/styles";
import { useChangeDelegation } from "src/ui/contracts/useChangeDelegation";
import { useDeposits } from "src/ui/contracts/useDeposits";
import { formatWalletAddress } from "src/formatWalletAddress";
import { isValidAddress } from "src/base/isValidAddress";
import { Delegate, delegates } from "src/elf-council-delegates/delegates";
import { t } from "ttag";
import CurrentDelegate from "src/ui/delegate/DelegateCard/CurrentDelegate";
import classNames from "classnames";
import DelegateAddressInput from "./DelegateAddressInput";
import DelegateButton from "./DelegateButton";
import { TWO_SECONDS_IN_MILLISECONDS } from "src/base/time";

interface DelegateCardProps {
  account: string | null | undefined;
  signer: Signer | undefined;
  vaultBalance: string;
  currentDelegate: Delegate | undefined;
  setCurrentDelegate: (delegate: Delegate) => void;
  delegateAddressInput: string;
  setDelegateAddressInput: (address: string) => void;
  selectedDelegate: string;
}

function DelegateCard(props: DelegateCardProps): ReactElement {
  const {
    account,
    signer,
    vaultBalance,
    currentDelegate,
    setCurrentDelegate,
    delegateAddressInput,
    setDelegateAddressInput,
    selectedDelegate,
  } = props;

  const [delegationSuccess, setDelegationSuccess] = useState(false);
  const [delegationFail, setDelegationFail] = useState(false);

  const { data: [delegateAddressOnChain] = [] } = useDeposits(account);

  const {
    mutate: changeDelegation,
    isSuccess,
    isError,
    isLoading,
  } = useChangeDelegation(signer);

  const onDelegateClick = useCallback(() => {
    if (delegateAddressInput && isValidAddress(delegateAddressInput)) {
      changeDelegation([delegateAddressInput]);
    }
  }, [changeDelegation, delegateAddressInput]);

  const walletLink = (
    <a
      className="font-semibold text-brandDarkBlue hover:underline"
      key="delegate-link"
      href={`https://etherscan.io/address/${delegateAddressOnChain}`}
    >
      {formatWalletAddress(delegateAddressOnChain || "")}
    </a>
  );

  const toggleDelegationSuccess = () => {
    setDelegationSuccess(true);
    setTimeout(() => {
      setDelegationSuccess(false);
    }, TWO_SECONDS_IN_MILLISECONDS);
  };

  const toggleDelegationFail = () => {
    setDelegationFail(true);
    setTimeout(() => {
      setDelegationFail(false);
    }, TWO_SECONDS_IN_MILLISECONDS);
  };

  // Updates the state after every click on 'Delegate' button
  useEffect(() => {
    if (delegateAddressOnChain && isSuccess) {
      const nextDelegate = delegates.find(
        (d) => d.address === delegateAddressOnChain,
      );

      // Success
      if (nextDelegate) {
        setDelegateAddressInput("");
        setCurrentDelegate(nextDelegate);
        toggleDelegationSuccess();
      }
      // Fail
    } else if (isError) {
      toggleDelegationFail();
    }
  }, [
    isSuccess,
    delegateAddressOnChain,
    setCurrentDelegate,
    setDelegateAddressInput,
    isError,
  ]);

  const invalidAddress = !isValidAddress(delegateAddressInput);

  return (
    <div className={classNames({ "opacity-50": !account })}>
      <div className="flex gap-7 flex-1 text-white text-xl">
        <div className="w-1/2">
          <span>{t`Current Delegation`}</span>
        </div>
        <div className="w-1/2 leading-5">
          <span>{t`Change Delegation`}</span>
          <span className="inline-block text-sm">{t`Tokens Eligible to Delegate: ${vaultBalance}`}</span>
        </div>
      </div>

      <div className="flex gap-7 mt-2">
        {/* Current Delegate Profile */}
        {currentDelegate ? (
          <CurrentDelegate className="w-1/2" delegate={currentDelegate} />
        ) : (
          <NoDelegate />
        )}

        {/* Delegate Input */}
        <div className="flex flex-col w-1/2">
          <DelegateAddressInput
            account={account}
            delegateAddressInput={delegateAddressInput}
            setDelegateAddressInput={setDelegateAddressInput}
            selectedDelegate={selectedDelegate}
            invalidAddress={invalidAddress}
            delegationSuccess={delegationSuccess}
            delegationFail={delegationFail}
          />

          <div className="text-center">
            <div className="flex justify-end items-end">
              <DelegateButton
                account={account}
                delegateAddressInput={delegateAddressInput}
                onDelegateClick={onDelegateClick}
                invalidAddress={invalidAddress}
                isLoading={isLoading}
                buttonVariant={ButtonVariant.GRADIENT}
                buttonClassName="w-28 justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoDelegate(): ReactElement {
  return (
    <div className="grid place-items-center w-1/2 bg-white rounded-md font-bold text-principalRoyalBlue">
      <span>{t`No current delegation`}</span>
    </div>
  );
}

export default DelegateCard;
