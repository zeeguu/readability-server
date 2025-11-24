import express from "express";
import { advanced_readability_cleanup, get_readability_article } from "./cleanup.js";
import { HTML2Text } from "./convert_htm_to_plaintext.js";
import packageJson from "./package.json" with { type: "json" };
import * as Sentry from "@sentry/node";

// Suppress noisy CSS parsing warnings from JSDOM
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Could not parse CSS stylesheet')) {
    return; // Suppress CSS parsing errors
  }
  originalConsoleError.apply(console, args);
};

const app = express();

// Enable JSON body parsing for POST requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sentry prefix: START
Sentry.init({
  dsn: "https://754bd6621282bfc97d64d3dc12fba591@o176103.ingest.us.sentry.io/4506971631517696",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.1, //  Capture 10% of the transactions
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// Sentry prefix: END

app.get("/cleanup", async (req, res) => {
  const { url } = req.query;
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] GET /cleanup - Starting: ${url}`);

  try {
    console.log(`[${new Date().toISOString()}] Calling advanced_readability_cleanup...`);
    const html = await advanced_readability_cleanup(url);
    console.log(`[${new Date().toISOString()}] ✓ Cleanup done (${html.length} chars)`);

    console.log(`[${new Date().toISOString()}] Getting readability article...`);
    const readabilityResult = await get_readability_article(url);
    console.log(`[${new Date().toISOString()}] ✓ Readability done`);

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✓ Complete in ${duration}ms`);

    // Send the cleaned up content as the response with metadata
    res.send({
      html: html,
      text: HTML2Text(html),
      title: readabilityResult.title,
      excerpt: readabilityResult.excerpt,
      byline: readabilityResult.byline,
      siteName: readabilityResult.siteName
    });
  } catch (e) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✗ Error after ${duration}ms: ${e.message}`);
    res.status(500).send(e.message);
  }
});

// POST endpoint that accepts HTML content directly
app.post("/cleanup", async (req, res) => {
  const { url, htmlContent } = req.body;
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /cleanup - Starting: ${url} (${htmlContent?.length || 0} bytes HTML)`);

  if (!htmlContent) {
    return res.status(400).send("htmlContent is required");
  }

  try {
    console.log(`[${new Date().toISOString()}] Calling advanced_readability_cleanup...`);
    const html = await advanced_readability_cleanup(url, htmlContent);
    console.log(`[${new Date().toISOString()}] ✓ Cleanup done (${html.length} chars)`);

    console.log(`[${new Date().toISOString()}] Getting readability article...`);
    const readabilityResult = await get_readability_article(url, htmlContent);
    console.log(`[${new Date().toISOString()}] ✓ Readability done`);

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✓ Complete in ${duration}ms`);

    // Send the cleaned up content as the response with metadata
    res.send({
      html: html,
      text: HTML2Text(html),
      title: readabilityResult.title,
      excerpt: readabilityResult.excerpt,
      byline: readabilityResult.byline,
      siteName: readabilityResult.siteName
    });
  } catch (e) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✗ Error after ${duration}ms: ${e.message}`);
    res.status(500).send(e.message);
  }
});

app.get("/ping", async (req, res) => {
  res.send("pong");
});

app.get("/debug-sentry", function mainHandler() {
  throw new Error("My first Sentry error!");
});

// ----> Sentry Appendix: START
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// ----> Sentry Appendix: END

// Start the server
const port = 3456;
app.listen(port, () => {
  console.log(
    `Server (${packageJson.version}) is running on http://localhost:${port}`,
  );
});
