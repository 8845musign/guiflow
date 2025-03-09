// Type definitions for uiflow
// Project: https://github.com/hirokidaichi/uiflow
// Definitions by: TypeScript Declaration Generator

/// <reference types="node" />

declare module "uiflow" {
  import * as fs from "fs";
  import * as stream from "stream";

  /**
   * Interface for a uiflow action
   */
  interface UiflowAction {
    /**
     * Text content of the action
     */
    text: string[];

    /**
     * Direction (target section) of the action
     */
    direction: string | null;

    /**
     * Edge label for the action
     */
    edge?: string;
  }

  /**
   * Interface for a uiflow section
   */
  interface UiflowSection {
    [key: string]: {
      /**
       * Name of the section
       */
      name: string;

      /**
       * Rank of the section (for layout)
       */
      rank: string;

      /**
       * Line number where the section appears
       */
      lines: number;

      /**
       * "See" text lines
       */
      see: string[];

      /**
       * Unique ID for the section
       */
      id: number;

      /**
       * Actions in the section
       */
      actions: UiflowAction[];

      /**
       * Current state of the section during parsing
       */
      state: "see" | "action" | "endaction";
    };
  }

  /**
   * Path to the dot executable
   */
  const DOT_PATH: string;

  /**
   * Mapping of output formats to their respective pipeline functions
   */
  const FORMAT_TO_PIPELINE: {
    dot: Function[];
    meta: Function[];
    json: Function[];
    png: Function[];
    svg: Function[];
  };

  /**
   * Parser module for uiflow syntax
   */
  const parser: {
    /**
     * Lexer function to tokenize uiflow text
     * @param text The uiflow text to tokenize
     * @returns Array of tokens
     */
    lexer: (text: string) => any[];

    /**
     * Parse uiflow text into a structured object
     * @param text The uiflow text to parse
     * @param fileName Optional filename for error reporting
     * @returns Parsed uiflow structure
     */
    parse: (text: string, fileName?: string) => UiflowSection;
  };

  /**
   * Dot writer module for generating dot output
   */
  const dotwriter: {
    /**
     * Graph attributes for dot output
     */
    graph: {
      charset: string;
      labelloc: string;
      labeljust: string;
      style: string;
      rankdir: string;
      margin: number;
      ranksep: number;
      nodesep: number;
    };

    /**
     * Node attributes for dot output
     */
    node: {
      style: string;
      fontsize: number;
      margin: string;
      fontname: string;
    };

    /**
     * Edge attributes for dot output
     */
    edge: {
      fontsize: number;
      fontname: string;
      color: string;
    };

    /**
     * Compile a parsed uiflow structure into dot format
     * @param tree The parsed uiflow structure
     * @returns Dot format string
     */
    compile: (tree: UiflowSection) => string;
  };

  /**
   * Compile uiflow text into dot format
   * @param d The uiflow text to compile
   * @returns Compiled dot format
   */
  function compile(d: string): string;

  /**
   * Build a uiflow diagram from a file
   * @param fileName The file to read
   * @param format The output format (dot, meta, json, png, svg)
   * @param handleError Optional error handler
   * @returns Stream with the processed output
   */
  function build(
    fileName: string,
    format: "dot" | "meta" | "json" | "png" | "svg",
    handleError?: (error: Error) => void,
  ): stream.Readable;

  /**
   * Build a uiflow diagram from code
   * @param fileName A name for the source (for error reporting)
   * @param code The uiflow code
   * @param format The output format (dot, meta, json, png, svg)
   * @param handleError Optional error handler
   * @returns Stream with the processed output
   */
  function buildWithCode(
    fileName: string,
    code: string,
    format: "dot" | "meta" | "json" | "png" | "svg",
    handleError?: (error: Error) => void,
  ): stream.Readable;

  export {
    UiflowAction,
    UiflowSection,
    DOT_PATH,
    FORMAT_TO_PIPELINE,
    parser,
    dotwriter,
    compile,
    build,
    buildWithCode,
  };
}
