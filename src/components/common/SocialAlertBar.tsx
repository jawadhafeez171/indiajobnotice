import React from "react";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { TricolorCapsule } from "./BrandLogo";
import { StateInfo } from "@/config/states";

interface Props {
  state?: StateInfo | null;
}

export function SocialAlertBar({ state }: Props) {
  const telegramLink = state?.telegramGroup || "https://t.me/IndiaJobNotice";
  const stateLabel = state ? `${state.name} Gazettes` : "All-India Gazettes";

  return (
    <div className="bg-white rounded-lg border border-[#EAE2D2] border-l-4 border-l-[#1E3799] p-4 sm:p-5 my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TricolorCapsule className="w-12 h-1" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E3799] font-bold">
            Live Official Alerts
          </span>
        </div>
        <h4 className="font-serif text-base font-bold text-[#1A1918]">
          Instant Gazette Circulars for {stateLabel}
        </h4>
        <p className="text-xs text-[#524E48] mt-0.5 max-w-xl">
          Get notified the moment official circulars, exam patterns, admit cards, or answer keys are gazetted. Scam-free and ad-free.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Telegram Official Blue Button */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#24A1DE] hover:bg-[#1D8FCA] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <TelegramLogo className="w-4 h-4" />
          <span>Telegram Alerts</span>
        </a>

        {/* WhatsApp Official Green Button */}
        <a
          href={state?.whatsappGroup || "https://chat.whatsapp.com/demo"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <WhatsAppLogo className="w-4 h-4" />
          <span>WhatsApp Channel</span>
        </a>
      </div>
    </div>
  );
}
