import React from "react";
import { TelegramLogo, WhatsAppLogo } from "./SocialIcons";
import { TricolorCapsule } from "./BrandLogo";
import { StateInfo } from "@/config/states";

interface Props {
  state?: StateInfo | null;
}

export function SocialAlertBar({ state }: Props) {
  const telegramLink = "https://t.me/Indiajobnotice1";
  const stateLabel = state ? state.name : "all of India";

  return (
    <div className="bg-[#1E3799] rounded-lg border border-[#1E3799] p-4 sm:p-5 my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TricolorCapsule className="w-12 h-1" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFD9B8] font-bold">
            Live Official Alerts
          </span>
        </div>
        <h4 className="font-serif text-base font-bold text-white">
          New job alerts for {stateLabel}
        </h4>
        <p className="text-xs text-[#DCE4F5] mt-0.5 max-w-xl">
          Get new notifications, admit cards, answer keys and results as soon as they are published. Free.
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
          href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C"
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
