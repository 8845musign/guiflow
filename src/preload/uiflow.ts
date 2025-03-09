import * as uiflow from "uiflow";
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
  return new Promise((resolve, reject) => {
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
        reject(error);
      },
    );

    stream.pipe(output);
    stream.on("end", function () {
      const buffAll = Buffer.concat(buff);
      resolve(buffAll);
      output.end();
    });
  });
};

const stringify = function (buff: Buffer): string {
  const str = String(buff);
  return str;
};

const base64nize = function (buff: Buffer): string {
  return buff.toString("base64");
};

api.compile = async function (code: string): Promise<{ svg: string; meta: string }> {
  const svgPromise = api.update("<anon>", code, "svg").then(stringify);
  const metaPromise = api.update("<anon>", code, "meta").then(stringify);
  
  const [svg, meta] = await Promise.all([svgPromise, metaPromise]);
  
  return {
    svg,
    meta
  };
};

api.base64png = async function (code: string): Promise<string> {
  const buffer = await api.update("<anon>", code, "png");
  return base64nize(buffer);
};

export default api;
