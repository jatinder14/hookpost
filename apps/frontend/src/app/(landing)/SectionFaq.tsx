import React from "react";

export interface FaqItem {
  name: string;
  acceptedAnswer: {
    text: string;
  };
}

export function SectionFaq({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-6 max-w-[850px] mx-auto w-full my-12 text-left">
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="bg-[#111] border border-white/10 rounded-xl p-5 group open:border-[#FF4CE2]/50 transition-colors"
            itemScope
            itemType="https://schema.org/Question"
          >
            <summary
              className="font-bold text-white text-base cursor-pointer list-none flex justify-between items-center select-none"
              itemProp="name"
            >
              <span>{item.name}</span>
              <span className="text-white/60 group-open:rotate-180 transition-transform text-xs ml-4">
                ▼
              </span>
            </summary>
            <div
              className="mt-3 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3"
              itemScope
              itemType="https://schema.org/Answer"
              itemProp="acceptedAnswer"
            >
              <p itemProp="text">{item.acceptedAnswer.text}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
