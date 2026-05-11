import dbConnect from "./mongodb";
import ActivityLog from "../models/ActivityLog";

/**
 * Fire-and-forget activity logger. Does not block the request.
 * @param {"ADMIN_LOGIN"|"PRODUCT_CREATED"|"PRODUCT_UPDATED"|"PRODUCT_DELETED"|"SETTINGS_UPDATED"|"INQUIRY_DELETED"|"IMAGE_UPLOADED"} action
 * @param {string} entity  - Identifier (e.g. product serial, "global")
 * @param {string} detail  - Human-readable summary
 * @param {string} ip      - Request IP address
 */
export function logActivity(action, entity = "", detail = "", ip = "") {
  // Intentionally not awaited — logging never blocks a response
  dbConnect()
    .then(() => ActivityLog.create({ action, entity, detail, ip }))
    .catch(() => {
      // Silently swallow logging failures — never crash the main request
    });
}
