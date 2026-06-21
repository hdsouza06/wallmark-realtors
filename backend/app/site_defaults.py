"""Default values for owner-editable site settings.

These are seeded into the `site_settings` table on startup (only missing keys
are added), and also act as the fallback if the table is empty.
"""

DEFAULT_SETTINGS = {
    # --- Contact ---
    "phone": "+91 98208 90001",
    "whatsapp": "919820890001",
    "email": "wallmarkrealtors@gmail.com",
    "address": "Mumbai · Pune · Goa · Dubai",
    "website": "https://www.wallmarkrealtors.com",
    "rera": "A031262601485",
    "map_embed": "https://www.google.com/maps?q=Mumbai,Maharashtra,India&output=embed",
    # --- Social links ---
    "youtube_url": "https://www.youtube.com/@wallmarkrealtors",
    "instagram_url": "https://www.instagram.com/wallmarkrealtors",
    "facebook_url": "https://www.facebook.com/wallmarkrealtors",
    "linkedin_url": "",
    # --- About Us (editable) ---
    "about_title": "About Wallmark Realtors",
    "about_subtitle": "Your one-stop solution for all your real estate needs",
    "about_body": (
        "Wallmark Realtors is a trusted real estate consultancy serving Mumbai, Pune, "
        "Goa and Dubai. From finding your dream home to home loans, interiors, property "
        "management and leasing, we support you across the entire real estate journey. "
        "A realtor is not a salesperson, but a matchmaker between your dreams and your "
        "destinations — and that belief guides everything we do."
    ),
    # Newline-separated bullet points
    "about_points": (
        "Buying your dream home\n"
        "Home loan assistance\n"
        "Home interiors\n"
        "Property management\n"
        "Leasing & rental support"
    ),
    "about_image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
}
