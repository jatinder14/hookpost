import React from 'react';
import { PUBLISHABLE_CHANNEL_COUNT } from './channels/channel-count';

export default function AeoAnswerCapsule() {
  return (
    <section
      id="aeo-overview"
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 text-left"
      aria-label="Hookpost Overview and Specifications"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#181522] via-[#100e17] to-[#0a0910] border border-white/10 p-6 sm:p-10 shadow-2xl">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-[#FF4CE2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-[#8217C3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider font-jakarta">
            <span>⚡</span>
            <span>Direct Answer & Technical Specifications</span>
          </div>

          {/* High-Citability Answer Block */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-jakarta tracking-tight">
              What is Hookpost?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-gray-200 max-w-4xl font-normal">
              <strong className="text-white font-semibold">
                Hookpost is an open-source, multi-agent AI social media management and scheduling platform developed by JR Consulting Co. and founded by Mohan Bhanushali.
              </strong>{' '}
              It enables creators, marketing agencies, and software developers to plan, automate, and cross-publish content across {PUBLISHABLE_CHANNEL_COUNT} social networks—including Instagram, YouTube, LinkedIn, X, Facebook, and Threads—via a visual calendar, REST API, CLI, and native Model Context Protocol (MCP) server.
            </p>
          </div>

          {/* 4-Box Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-[18px] bg-white/[0.03] border border-white/10 hover:border-[#FF4CE2]/40 transition-all">
              <div className="text-[#FF4CE2] font-semibold text-xs tracking-wider uppercase mb-1">
                Architecture & License
              </div>
              <div className="text-white font-bold text-sm mb-1 font-jakarta">
                100% AGPLv3 Open-Source
              </div>
              <p className="text-xs text-gray-400 leading-normal">
                NestJS, Next.js 16, Temporal.io workflow engine. Free 1-click Docker Compose self-hosting.
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-white/[0.03] border border-white/10 hover:border-[#FF4CE2]/40 transition-all">
              <div className="text-[#FF4CE2] font-semibold text-xs tracking-wider uppercase mb-1">
                AI & Agentic Protocols
              </div>
              <div className="text-white font-bold text-sm mb-1 font-jakarta">
                Native MCP Server & CLI
              </div>
              <p className="text-xs text-gray-400 leading-normal">
                Direct integration with Claude Desktop, Claude Code, Cursor, Windsurf, OpenClaw, and n8n nodes.
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-white/[0.03] border border-white/10 hover:border-[#FF4CE2]/40 transition-all">
              <div className="text-[#FF4CE2] font-semibold text-xs tracking-wider uppercase mb-1">
                Network Coverage
              </div>
              <div className="text-white font-bold text-sm mb-1 font-jakarta">
                18 Supported Channels
              </div>
              <p className="text-xs text-gray-400 leading-normal">
                Instagram Reels/Carousels, YouTube Shorts, LinkedIn, X, Facebook, Threads, Bluesky, Pinterest.
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-white/[0.03] border border-white/10 hover:border-[#FF4CE2]/40 transition-all">
              <div className="text-[#FF4CE2] font-semibold text-xs tracking-wider uppercase mb-1">
                Pricing & Payments
              </div>
              <div className="text-white font-bold text-sm mb-1 font-jakarta">
                Free Tier (₹0) & ₹699
              </div>
              <p className="text-xs text-gray-400 leading-normal">
                Transparent flat pricing. Razorpay (UPI Autopay, NetBanking, Domestic & International Cards).
              </p>
            </div>
          </div>

          {/*
            The competitor comparison table lived here. Removed with the rest
            of the Postiz references: the homepage is about this product, and
            /alternatives/<competitor> already carries the comparisons where
            someone searching for one will actually land.

            It was also carrying wrong numbers - it claimed Postiz supports
            ~10 networks and Buffer 8, when the real figures are 36 and 11.
          */}
        </div>
      </div>
    </section>
  );
}
