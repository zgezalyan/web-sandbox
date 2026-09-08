import { isIP } from "node:net";
import dns from "node:dns/promises";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.",
  "metadata.google.internal",
  "metadata.google.internal.",
]);

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function inCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split("/");
  const mask = bits === "32" ? 0xffffffff : (~(0xffffffff >>> Number(bits))) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(range) & mask);
}

function isBlockedIpv4(ip: string): boolean {
  return (
    inCidr(ip, "0.0.0.0/8") ||
    inCidr(ip, "10.0.0.0/8") ||
    inCidr(ip, "127.0.0.0/8") ||
    inCidr(ip, "169.254.0.0/16") ||
    inCidr(ip, "172.16.0.0/12") ||
    inCidr(ip, "192.168.0.0/16") ||
    inCidr(ip, "224.0.0.0/4") ||
    inCidr(ip, "240.0.0.0/4")
  );
}

function isBlockedIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.") ||
    /^::ffff:169\.254\./.test(normalized) ||
    /^::ffff:172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
  );
}

export function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isBlockedIpv4(ip);
  if (version === 6) return isBlockedIpv6(ip);
  return true;
}

export async function assertPublicHttpUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }

  if (url.username || url.password) {
    throw new Error("URLs with credentials are not allowed");
  }

  const host = url.hostname.replace(/\.+$/, "").toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith(".localhost")) {
    throw new Error("That host is not allowed");
  }

  if (isIP(host) && isBlockedIp(host)) {
    throw new Error("Private or reserved addresses are not allowed");
  }

  const records = await dns.lookup(host, { all: true });
  if (records.length === 0) {
    throw new Error("Could not resolve host");
  }

  for (const record of records) {
    if (isBlockedIp(record.address)) {
      throw new Error("Host resolves to a private or reserved address");
    }
  }

  return url;
}
