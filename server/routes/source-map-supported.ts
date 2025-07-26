import { getSourceMapsSupport } from "node:module";

export default defineEventHandler(() => ({
  sourcemapSupported: getSourceMapsSupport(),
}));
