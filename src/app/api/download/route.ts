import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Strict Allowlist prevents any arbitrary strings from mapping to disk files
const ALLOWED_FILES: Record<string, { filename: string; contentType: string }> = {
  "resume.pdf": {
    filename: "Pradeep_Balamurugan_Resume.pdf",
    contentType: "application/pdf",
  },
  // Add other safe files here if needed
  // "portfolio-deck.pdf": { ... }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedFile = searchParams.get("file");

    if (!requestedFile) {
      return new NextResponse("File parameter missing", { status: 400 });
    }

    // 1. Input Validation against explicit allowlist (defends against Path Traversal & LFI)
    const fileConfig = ALLOWED_FILES[requestedFile];
    
    if (!fileConfig) {
      console.warn(`[Security] Attempted unauthorized or invalid file download access: ${requestedFile}`);
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    // 2. Safe path resolution: guarantees we only serve from public directory
    // Even if path traversal (../../) bypassed the allowlist somehow, this normalizes it to ensure it stays in public/ 
    const baseDir = path.resolve(process.cwd(), "public");
    // Only resolve the allowed requestedFile (e.g. "resume.pdf"), so it's guaranteed to be baseDir + "/resume.pdf"
    const safePath = path.join(baseDir, requestedFile);

    if (!safePath.startsWith(baseDir)) {
      return new NextResponse("Invalid Path", { status: 403 });
    }

    const fileBuffer = await readFile(safePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": fileConfig.contentType,
        // Forces a download dialog instead of rendering potentially dangerous files in-browser
        "Content-Disposition": `attachment; filename="${fileConfig.filename}"`,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Robots-Tag": "noindex",
        "Content-Length": fileBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    // Keep errors generic: never expose underlying file system errors to the user
    console.error("Download Error:", error);
    return new NextResponse("File not found or unavailable.", { status: 404 });
  }
}
