import express from "express";
import { createDecoder } from "@cardog/corgi";

const app = express();
app.use(express.json());

let decoder: Awaited<ReturnType<typeof createDecoder>> | null = null;

async function init() {
  decoder = await createDecoder();
  console.log("Corgi decoder initialized");
}

app.post("/decode", async (req, res) => {
  try {
    const { vin } = req.body;
    if (!vin || typeof vin !== "string") {
      return res.status(400).json({ error: "VIN required" });
    }
    if (!decoder) return res.status(500).json({ error: "Decoder not ready" });
    const result = await decoder.decode(vin);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3001;
init().then(() => {
  app.listen(port, () => console.log(`VIN decoder listening on ${port}`));
});
