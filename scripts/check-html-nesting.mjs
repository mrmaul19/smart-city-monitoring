/**
 * Scans served HTML for the element nestings that browsers silently reparent.
 *
 * Those reparentings are what cause React hydration errors: the server string
 * says one thing, the DOM the browser built says another. A build and a
 * typecheck cannot see them, so this walks the actual response body.
 */

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/** parent tag -> descendant tags that are invalid inside it. */
const FORBIDDEN = {
  li: ["li"],
  a: ["a", "button"],
  button: ["a", "button"],
  p: [
    "p",
    "div",
    "ul",
    "ol",
    "li",
    "table",
    "section",
    "article",
    "h1",
    "h2",
    "h3",
  ],
  form: ["form"],
  table: ["table"],
  dt: ["dl", "dt", "dd"],
  label: ["label"],
  main: ["main"],
};

/**
 * Removes everything that is not markup before scanning.
 *
 * Without this, script bodies are read as tags: Next's streaming bootstrap
 * contains `<a?2300-a:$RT+300` and similar, which a tag regex happily reports
 * as an anchor and which then poisons the whole nesting stack.
 */
function stripNonMarkup(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<textarea\b[^>]*>[\s\S]*?<\/textarea>/gi, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "");
}

function scan(html) {
  const problems = [];
  const stack = [];
  // A real tag name is followed by whitespace, "/" or ">" — never by "?" or
  // an operator, which is what rules out leftover script fragments.
  const tagRe =
    /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(?=[\s/>])((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

  let match;
  while ((match = tagRe.exec(html)) !== null) {
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    const attrs = match[3] ?? "";
    const selfClosing = attrs.trimEnd().endsWith("/");

    if (closing) {
      const index = stack.map((frame) => frame.tag).lastIndexOf(tag);
      if (index !== -1) stack.length = index;
      continue;
    }

    if (VOID.has(tag) || selfClosing) continue;

    // Browsers imply a close for these before an identical sibling opens.
    if ((tag === "li" || tag === "p") && stack.at(-1)?.tag === tag) {
      stack.pop();
    }

    for (const frame of stack) {
      if (FORBIDDEN[frame.tag]?.includes(tag)) {
        problems.push({
          outer: frame.tag,
          inner: tag,
          snippet: html
            .slice(Math.max(0, match.index - 60), match.index + 120)
            .replace(/\s+/g, " "),
        });
      }
    }

    stack.push({ tag });
  }

  return problems;
}

const DEFAULT_PATHS = [
  "/",
  "/cameras",
  "/cameras/2701",
  "/weather",
  "/air-quality",
  "/map",
  "/settings",
  "/about",
];

const base = process.argv[2] ?? "http://localhost:3100";
const paths = process.argv.length > 3 ? process.argv.slice(3) : DEFAULT_PATHS;
let total = 0;

for (const path of paths) {
  const response = await fetch(base + path);
  const html = stripNonMarkup(await response.text());
  const problems = scan(html);

  const grouped = new Map();
  for (const problem of problems) {
    const key = `${problem.outer}>${problem.inner}`;
    if (!grouped.has(key))
      grouped.set(key, { count: 0, snippet: problem.snippet });
    grouped.get(key).count += 1;
  }

  if (grouped.size === 0) {
    console.log(`  OK     ${path}`);
  } else {
    total += grouped.size;
    console.log(`  FAIL   ${path}`);
    for (const [pair, info] of grouped) {
      const [outer, inner] = pair.split(">");
      console.log(`           <${outer}> contains <${inner}>  x${info.count}`);
      console.log(`           …${info.snippet}…`);
    }
  }
}

console.log(
  total === 0
    ? "\nNo invalid HTML nesting found."
    : `\n${total} jenis masalah nesting ditemukan.`,
);
process.exit(total === 0 ? 0 : 1);
