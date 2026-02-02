import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory if it doesn't exist
        const relativePath = "public/purchase-images";
        const uploadDir = join(process.cwd(), relativePath);
        await mkdir(uploadDir, { recursive: true });

        // Sanitize filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, buffer);
        const publicUrl = `/purchase-images/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
