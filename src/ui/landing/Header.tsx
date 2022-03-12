import { PropsWithChildren, ReactElement } from "react";
import ElementUrls from "src/elf/urls";
import LinkButton from "src/ui/base/Button/LinkButton";
import { ButtonVariant } from "src/ui/base/Button/styles";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { t } from "ttag";
import { Popover } from "@headlessui/react";
import classNames from "classnames";
import usePopperWithRefs from "src/ui/base/usePopperWithRefs";

export default function Header(): ReactElement {
  const {
    setReferenceElement,
    setPopperElement,
    styles: { popper: menuPopperStyles },
    attributes: { popper: menuPopperProps },
  } = usePopperWithRefs({
    placement: "bottom-end",
  });
  return (
    <header className="relative z-20 mb-2 flex items-center justify-end py-16">
      <Popover className="flex items-center gap-5">
        {({ open }) => (
          <>
            {/*
                  Set to invisible and aria-hidden true rather than display
                  none or unmounting to prevent the header height from
                  collapsing.
                */}
            <LinkButton
              variant={ButtonVariant.REWARD}
              link="/"
              className={open ? "invisible" : undefined}
              aria-hidden={open}
            >{t`Open Governance App`}</LinkButton>
            <div>
              <div ref={setReferenceElement} />
              <Popover.Button
                title={t`open menu`}
                className={classNames(
                  "rounded-lg p-2 hover:bg-white/10",
                  open && "invisible",
                )}
                aria-hidden={open}
              >
                <MenuIcon className="h-8 w-8" />
              </Popover.Button>
            </div>
            <Popover.Panel
              ref={setPopperElement}
              as="nav"
              className="-mt-2 -mr-2 flex flex-col rounded-2xl bg-principalRoyalBlue px-9 pt-2 pb-9 shadow-[0_4px_4px_#fff]"
              style={menuPopperStyles}
              {...menuPopperProps}
            >
              <Popover.Button
                title="close menu"
                className="ml-auto -mr-7 rounded-lg p-3 hover:bg-white/10"
              >
                <XIcon className="h-6 w-6" />
              </Popover.Button>
              <ul className="w-0 min-w-full">
                <MenuLink
                  href={ElementUrls.CORE_APP}
                >{t`Main Protocol`}</MenuLink>
                <MenuLink href={ElementUrls.DOCS}>{t`Council Docs`}</MenuLink>
                <MenuLink
                  href={`${ElementUrls.GITHUB}/council`}
                >{t`Council Smart Contracts`}</MenuLink>
                <MenuLink
                  href={`${ElementUrls.GITHUB}/elf-council-frontend`}
                >{t`Council Frontend`}</MenuLink>
                <MenuLink
                  href={`${ElementUrls.GITHUB}/elf-council-frontend`}
                >{t`Council Brand Design`}</MenuLink>
              </ul>
              <LinkButton
                variant={ButtonVariant.REWARD}
                link="/"
                className="my-3"
                aria-hidden={open}
              >{t`Open Governance App`}</LinkButton>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  );
}

function MenuLink({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <li>
      <a
        href={href}
        className="block py-2 text-xl leading-6 hover:text-principalBlue focus:text-principalBlue"
      >
        {children}
      </a>
    </li>
  );
}
