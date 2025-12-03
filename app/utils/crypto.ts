// crypto-utils.ts

/**
 * Convert ArrayBuffer to Base64 string (for storage).
 */
function bufToBase64(buffer: ArrayBuffer): string {
  // Convert to Buffer, then to Base64 string
  const buf = Buffer.from(buffer);
  return buf.toString("base64");
}

/**
 * Convert Base64 string to ArrayBuffer (for decryption).
 */
function base64ToBuf(b64: string): ArrayBuffer {
  const buf = Buffer.from(b64, "base64");
  // Create a new ArrayBuffer that maps to the Buffer content
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Derive a CryptoKey from a password + salt using PBKDF2.
 */
async function deriveKeyFromPassword(password: string, saltBuffer: ArrayBuffer) {
  const enc = new TextEncoder();
  const passKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 200_000,
      hash: "SHA-256",
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a JS object (dataObj) with a password.
 * Returns Base64‑encoded salt, iv, and ciphertext.
 */
export async function encryptData(password: string, dataObj: any) {
  const saltArray = crypto.getRandomValues(new Uint8Array(16));
  const saltBuffer = saltArray.buffer;
  const ivArray = crypto.getRandomValues(new Uint8Array(12));
  const ivBuffer = ivArray.buffer;

  const key = await deriveKeyFromPassword(password, saltBuffer);
  const enc = new TextEncoder();
  const plainBytes = enc.encode(JSON.stringify(dataObj));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    plainBytes
  );

  return {
    salt: bufToBase64(saltBuffer),
    iv:   bufToBase64(ivBuffer),
    ct:   bufToBase64(cipherBuffer),
  };
}

/**
 * Decrypt previously encrypted data (salt, iv, ct) using password.
 * Returns the original object.
 */
export async function decryptData(
  password: string,
  stored: { salt: string; iv: string; ct: string }
): Promise<any> {
  const saltBuf = base64ToBuf(stored.salt);
  const ivBuf   = base64ToBuf(stored.iv);
  const ctBuf   = base64ToBuf(stored.ct);

  const key = await deriveKeyFromPassword(password, saltBuf);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuf },
    key,
    ctBuf
  );
  const dec = new TextDecoder();
  const json = dec.decode(plainBuffer);
  return JSON.parse(json);
}
