import { brandedBlueGradientBackgroundClassName } from "src/efi-ui/base/backgroundGradient";
import { assertNever } from "src/efi/base/assertNever";
import tw from "src/elf-tailwindcss-classnames";

export interface ButtonStyles {
  variant?: ButtonVariant;
  round?: boolean;
}

export enum ButtonVariant {
  GRADIENT = "gradient",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  WHITE = "white",
  OUTLINE_WHITE = "outlineWhite",
  OUTLINE_BLUE = "outlineBlue",
  MINIMAL = "minimal",
}

export function getButtonClass({
  variant = ButtonVariant.PRIMARY,
  round = false,
}: ButtonStyles): string {
  const defaultStyling = tw(
    "inline-flex",
    "items-center",
    "px-4",
    "py-3",
    "text-sm",
    "leading-4",
    "font-medium",
    "shadow",
    "hover:shadow-lg",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:ring-brandDarkBlue",
    round ? "rounded-full" : "rounded-md"
  );

  const primaryButtonVariant = tw(
    defaultStyling,
    "bg-brandDarkBlue",
    "text-white",
    "hover:bg-brandDarkBlue-dark"
  );

  if (!variant) {
    return defaultStyling;
  }

  switch (variant) {
    case ButtonVariant.PRIMARY:
      return primaryButtonVariant;

    case ButtonVariant.SECONDARY:
      return tw(
        defaultStyling,
        "bg-brandLightBlue",
        "text-brandDarkBlue-dark",
        "hover:bg-brandLightBlue-dark"
      );
    case ButtonVariant.GRADIENT:
      return tw(
        defaultStyling,
        brandedBlueGradientBackgroundClassName,
        "text-white",
        // dark background on hover for good contrast
        "hover:from-brandDarkBlue-dark",
        "hover:to-brandDarkBlue-dark"
      );

    case ButtonVariant.MINIMAL:
      return tw(
        defaultStyling,
        "text-brandDarkBlue-dark",
        "hover:bg-brandLightBlue",
        "hover:bg-opacity-20"
      );

    case ButtonVariant.OUTLINE_WHITE:
      return tw(
        defaultStyling,
        "border",
        "border-white",
        "text-white",
        "hover:bg-white",
        "hover:bg-opacity-20"
      );

    case ButtonVariant.OUTLINE_BLUE:
      return tw(
        defaultStyling,
        "border",
        "border-brandDarkBlue-dark",
        "text-brandDarkBlue-dark",
        "hover:bg-blue-100"
      );

    case ButtonVariant.WHITE:
      return tw(
        defaultStyling,
        "bg-white",
        "text-brandLightBlue-dark",
        "hover:bg-opacity-80"
      );

    default:
      assertNever(variant);
  }

  // This will never happen because of assertNever, but it satisfies the return type
  return defaultStyling;
}
