"""
Move files from src/assets/rename/ to src/assets/,
converting filenames to lowercase with spaces replaced by hyphens.
"""

import os
import shutil

SRC_DIR = os.path.join("src", "assets", "rename")
DEST_DIR = os.path.join("src", "assets")


def normalize_name(name: str) -> str:
    return name.lower().replace(" ", "-")


def main():
    if not os.path.isdir(SRC_DIR):
        print(f"Source directory not found: {SRC_DIR}")
        return

    files = [f for f in os.listdir(SRC_DIR) if os.path.isfile(os.path.join(SRC_DIR, f))]

    if not files:
        print("No files found in rename directory.")
        return

    for filename in files:
        new_name = normalize_name(filename)
        src_path = os.path.join(SRC_DIR, filename)
        dest_path = os.path.join(DEST_DIR, new_name)

        if os.path.exists(dest_path):
            print(f"SKIP (already exists): {new_name}")
            continue

        shutil.move(src_path, dest_path)
        print(f"Moved: {filename!r} -> {new_name!r}")


if __name__ == "__main__":
    main()
