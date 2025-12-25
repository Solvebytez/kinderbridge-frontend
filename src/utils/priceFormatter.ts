/**
 * Formats daycare price for display
 * Uses priceString if available (e.g., "400-600", "300-400"), otherwise formats numeric price
 * @param price - Numeric price value
 * @param priceString - String price value from database (e.g., "400-600", "300-400")
 * @returns Formatted price string in format "475$ - 500$" or "1400$ - 1800$"
 */
export function formatDaycarePrice(
  price?: number | string | null,
  priceString?: string | null
): string {
  // PRIORITY 1: If priceString exists and is not empty/NO, format it
  if (priceString && priceString !== "NO" && priceString.trim() !== "") {
    const formatted = priceString.trim();
    // Remove any existing /month suffix
    const cleaned = formatted.replace(/\/month/gi, "").trim();

    // Check if it's already in the desired format (contains $ and -)
    if (cleaned.includes("$") && cleaned.includes("-")) {
      // Already formatted like "475$ - 500$", return as-is
      return cleaned;
    }

    // Check if it's a range format like "475-500" or "400-600"
    if (cleaned.includes("-") && !cleaned.includes("$")) {
      // Format as "475$ - 500$"
      const parts = cleaned.split("-").map((p) => p.trim());
      if (parts.length === 2) {
        // Remove any existing $ from parts
        const min = parts[0].replace(/\$/g, "").trim();
        const max = parts[1].replace(/\$/g, "").trim();
        return `${min}$ - ${max}$`;
      }
    }

    // If it's a single number in priceString, format it
    const numPrice = parseFloat(cleaned.replace(/[^0-9.]/g, ""));
    if (!isNaN(numPrice) && numPrice > 0) {
      return `${numPrice.toLocaleString()}$`;
    }

    // Return as-is if we can't parse it
    return cleaned;
  }

  // PRIORITY 2: Check if price itself is a string that looks like a range
  if (price !== null && price !== undefined && typeof price === "string") {
    const cleaned = price
      .replace(/\/month/gi, "")
      .replace(/^\$/, "")
      .trim();

    // If it contains a dash, format as range
    if (cleaned.includes("-")) {
      const parts = cleaned.split("-").map((p) => p.trim());
      if (parts.length === 2) {
        const min = parts[0].replace(/\$/g, "").trim();
        const max = parts[1].replace(/\$/g, "").trim();
        return `${min}$ - ${max}$`;
      }
    }

    // Try to parse as number
    const numPrice = parseFloat(cleaned.replace(/[^0-9.]/g, ""));
    if (!isNaN(numPrice) && numPrice > 0) {
      return `${numPrice.toLocaleString()}$`;
    }
    return cleaned;
  }

  // PRIORITY 3: Fallback to numeric price (format as "1500$")
  if (price !== null && price !== undefined) {
    if (typeof price === "number" && price > 0) {
      return `${price.toLocaleString()}$`;
    }
  }

  return "0$";
}
