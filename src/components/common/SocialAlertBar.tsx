import React from "react";
import { TelegramLogo, WhatsAppLogo, InstagramLogo, INSTAGRAM_URL } from "./SocialIcons";
import { StateInfo } from "@/config/states";

interface Props {
  state?: StateInfo | null;
}

export function SocialAlertBar({ state }: Props) {
  const telegramLink = "https://t.me/india_jobnotice";
  const stateLabel = state ? state.name : "all of India";

  return (
    <div className="on-dark bg-navy-solid rounded-lg border border-navy p-4 sm:p-5 my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div>
        <h2 className="font-serif text-base font-bold text-white">
          New job alerts for {stateLabel}
        </h2>
        <p className="text-xs text-on-navy mt-0.5 max-w-xl">
          Get new notifications, admit cards, answer keys and results as soon as they are published. Free.
        </p>
      </div>

      {/* phones: three equal full-width rows; wider screens: side by side */}
      <div className="grid grid-cols-1 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 shrink-0">
        {/* each in its own brand colour (the deeper shades, so white text stays readable) */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 min-h-[44px] rounded-lg bg-[#1A7DB0] hover:bg-[#156C99] text-white text-[13px] font-semibold transition-colors"
        >
          <TelegramLogo className="w-4 h-4" />
          <span>Join on Telegram</span>
        </a>

        <a
          href="https://whatsapp.com/channel/0029Vb9GFwsGzzKXYJyKer1C"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 min-h-[44px] rounded-lg bg-[#13853F] hover:bg-[#0E7A3E] text-white text-[13px] font-semibold transition-colors"
        >
          <WhatsAppLogo className="w-4 h-4" />
          <span>Join on WhatsApp</span>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 min-h-[44px] rounded-lg bg-instagram text-[13px] font-semibold transition-[filter]"
        >
          <InstagramLogo className="w-4 h-4" />
          <span>Follow on Instagram</span>
        </a>
      </div>
    </div>
  );
}
