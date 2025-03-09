import $ from "jquery";
import EventEmitter from "eventemitter3";
import { sprintf } from "sprintf-js";

interface MetaData {
  [key: string]: {
    lines: number;
  };
}

interface DiagramData {
  meta: string;
  svg: string;
}

const emitter = new EventEmitter();

// eslint-disable-next-line
let CURRENT_DOC: string;
const svgElement = function (): JQuery<SVGSVGElement> {
  // より具体的なセレクタを使用して正しい型を推論させる
  return $("svg:first") as unknown as JQuery<SVGSVGElement>;
};

const getViewBox = function (svg: JQuery<SVGSVGElement>): number[] {
  const viewBox = svg[0].getAttribute("viewBox");
  return viewBox ? viewBox.split(/\s/g).map(parseFloat) : [0, 0, 0, 0];
};

let VIEW_BOX_VALUES: number[] | undefined;
let SCALE = 1.0;
let DEFAULT_VIEW_BOX = "";

const setViewBox = function (
  svg: JQuery<SVGSVGElement>,
  values: number[],
): void {
  const text = values.join(" ");
  svg[0].setAttribute("viewBox", text);
  $("#viewBox").text(
    sprintf(
      "%4.2f,%4.2f,%4.2f,%4.2f",
      values[0],
      values[1],
      values[2],
      values[3],
    ),
  );
  VIEW_BOX_VALUES = values;
};

$(function () {
  $("#plus").on("click", function () {
    const svg = svgElement();
    const viewBoxValues = getViewBox(svg);
    viewBoxValues[2] /= 1.2;
    viewBoxValues[3] /= 1.2;
    setViewBox(svg, viewBoxValues);
  });

  $("#flat").on("click", function () {
    const svg = svgElement();
    setViewBox(svg, DEFAULT_VIEW_BOX.split(/\s/g).map(parseFloat));
  });

  $("#minus").on("click", function () {
    const svg = svgElement();
    const viewBoxValues = getViewBox(svg);
    viewBoxValues[2] *= 1.2;
    viewBoxValues[3] *= 1.2;
    setViewBox(svg, viewBoxValues);
  });
});

const refresh = function (data: DiagramData): void {
  const meta = data.meta;
  const doc = data.svg;
  CURRENT_DOC = doc;
  $("#diagram-1").html(doc);
  const svg = svgElement();
  svg[0].setAttribute(
    "viewBox",
    [-14, -30, svg.width() ?? 0 * 0.8, svg.height() ?? 0 * 0.8].join(" "),
  );

  const metaData: MetaData = JSON.parse(meta);
  DEFAULT_VIEW_BOX = svg[0].getAttribute("viewBox") || "";
  if (VIEW_BOX_VALUES) setViewBox(svg, VIEW_BOX_VALUES);

  let startX: number, startY: number;
  let initialViewBox: number[];
  let onDrag = false;

  svg.find("g.node polygon").attr("fill", "white");
  svg.find("g.node ellipse").attr("fill", "white");

  svg.find("g.node").on("mouseover", function () {
    $(this).find("polygon").attr("stroke", "green");
    $(this).find("polygon").attr("stroke-width", "4");
    $(this).find("ellipse").attr("stroke", "red");
    $(this).find("ellipse").attr("stroke-width", "4");
  });

  svg.find("g.node").on("click", function () {
    const text = $(this).find("title").text().trim();
    if ($(this).find("ellipse").length === 0) {
      const lines = metaData[text].lines;
      emitter.emit("page-click", lines);
    } else {
      const insertText = ["\n[", text, "]\n"].join("");
      emitter.emit("end-click", insertText);
    }
  });

  svg.find("g.node").on("mouseout", function () {
    $(this).find("polygon").attr("stroke", "black");
    $(this).find("polygon").attr("stroke-width", "1");
    $(this).find("ellipse").attr("stroke", "black");
    $(this).find("ellipse").attr("stroke-width", "1");
  });

  svg.on("mousedown", function (evt) {
    startX = evt.clientX;
    startY = evt.clientY;
    initialViewBox = getViewBox(svg);
    onDrag = true;
    evt.preventDefault();
    return false;
  });

  svg.on("mousemove", function (evt) {
    if (onDrag) {
      const movingX = evt.clientX;
      const movingY = evt.clientY;
      const diffX = movingX - startX;
      const diffY = movingY - startY;
      const viewBoxValues = getViewBox(svg);
      viewBoxValues[0] = initialViewBox[0] - diffX * SCALE;
      viewBoxValues[1] = initialViewBox[1] - diffY * SCALE;
      setViewBox(svg, viewBoxValues);
    }
    evt.preventDefault();
    return false;
  });

  svg.on("mouseup", function (evt) {
    onDrag = false;
    evt.preventDefault();
    return false;
  });
};

interface DiagramApi {
  refresh: (data: DiagramData) => void;
  on: (channel: string, cb: (...args: any[]) => void) => void;
}

const diagramApi: DiagramApi = {
  refresh: refresh,
  on: function (channel: string, cb: (...args: any[]) => void) {
    emitter.on(channel, cb);
  },
};

export default diagramApi;
