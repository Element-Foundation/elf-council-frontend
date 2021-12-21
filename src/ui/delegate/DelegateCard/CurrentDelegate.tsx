import { ReactElement, useCallback, useState, useRef } from "react";
import { Delegate } from "src/elf-council-delegates/delegates";
import tw, {
  padding,
  margin,
  display,
  justifyContent,
  backgroundColor,
  borderRadius,
  flexDirection,
  textColor,
  fontWeight,
  alignItems,
  gap,
  height,
  width,
} from "src/elf-tailwindcss-classnames";
import { formatWalletAddress } from "src/formatWalletAddress";
import { t } from "ttag";
import { copyToClipboard } from "src/base/copyToClipboard";
import { Tooltip } from "@material-ui/core";
import { DuplicateIcon } from "@heroicons/react/outline";
import { AnnotationIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useVotingPowerForAccount } from "src/ui/voting/useVotingPowerForAccount";

interface CurrentDelegateProps {
  className?: string;
  delegate: Delegate;
}

const defaultToolTipState = {
  twitterHandle: false,
  address: false,
};

function CurrentDelegate(props: CurrentDelegateProps): ReactElement {
  const { className = "", delegate } = props;
  const [showToolTip, setshowToolTip] = useState(defaultToolTipState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slightly overengineered handleCopy?
  const handleCopy = useCallback(
    (type: "twitterHandle" | "address") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const nextState = { ...defaultToolTipState };
      nextState[type] = true;
      setshowToolTip(nextState);
      timeoutRef.current = setTimeout(() => {
        setshowToolTip(defaultToolTipState);
        timeoutRef.current = null;
      }, 1000);
      copyToClipboard(delegate[type]);
    },
    [delegate],
  );

  const handleCopyTwitterHandle = () => handleCopy("twitterHandle");
  const handleCopyAddress = () => handleCopy("address");

  return (
    <div
      className={classNames(
        className,
        tw(
          display("flex"),
          padding("py-4", "px-4"),
          justifyContent("justify-between"),
          backgroundColor("bg-hackerSky"),
          borderRadius("rounded-xl"),
        ),
      )}
    >
      <div className={tw(display("flex"), flexDirection("flex-col"))}>
        <div
          className={tw(
            textColor("text-principalRoyalBlue"),
            fontWeight("font-bold"),
            display("flex"),
            alignItems("items-center"),
            margin("mb-1"),
          )}
        >
          <span
            className={tw(
              display("inline-block"),
              height("h-5"),
              width("w-5"),
              borderRadius("rounded-xl"),
              backgroundColor("bg-principalRoyalBlue"),
              margin("mr-1.5"),
            )}
          ></span>
          <span>{delegate.name}</span>
        </div>
        <span className={tw(textColor("text-blueGrey"))}>
          <NumDelegatedVotes account={delegate.address} />
        </span>
        <span className={textColor("text-blueGrey")}>
          {formatWalletAddress(delegate.address)}
        </span>
      </div>

      <div
        className={tw(
          display("flex"),
          flexDirection("flex-col"),
          justifyContent("justify-center"),
          gap("gap-2"),
        )}
      >
        <Tooltip
          arrow
          placement="top"
          open={showToolTip.twitterHandle}
          title={t`Twitter handle copied`}
        >
          <button onClick={handleCopyTwitterHandle}>
            <AnnotationIcon
              className={tw(
                height("h-5"),
                textColor("text-principalRoyalBlue"),
              )}
            />
          </button>
        </Tooltip>
        <Tooltip
          arrow
          placement="top"
          open={showToolTip.address}
          title={t`Address copied`}
        >
          <button onClick={handleCopyAddress}>
            <DuplicateIcon
              className={tw(
                height("h-5"),
                textColor("text-principalRoyalBlue"),
              )}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

interface NumDelegatedVotesProps {
  account: string;
}
function NumDelegatedVotes(props: NumDelegatedVotesProps): ReactElement {
  const { account } = props;
  const votePower = useVotingPowerForAccount(account);
  return <span>{t`${votePower} votes`}</span>;
}

export default CurrentDelegate;
