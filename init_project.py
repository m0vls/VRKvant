import os
import json

def create_vr_kvant_structure():
    # Папки
    directories = [
        'articles',
        'articles/blender',
        'articles/unity',
        'articles/unreal',
        'articles/cheats',
        'img'
    ]

    for d in directories:
        if not os.path.exists(d):
            os.makedirs(d)
            print(f"Создана папка: {d}")

    # Манифест треков
    tracks_data = {
        "tracks": [
            {
                "id": "blender",
                "name": "Blender Track",
                "icon": "fas fa-shapes",
                "colorClass": "bg-orange-500",
                "lessons": [{ "title": "Вступление", "file": "intro.md" }]
            },
            {
                "id": "unity",
                "name": "Unity Track",
                "icon": "fab fa-unity",
                "colorClass": "bg-indigo-600",
                "lessons": [{ "title": "Вступление", "file": "intro.md" }]
            },
            {
                "id": "unreal",
                "name": "Unreal Engine",
                "icon": "fas fa-bolt",
                "colorClass": "bg-slate-700",
                "lessons": [{ "title": "Вступление", "file": "intro.md" }]
            }
        ]
    }

    # Манифест шпаргалок
    cheats_data = {
        "cheats": [
            { "title": "Подключение Oculus Quest", "file": "quest_setup.md" },
            { "title": "Горячие клавиши Blender", "file": "blender_keys.md" }
        ]
    }

    # Файлы
    files = {
        'articles/tracks.json': json.dumps(tracks_data, indent=2, ensure_ascii=False),
        'articles/cheats.json': json.dumps(cheats_data, indent=2, ensure_ascii=False),
        'articles/blender/intro.md': "# Blender\n\nДобро пожаловать в мир 3D!",
        'articles/unity/intro.md': "# Unity\n\nСоздай свою первую игру.",
        'articles/unreal/intro.md': "# Unreal Engine\n\nГрафика будущего здесь.",
        'articles/cheats/quest_setup.md': "# Подключение Quest\n\n1. Включи Link...\n2. Надень шлем...",
        'articles/cheats/blender_keys.md': "# Горячие клавиши\n\n* `G` - Move\n* `S` - Scale"
    }

    for path, content in files.items():
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Создан файл: {path}")

    print("\n✅ Структура обновлена! Шпаргалки теперь тоже в .md")

if __name__ == "__main__":
    create_vr_kvant_structure()