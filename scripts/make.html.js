#!/usr/bin/env node
//: --------------------------------------------------------
//: scripts/make.html.js
//: --------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
import dedent from "dedent";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { execSync } from "node:child_process";
//: --------------------------------------------------------
import deflist from "@verikami/remark-deflist-revisited";

//: SETUP
//: -----------------------------------------
const sourceDir = path.resolve("src");
const outputDir = path.resolve("dist");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith(".md"));

//: HTML
//: --------------------------------------------------------
const makeHtml = ($ = {}) => {
  return dedent.withOptions({ alignValues: true })`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>veriKami °// Weronika Kami °// veriKami.github.io</title>
    <meta name="description" content="">
    <meta name="keywords" content="remark, remark-plugin, remark-deflist, markdown, markdown-plugin,
      definition-list, nested-lists, deflist, unist, astro, parser, wrapper, veriKami, Weronika Kami">
    <meta name="author" content="veriKami °// Weronika Kami">
    <meta name="pubdate" content="2025/09/30">
    <meta name="google-site-verification" content="qGe3Iz5C890mQVRy9dgEO5r5uALAa1kY_w-0GtLsAd8">
    <style>
    body { font-family: sans-serif; font-size: 1rem; padding: .2rem 3rem 1rem; background: #fff; }
    hr { margin: 0 0 1rem; height: 1px; border-width: 0; background-color: #ccc; }
    pre, dl { border: 1px solid #ccc; margin: 1rem 0; padding: 1rem; background: #fff; }
    pre { background: #f8f8f8; font-size: .85rem; }
    dt { font-weight: bold; margin-bottom: .5rem; }
    dd { margin: 0 1rem .5rem; color: gray; }
    dd ul, dd ol { margin-left: 0; color: darkblue; }
    ul, ol { margin-left: 2rem; color: red; }
    ul li ul, ol li ol { margin-left: 0; }
    table { border-collapse: collapse; background: #fff; }
    tr:nth-child(2) td:first-child { color: #aaa; font-weight: normal; }
    tr:nth-child(2) a { color: darkTurquoise; }
    td { padding: .3rem .5rem; border: 1px solid #ddd; }
    td:first-child { text-align: right; font-weight: bold; }
    a, a:visited { color: blue; text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1 a, h1 a:hover { text-decoration: none; }
    /* *********************************** */
    navigate li { margin-left: 2rem; padding: .5rem; color: red; }
    navigate li p,
    navigate li code { color: black; }
    navigate li code { padding: .3rem .5rem; background: #f5f5f5; border:1px solid #ddd; }
    /* *********************************** */
    </style>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3TQT133E82"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date()); gtag("config", "G-3TQT133E82");
    </script>
    </head>
    <body>
    ${$?.htmlHeader || ""}
    <!--
    <h1><a href="../index.html">🔘</a> ${$?.file} (${$?.mode})</h1>
    <hr>
    <table>
    <tr><td>revisited</td><td>${$?.menuRevisited}</td></tr>
    <tr><td>original module</td><td>${$?.menuOriginal}</td></tr>
    </table>
    -->
    ${$?.html}
    </body>
    </html>`;
};

const htmlHeader = `
  <h1>
    <a href="https://github.com/veriKami/remark-deflist-revisited" target="_blank">🔘</a>
    veriKami/remark-deflist-revisited
  </h1>
  <hr>
  <navigate>
  <ul>
  <li>
    <p>
      html generated from markdown @
      <a href="../generated/revisited.list.basic.html">generated/revisited.list.basic.html</a>
    </p>
    <p>source markdown test files @ tests/fixtures</p>
    <p>to regenerate run <code>ツ pnpm demo</code></p>
  </li>
  <li>
    <p>
      test inline script from https://esm.sh @
      <a href="../script.esm.sh.html">script.esm.sh.html</a>
    </p>
  </li>
  </ul>
  </navigate>
`;

//: MENU
//: --------------------------------------------------------
// const makeMenu = (mode = "revisited") => {
//   return files.reduce((acc, file) => {
//       const name = file.replace(".md", ".html");
//       acc.push([name, `<a href="${mode}.${name}">${name.replace(".html", "")}</a>`]);
//       return acc;
//     }, [])
//     .sort((a, b) => a[0].startsWith("_") - b[0].startsWith("_"))
//     .map(item => item[1])
//     .join("</td><td>");
// };

//: FILES
//: --------------------------------------------------------
const makeFiles = (mode) => {
  mode = mode ? mode + "." : "";

  files.forEach(file => {
    try {
      const input = fs.readFileSync(path.join(sourceDir, file), "utf8");
      const html = remark()
        .use(deflist)
        .use(remarkHtml)
        .processSync(input)
        .toString()
        // .replace("@verikami/remark-deflist-revisited", "<hr>");

      // const menuOriginal = makeMenu("original");
      // const menuRevisited = makeMenu("revisited");
      // const htmlPage = makeHtml(file, mode, menuOriginal, menuRevisited, html);
      const htmlPage = makeHtml({
        file,
        mode,
        html,
        // htmlHeader
      }).replace(/<!--[\s\S]*?-->/g, "");

      const outputFileName = `${mode}${file.replace(".md", ".html")}`.toLowerCase();
      const outputPath = path.join(outputDir, outputFileName);

      fs.writeFileSync(outputPath, htmlPage, "utf8");
      console.log(`Generated: ${outputFileName}`);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err.message);
    }
  });
};

//: FORMAT
//: --------------------------------------------------------
// const makeFormat = (target = "demo/doc/*.html") => {
//   try {
//     execSync(`pnpm dprint fmt ${target}`, { stdio: "inherit" });
//   } catch (err) {
//     console.error("Error processing file", err.message);
//   }
// }

//: --------------------------------------------------------
//: ACTION

makeFiles();
// makeFormat();
