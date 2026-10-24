"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/admin-directory.ts
var admin_directory_exports = {};
__export(admin_directory_exports, {
  default: () => handler
});
module.exports = __toCommonJS(admin_directory_exports);
var import_supabase_js = require("@supabase/supabase-js");
var SUPABASE_URL = process.env.SUPABASE_URL ?? "";
var SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY ?? "";
var ALLOWED_ORIGIN = process.env.ADMIN_ALLOWED_ORIGIN ?? "*";
var cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
function json(res, body, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
  res.send(JSON.stringify(body));
}
var ACTIONS = /* @__PURE__ */ new Set([
  "listUsers",
  "createUser",
  "updateUser",
  "deactivateUser",
  "reactivateUser",
  "deleteUser"
]);
async function readBody(req) {
  const raw = await new Promise((resolve, reject) => {
    let acc = "";
    req.on("data", (chunk) => acc += chunk);
    req.on("end", () => resolve(acc));
    req.on("error", reject);
  });
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function handler(req, res) {
  if (req.method === "OPTIONS") {
    for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") return json(res, { error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json(res, { error: "Admin directory is not configured on this deployment." }, 500);
  }
  const payload = await readBody(req);
  const action = payload.action;
  if (!action || !ACTIONS.has(action)) {
    return json(res, { error: "Unsupported action." }, 400);
  }
  const rawAuth = req.headers.authorization;
  const authHeader = (Array.isArray(rawAuth) ? rawAuth[0] : rawAuth) ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json(res, { error: "Not signed in." }, 401);
  const admin = (0, import_supabase_js.createClient)(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: me, error: meError } = await admin.auth.getUser(token);
  if (meError || !me?.user) return json(res, { error: "Session is no longer valid." }, 401);
  try {
    switch (action) {
      case "listUsers": {
        const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { users: data.users ?? [] });
      }
      case "createUser": {
        if (!payload.email) return json(res, { error: "Email is required." }, 400);
        const { error } = await admin.auth.admin.createUser({
          email: String(payload.email).trim(),
          email_confirm: true,
          user_metadata: {
            first_name: String(payload.firstName ?? "").trim(),
            last_name: String(payload.lastName ?? "").trim(),
            role: payload.role ?? "Adviser",
            permissions: payload.permissions ?? []
          }
        });
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { ok: true });
      }
      case "updateUser": {
        if (!payload.id) return json(res, { error: "User id is required." }, 400);
        const { data: existing, error: readError } = await admin.auth.admin.getUserById(payload.id);
        if (readError) return json(res, { error: readError.message }, 400);
        const meta = { ...existing.user.user_metadata ?? {} };
        if (payload.firstName !== void 0) meta.first_name = String(payload.firstName).trim();
        if (payload.lastName !== void 0) meta.last_name = String(payload.lastName).trim();
        if (payload.role !== void 0) meta.role = payload.role;
        if (payload.permissions !== void 0) meta.permissions = payload.permissions;
        const { error } = await admin.auth.admin.updateUserById(payload.id, {
          user_metadata: meta,
          ...payload.password ? { password: String(payload.password) } : {}
        });
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { ok: true });
      }
      case "deactivateUser": {
        if (!payload.id) return json(res, { error: "User id is required." }, 400);
        const { error } = await admin.auth.admin.updateUserById(payload.id, {
          ban_duration: "2147483647s"
        });
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { ok: true });
      }
      case "reactivateUser": {
        if (!payload.id) return json(res, { error: "User id is required." }, 400);
        const { error } = await admin.auth.admin.updateUserById(payload.id, { ban_duration: "none" });
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { ok: true });
      }
      case "deleteUser": {
        if (!payload.id) return json(res, { error: "User id is required." }, 400);
        const { error } = await admin.auth.admin.deleteUser(payload.id);
        if (error) return json(res, { error: error.message }, 400);
        return json(res, { ok: true });
      }
      default:
        return json(res, { error: "Unsupported action." }, 400);
    }
  } catch (e) {
    return json(res, { error: e instanceof Error ? e.message : "Something went wrong." }, 500);
  }
}
