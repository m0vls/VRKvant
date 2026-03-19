import os
import re
import json

def parse_frontmatter(content):
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if match:
        frontmatter_str = match.group(1)
        # Простой парсинг YAML-подобного Frontmatter
        data = {}
        for line in frontmatter_str.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                data[key.strip()] = value.strip().replace("\"", "") # Удаляем кавычки
        return data, content[match.end():]
    return {}, content

def generate_manifests(articles_dir="articles/"):
    tracks = []
    cheats = []

    # Сканирование треков
    track_dirs = [d for d in os.listdir(articles_dir) if os.path.isdir(os.path.join(articles_dir, d)) and d not in ["cheats", "portfolio"]]
    for track_id in track_dirs:
        track_path = os.path.join(articles_dir, track_id)
        lessons = []
        for md_file in sorted([f for f in os.listdir(track_path) if f.endswith(".md")]):
            with open(os.path.join(track_path, md_file), "r", encoding="utf-8") as f:
                content = f.read()
                frontmatter, _ = parse_frontmatter(content)
                lessons.append({"title": frontmatter.get("title", md_file.replace(".md", "")), "file": md_file})
        
        # Попытка получить icon и colorClass из первого урока, если они там определены
        # Иначе, используем значения по умолчанию.
        icon = f"img/{track_id}/{track_id}_logo.jpg"  # Дефолтная иконка
        color_class = "bg-gray-500"  # Дефолтный класс цвета
        track_name = track_id.capitalize() + " Track" # Дефолтное имя трека

        if lessons:
            first_lesson_full_path = os.path.join(track_path, lessons[0]["file"])
            with open(first_lesson_full_path, "r", encoding="utf-8") as f:
                first_lesson_content = f.read()
                first_lesson_frontmatter, _ = parse_frontmatter(first_lesson_content)
                if "icon" in first_lesson_frontmatter:
                    icon = first_lesson_frontmatter["icon"]
                if "colorClass" in first_lesson_frontmatter:
                    color_class = first_lesson_frontmatter["colorClass"]
                if "name" in first_lesson_frontmatter:
                    track_name = first_lesson_frontmatter["name"]

        tracks.append({
            "id": track_id,
            "name": track_name,
            "icon": icon,
            "colorClass": color_class,
            "lessons": lessons
        })

    # Сканирование шпаргалок
    cheats_path = os.path.join(articles_dir, "cheats")
    if os.path.exists(cheats_path):
        for md_file in sorted([f for f in os.listdir(cheats_path) if f.endswith(".md")]):
            with open(os.path.join(cheats_path, md_file), "r", encoding="utf-8") as f:
                content = f.read()
                frontmatter, _ = parse_frontmatter(content)
                cheats.append({"title": frontmatter.get("title", md_file.replace(".md", "")), "file": md_file})

    # Запись tracks.json
    with open(os.path.join(articles_dir, "tracks.json"), "w", encoding="utf-8") as f:
        json.dump({"tracks": tracks}, f, ensure_ascii=False, indent=2)
    
    # Запись cheats.json
    with open(os.path.join(articles_dir, "cheats.json"), "w", encoding="utf-8") as f:
        json.dump({"cheats": cheats}, f, ensure_ascii=False, indent=2)

    print("Манифесты tracks.json и cheats.json успешно сгенерированы.")

if __name__ == "__main__":
    generate_manifests()
