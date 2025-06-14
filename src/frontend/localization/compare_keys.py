import json
from collections.abc import Mapping
from pathlib import Path
from os.path import join

script_path = Path(__file__).resolve()
script_dir = script_path.parent

def extract_keys(obj, prefix=''):
    keys = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            full_key = f"{prefix}.{k}" if prefix else k
            keys.add(full_key)
            keys.update(extract_keys(v, full_key))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            keys.update(extract_keys(item, prefix))
    return keys

def compare_json_keys(file1, file2):
    with open(file1, 'r', encoding='utf-8') as f1, open(file2, 'r', encoding='utf-8') as f2:
        json1 = json.load(f1)
        json2 = json.load(f2)

    keys1 = extract_keys(json1)
    keys2 = extract_keys(json2)

    if keys1 == keys2:
        print("✅ The two JSON files have exactly the same keys.")
    else:
        print("❌ The JSON files differ in keys.")
        only_in_1 = keys1 - keys2
        only_in_2 = keys2 - keys1
        if only_in_1:
            print("\nKeys only in first file:")
            for k in sorted(only_in_1):
                print(f"  {k}")
        if only_in_2:
            print("\nKeys only in second file:")
            for k in sorted(only_in_2):
                print(f"  {k}")

if __name__ == '__main__':
    # IMPORTANT!!!!! Do not use preceding / in the second path of join()
    # print('script_dir:', script_dir)
    # print('script_dir joined', join(script_dir, 'locales/en-UK/translations.json'))
    compare_json_keys(
        join(script_dir, 'locales/en-UK/translations.json'),
        join(script_dir, 'locales/es-ES/translations.json')
    )
