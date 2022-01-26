import React, { ReactElement } from "react";
import Card, { CardVariant } from "src/ui/base/Card/Card";
import { t } from "ttag";
import { ElementIcon, IconSize } from "src/ui/base/ElementIcon";
import { useMerkleInfo } from "src/elf/merkle/useMerkleInfo";
import { commify } from "ethers/lib/utils";
import { useUnclaimedAirdrop } from "src/ui/airdrop/useUnclaimedAirdrop";

interface AirdropAmountCardProps {
  account: string | null | undefined;
}
export function AirdropAmountCard({
  account,
}: AirdropAmountCardProps): ReactElement {
  const { data: merkleInfo } = useMerkleInfo(account);

  const claimableBalance = useUnclaimedAirdrop(account, merkleInfo);
  const airdropAmountLabel = getAirdropAmountLabel(claimableBalance);

  return (
    <Card
      variant={CardVariant.HACKER_SKY}
      className="h-64 text-center shadow-[0_0_52px_rgba(143,216,231,.7)]"
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-6">
        <div className="mb-3 text-lg font-bold text-principalRoyalBlue text-opacity-60">{t`Airdrop amount`}</div>
        <div className="flex justify-center gap-2 text-5xl font-bold text-center text-principalRoyalBlue">
          <ElementIcon
            bgColorClassName="bg-paleLily"
            className="mr-2"
            size={IconSize.LARGE}
          />
          <span>{airdropAmountLabel}</span>
        </div>
      </div>
    </Card>
  );
}

function getAirdropAmountLabel(claimableBalance: string): string {
  if (claimableBalance) {
    return t`${commify(claimableBalance)} ELFI`;
  }

  return t`0 ELFI`;
}
