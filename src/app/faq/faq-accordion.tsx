"use client";

import { useState } from "react";

type FAQItem = { question: string; answer: string; id?: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-[#dce5f0]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div id={item.id} key={item.question} className="scroll-mt-28">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={"faq-answer-" + index}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-start gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1346a0]"
              >
                <span className="flex-1 text-base font-semibold leading-7 text-[#1b2a3e] sm:text-lg">{item.question}</span>
                <span className={"relative mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#bfcddd] text-[#1346a0] " + (isOpen ? "bg-[#1346a0] text-white" : "")} aria-hidden="true">
                  <span className="h-px w-3 bg-current" />
                  {!isOpen ? <span className="absolute h-3 w-px bg-current" /> : null}
                </span>
              </button>
            </h3>
            {isOpen ? <div id={"faq-answer-" + index} role="region" className="-mt-2 max-w-[720px] pb-6 pr-10 text-sm leading-7 text-[#5b6a7e] sm:text-base">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
