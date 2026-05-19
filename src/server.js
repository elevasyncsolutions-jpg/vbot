import express from "express";

import cookieParser from "cookie-parser";

import fetch from "node-fetch";

import { Connection, Keypair, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

import bs58 from "bs58";

import path from "path";

import { fileURLToPath } from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));



const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", "confirmed");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PAYOUT_WALLET = process.env.PAYOUT_WALLET;

const APP_PASSWORD = process.env.APP_PASSWORD || "FLOWWW111";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";



let wallet = null;

try {

  if (process.env.SERVER_WALLET_SECRET_KEY_BASE58) {

    wallet = Keypair.fromSecretKey(bs58.decode(process.env.SERVER_WALLET_SECRET_KEY_BASE58));

    console.log("🟢 ENGINE ARMED: Hot Wallet Loaded");

  }

} catch (e) { console.error("🔴 WALLET LOAD FAILURE"); }



const state = { running: false, logs: [] };



function logEngine(msg, type = "INFO") {

  console.log(`[${type}] ${msg}`);

  state.logs.unshift({ time: new Date().toISOString(), type, msg });

  state.logs = state.logs.slice(0, 200);

}



// Security Middleware

app.post("/api/login", (req, res) => {

  if (req.body?.password === APP_PASSWORD) {

    res.cookie("apex_auth", SESSION_SECRET, { httpOnly: false, sameSite: "lax", maxAge: 7 * 86400 * 1000 });

    res.json({ ok: true });

  } else {

    res.status(401).json({ ok: false, error: "bad_password" });

  }

});



app.use("/api", (req, res, next) => {

  if (req.path === "/login") return next();

  if (req.cookies?.apex_auth === SESSION_SECRET) return next();

  return res.status(401).json({ error: "unauthorized" });

});



// API Routes

app.get("/api/status", (req, res) => res.json({ state }));



app.post("/api/start", (req, res) => {

  if (!state.running) {

    state.running = true;

    runEngineCycle();

    logEngine("Apex Engine V18 Started.", "SYSTEM");

  }

  res.json({ ok: true });

});



app.post("/api/stop", (req, res) => {

  state.running = false;

  logEngine("Apex Engine Halted.", "SYSTEM");

  res.json({ ok: true });

});



// Trading Logic

async function validateWithGroq(tokenData) {

  if (!GROQ_API_KEY) return true;

  try {

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {

      method: "POST",

      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },

      body: JSON.stringify({

        model: "llama3-70b-8192",

        messages: [{ role: "user", content: `Token: ${tokenData.baseToken.symbol}. Is this SAFE? Answer strictly SAFE or RUG.` }],

        temperature: 0.1

      })

    });

    const data = await res.json();

    return data.choices[0].message.content.includes("SAFE");

  } catch (e) { return false; }

}



async function runEngineCycle() {

  if (!state.running) return;

  try {

    const res = await fetch("https://api.dexscreener.com/latest/dex/search?q=solana");

    const data = await res.json();

    const candidates = (data.pairs || []).filter(p => p.chainId === "solana" && p.volume?.m5 > 50);

    

    logEngine(`Scan active: Found ${candidates.length} tokens.`, "SCAN");



    for (const p of candidates.slice(0, 5)) {

      const vol5 = Number(p.volume?.m5 || 1);

      const vol1 = Number(p.volume?.m1 || 0);

      if (vol1 > (vol5 * 0.05)) {

        const isSafe = await validateWithGroq(p);

        if (isSafe) logEngine(`🚀 SIGNAL: ${p.baseToken.symbol}`, "TRADE");

      }

    }

  } catch (e) { logEngine("Cycle Error: " + e.message, "ERROR"); }

  if (state.running) setTimeout(runEngineCycle, 15000);

}



app.listen(process.env.PORT || 8080, () => console.log("🚀 V18 Apex Engine Running"));,
