#!/usr/bin/env python3
"""Copia o catálogo e as explicações do English_PNI para o site.

Uso: python3 tools/sync_pni_data.py ../english_pni

Gera:
- dist/pni-data.js: catálogo A1 (curriculum/en/a1.json) e explicações pt-BR.
- tests/pni-golden.json: resultados do núcleo Python, para o teste de paridade.
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent


def golden(pni: Path) -> dict:
    sys.path.insert(0, str(pni))
    from english_pni.catalog import load_catalog
    from english_pni.emma import Emma
    from english_pni.grading import is_correct, normalize
    from english_pni.sophia import Sophia
    from english_pni.store import ProgressStore
    import tempfile

    catalog = load_catalog()
    texts = ["I'm", "  I’m. ", "iʼm!", "Im", "I am", "AN", "an ", "children?!", "", ".",
             "Ｗｈａｔ", "where are", "Boxes,", "a  b\tc"]
    t0 = datetime(2026, 11, 15, 12, 0, tzinfo=timezone.utc)
    script = [  # (item, resposta, minutos depois de t0)
        ("a1.be.001", "am", 0), ("a1.be.002", "am", 1), ("a1.be.003", "are", 2),
        ("a1.be.002", "is", 12), ("a1.be.001", "AM.", 60 * 24), ("a1.be.002", "is", 60 * 24 + 12),
        ("a1.be.001", "is", 60 * 24 * 4), ("a1.be.003", "are", 60 * 24 * 5),
        ("a1.be.001", "am", 60 * 24 * 4 + 10), ("a1.be.003", "are", 60 * 24 * 2),  # relógio voltou
        ("a1.article.002", "an", 60 * 24 * 6), ("a1.article.001", "a", 60 * 24 * 6),  # empate de horário
        ("a1.be.004", "I'm", 60 * 24 * 6 + 1),
    ]
    steps = []
    with tempfile.TemporaryDirectory() as tmp:
        sophia = Sophia(ProgressStore(Path(tmp), "test").open("test-golden"), catalog.ids)
        emma = Emma(catalog, sophia)
        for item_id, answer, minutes in script:
            now = t0 + timedelta(minutes=minutes)
            grade = emma.grade(item_id, answer, now)
            probe = now + timedelta(minutes=10)
            nxt = emma.next_item(probe)
            steps.append({
                "item": item_id, "answer": answer, "at": now.isoformat(),
                "correct": grade.correct, "box": grade.state.box,
                "next_review_at": grade.state.next_review_at.isoformat(),
                "probe": probe.isoformat(), "next_item": nxt.id if nxt else None,
                "due": sophia.due_items(probe),
            })
    return {
        "normalize": [[text, normalize(text)] for text in texts],
        "is_correct": [[text, list(item.accepted), is_correct(text, item.accepted)]
                       for item in catalog.items for text in (*item.accepted, "wrong", item.accepted[0].upper())],
        "steps": steps,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__)
        return 2
    pni = Path(argv[1]).resolve()
    catalog = json.loads((pni / "curriculum/en/a1.json").read_text(encoding="utf-8"))
    messages = json.loads((pni / "locales/pt-BR/messages.json").read_text(encoding="utf-8"))
    keys = {item["explanation_key"] for item in catalog["items"]}
    commit = subprocess.run(["git", "-C", str(pni), "rev-parse", "--short", "HEAD"],
                            capture_output=True, text=True, check=True).stdout.strip()
    data = {
        "source": f"GladistoneSouza/English_PNI@{commit}",
        "catalog": catalog,
        "explanations": {key: messages[key] for key in sorted(keys)},
    }
    (SITE / "dist/pni-data.js").write_text(
        "\"use strict\";\n\n// Gerado por tools/sync_pni_data.py a partir do English_PNI. Não edite à mão.\n"
        "const pniData = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")
    (SITE / "tests/pni-golden.json").write_text(
        json.dumps(golden(pni), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"pni-data.js e pni-golden.json gerados de {data['source']}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
