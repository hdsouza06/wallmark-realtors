"""Quick Cloudinary connectivity check.

Run after adding CLOUDINARY_* values to backend/.env:

    python check_cloudinary.py

It confirms the credentials are loaded and performs a tiny real test upload
(then deletes it) so you know image uploads will work in the admin panel.
"""
import io
import sys

from app.config import settings
from app.services import cloudinary_service


def main() -> int:
    print("Cloud name:", settings.CLOUDINARY_CLOUD_NAME or "(empty)")
    print("API key:   ", "set" if settings.CLOUDINARY_API_KEY else "(empty)")
    print("API secret:", "set" if settings.CLOUDINARY_API_SECRET else "(empty)")

    if not cloudinary_service.is_enabled():
        print("\n[X] Cloudinary is NOT configured. Fill in all three CLOUDINARY_* values in backend/.env.")
        return 1

    # 1x1 transparent PNG
    png = bytes.fromhex(
        "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
        "890000000a49444154789c6300010000050001a5f645400000000049454e44ae426082"
    )
    try:
        result = cloudinary_service.upload_image(io.BytesIO(png), folder="wallmark/_healthcheck")
        print("\n[OK] Test upload succeeded!")
        print("     URL:", result["url"])
        cloudinary_service.delete_image(result["public_id"])
        print("     (test image deleted)")
        print("\nImage uploads in the admin panel will now work.")
        return 0
    except Exception as exc:  # noqa: BLE001
        print("\n[X] Upload failed:", exc)
        print("    Double-check the credentials are copied exactly from your Cloudinary dashboard.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
