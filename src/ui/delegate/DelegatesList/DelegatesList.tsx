import { Fragment, ReactElement } from "react";
import { t } from "ttag";
import { Popover, Transition } from "@headlessui/react";
import H2 from "src/ui/base/H2";
import DelegateProfile from "src/ui/delegate/DelegatesList/DelegateProfile";
import DetailedDelegateProfile from "src/ui/delegate/DelegatesList/DetailedDelegateProfile";
import { delegates } from "src/elf-council-delegates/delegates";

interface DelegatesListProps {
  selectedDelegate: string;
  setDelegateAddressInput: (address: string) => void;
}

function DelegatesList({
  selectedDelegate,
  setDelegateAddressInput,
}: DelegatesListProps): ReactElement {
  return (
    <div className="relative mb-8">
      <H2 className="mb-4 text-2xl text-principalRoyalBlue tracking-wide">{t`Explore Featured Delegates`}</H2>

      {/* List of delegates */}
      <ul
        className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 overflow-y-scroll"
        // 428px exactly matches 5 rows of the list
        style={{ maxHeight: "428px" }}
      >
        {delegates.map((delegate, idx) => {
          const selected = delegate.address === selectedDelegate;

          return (
            // TODO: Remove -${idx} for production since addresses are always unique
            <li key={`${delegate.address}-${idx}}`}>
              <Popover>
                <Popover.Button className="w-full">
                  <DelegateProfile selected={selected} delegate={delegate} />
                </Popover.Button>

                <Transition>
                  {/* Greyed out background overlay */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    {/* z-30 in order to overlap sidebar z-index */}
                    <Popover.Overlay className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity" />
                  </Transition.Child>

                  {/* Detailed delegate profile */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Popover.Panel
                      className="absolute z-50 box-content rounded-xl top-0 
          right-0 h-full w-full bg-hackerSky"
                    >
                      {({ close }) => (
                        <DetailedDelegateProfile
                          delegate={delegates[idx]}
                          onClose={close}
                          setDelegateAddressInput={setDelegateAddressInput}
                        />
                      )}
                    </Popover.Panel>
                  </Transition.Child>
                </Transition>
              </Popover>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DelegatesList;
