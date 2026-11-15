"use strict";

// Gerado por tools/sync_pni_data.py a partir do English_PNI. Não edite à mão.
const pniData = {
  "source": "GladistoneSouza/English_PNI@03e8cce",
  "catalog": {
    "catalog_id": "a1-starter",
    "version": "0.1.0",
    "content_level": "A1",
    "items": [
      {
        "id": "a1.be.001",
        "skill": "verb-to-be",
        "type": "choice",
        "prompt": "I ___ a student.",
        "choices": [
          "am",
          "is",
          "are"
        ],
        "accepted": [
          "am"
        ],
        "explanation_key": "explain.be.i_am"
      },
      {
        "id": "a1.be.002",
        "skill": "verb-to-be",
        "type": "choice",
        "prompt": "She ___ from Brazil.",
        "choices": [
          "am",
          "is",
          "are"
        ],
        "accepted": [
          "is"
        ],
        "explanation_key": "explain.be.he_she_it_is"
      },
      {
        "id": "a1.be.003",
        "skill": "verb-to-be",
        "type": "choice",
        "prompt": "We ___ friends.",
        "choices": [
          "am",
          "is",
          "are"
        ],
        "accepted": [
          "are"
        ],
        "explanation_key": "explain.be.we_you_they_are"
      },
      {
        "id": "a1.be.004",
        "skill": "verb-to-be",
        "type": "gap",
        "prompt": "Write the short form: I am happy. -> ___ happy.",
        "accepted": [
          "I'm",
          "I'm happy"
        ],
        "explanation_key": "explain.be.contraction"
      },
      {
        "id": "a1.article.001",
        "skill": "articles",
        "type": "choice",
        "prompt": "I have ___ apple.",
        "choices": [
          "a",
          "an"
        ],
        "accepted": [
          "an"
        ],
        "explanation_key": "explain.article.an_vowel_sound"
      },
      {
        "id": "a1.article.002",
        "skill": "articles",
        "type": "choice",
        "prompt": "She has ___ dog.",
        "choices": [
          "a",
          "an"
        ],
        "accepted": [
          "a"
        ],
        "explanation_key": "explain.article.a_consonant_sound"
      },
      {
        "id": "a1.article.003",
        "skill": "articles",
        "type": "choice",
        "prompt": "It takes ___ hour.",
        "choices": [
          "a",
          "an"
        ],
        "accepted": [
          "an"
        ],
        "explanation_key": "explain.article.silent_h"
      },
      {
        "id": "a1.plural.001",
        "skill": "plurals",
        "type": "gap",
        "prompt": "Write the plural: one book, two ___.",
        "accepted": [
          "books"
        ],
        "explanation_key": "explain.plural.add_s"
      },
      {
        "id": "a1.plural.002",
        "skill": "plurals",
        "type": "gap",
        "prompt": "Write the plural: one box, two ___.",
        "accepted": [
          "boxes"
        ],
        "explanation_key": "explain.plural.add_es"
      },
      {
        "id": "a1.plural.003",
        "skill": "plurals",
        "type": "gap",
        "prompt": "Write the plural: one child, two ___.",
        "accepted": [
          "children"
        ],
        "explanation_key": "explain.plural.irregular"
      },
      {
        "id": "a1.question.001",
        "skill": "questions",
        "type": "choice",
        "prompt": "___ is your name?",
        "choices": [
          "What",
          "Where",
          "How"
        ],
        "accepted": [
          "What"
        ],
        "explanation_key": "explain.question.what_name"
      },
      {
        "id": "a1.question.002",
        "skill": "questions",
        "type": "choice",
        "prompt": "___ are you from?",
        "choices": [
          "What",
          "Where",
          "Who"
        ],
        "accepted": [
          "Where"
        ],
        "explanation_key": "explain.question.where_from"
      }
    ]
  },
  "explanations": {
    "explain.article.a_consonant_sound": "Use a antes de som de consoante: a dog, a car.",
    "explain.article.an_vowel_sound": "Use an antes de som de vogal: an apple, an egg.",
    "explain.article.silent_h": "Em hour, o h é mudo, então a palavra começa com som de vogal: an hour.",
    "explain.be.contraction": "I am vira I'm na forma curta. O apóstrofo substitui a letra a.",
    "explain.be.he_she_it_is": "Com he, she e it, use is: She is from Brazil.",
    "explain.be.i_am": "Com I, use am: I am a student.",
    "explain.be.we_you_they_are": "Com we, you e they, use are: We are friends.",
    "explain.plural.add_es": "Substantivos terminados em -s, -x, -sh ou -ch geralmente ganham -es: box, boxes.",
    "explain.plural.add_s": "A maioria dos substantivos ganha -s no plural: book, books.",
    "explain.plural.irregular": "Alguns plurais são irregulares e precisam ser memorizados: child, children.",
    "explain.question.what_name": "Use what para perguntar o nome: What is your name?",
    "explain.question.where_from": "Use where para perguntar de onde a pessoa é: Where are you from?"
  }
};
