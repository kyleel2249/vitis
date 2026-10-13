/**
 * POST /api/cart/sync
 * The storefront Header calls this path to merge the local cart with the server cart.
 * The merge handler lives in ../route.ts (kept for backward compatibility); it is
 * re-exported here so both /api/cart and /api/cart/sync resolve.
 */
export { POST } from '../route';
