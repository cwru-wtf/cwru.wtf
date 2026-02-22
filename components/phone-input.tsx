"use client";

import { useState, useRef, useEffect } from "react";
import { PhoneInput as ReactPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, placeholder, className }: PhoneInputProps) {
  return (
    <ReactPhoneInput
      defaultCountry="us"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Phone number"}
      style={
        {
          "--react-international-phone-height": "40px",
          "--react-international-phone-border-radius": "6px",
          "--react-international-phone-border-color": "hsl(var(--border))",
          "--react-international-phone-background-color": "hsl(var(--background))",
          "--react-international-phone-text-color": "hsl(var(--foreground))",
          "--react-international-phone-selected-dropdown-item-background-color": "hsl(var(--accent))",
          "--react-international-phone-country-selector-background-color-hover": "hsl(var(--accent))",
          "--react-international-phone-flag-width": "20px",
          "--react-international-phone-flag-height": "14px",
          "--react-international-phone-font-size": "14px",
        } as React.CSSProperties
      }
      className={className}
      inputClassName="!w-full !rounded-r-md !border !border-border !bg-background !px-3 !py-2 !text-foreground focus:!border-foreground focus:!outline-none !text-sm"
      countrySelectorStyleProps={{
        buttonClassName: "!rounded-l-md !border !border-border !bg-background !px-2 hover:!bg-accent !h-full",
        dropdownStyleProps: {
          className: "!z-50 !border !border-border !rounded-md !shadow-lg !bg-background",
          listItemClassName: "!text-foreground hover:!bg-accent !text-sm",
        },
      }}
    />
  );
}
