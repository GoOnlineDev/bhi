/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons.js";
import type * as gallery from "../gallery.js";
import type * as news from "../news.js";
import type * as newsemail from "../newsemail.js";
import type * as programemail from "../programemail.js";
import type * as programs from "../programs.js";
import type * as subscribers from "../subscribers.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  gallery: typeof gallery;
  news: typeof news;
  newsemail: typeof newsemail;
  programemail: typeof programemail;
  programs: typeof programs;
  subscribers: typeof subscribers;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
