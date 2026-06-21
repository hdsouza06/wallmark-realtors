import re
import unicodedata


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s]+", "-", value) or "item"


def unique_slug(db_session, model, base_value: str) -> str:
    base = slugify(base_value)
    slug = base
    i = 2
    while db_session.query(model).filter(model.slug == slug).first() is not None:
        slug = f"{base}-{i}"
        i += 1
    return slug
