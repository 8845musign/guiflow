import { default as uiflow } from "@kexi/uiflow";
import * as flumine from "flumine";
import * as through2 from "through2";
import { Buffer } from "buffer";

interface UiflowApi {
  update: (
    inputFileName: string,
    code: string,
    format: "dot" | "meta" | "json" | "png" | "svg",
  ) => Promise<Buffer>;
  compile: (code: string) => Promise<{ svg: string; meta: string }>;
  base64png: (code: string) => Promise<string>;
}

const api: UiflowApi = {} as UiflowApi;

api.update = function (
  inputFileName: string,
  code: string,
  format: "dot" | "meta" | "json" | "png" | "svg",
): Promise<Buffer> {
  const f = flumine(function (
    d: any,
    ok: (value: Buffer) => void,
    ng: (error: Error) => void,
  ) {
    const buff: Buffer[] = [];
    const output = through2.default(function (
      chunk: Buffer,
      enc: string,
      cb: () => void,
    ) {
      const svg = chunk;
      buff.push(svg);
      cb();
    });

    const stream = uiflow.buildWithCode(
      inputFileName,
      code,
      format,
      function (error: Error) {
        console.log(inputFileName);
        console.log(code);
        console.log(format);
        ng(error);
      },
    );

    stream.pipe(output);
    stream.on("end", function () {
      const buffAll = Buffer.concat(buff);
      ok(buffAll);
      output.end();
    });
  });

  return f();
};

const stringify = function (buff: Buffer): string {
  const str = String(buff);
  return str;
};

const base64nize = function (buff: Buffer): string {
  return buff.toString("base64");
};

api.compile = function (code: string): Promise<{ svg: string; meta: string }> {
  return flumine.set({
    svg: flumine
      .to(function () {
        return api.update("<anon>", code, "svg");
      })
      .to(stringify),
    meta: flumine
      .to(function () {
        return api.update("<anon>", code, "meta");
      })
      .to(stringify),
  })();
};

api.base64png = function (code: string): Promise<string> {
  return flumine
    .to(function () {
      return api.update("<anon>", code, "png");
    })
    .to(base64nize)();
};

export default api;
