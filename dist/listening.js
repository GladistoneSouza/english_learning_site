"use strict";

// Áudios de listening por nível. Textos originais, lidos pela voz em inglês do aparelho.
const listeningClips = [
  {id: "a1-morning", level: "A1", title: "My morning", question: "Como a Anna vai para o trabalho?",
    choices: ["De ônibus", "De carro", "A pé"], answer: 0, lines: [
      ["Anna", "Hi, I'm Anna. I live in a small apartment with my sister."],
      ["Anna", "I get up at seven o'clock every day. I take a shower and I drink coffee."],
      ["Anna", "I don't eat a big breakfast, just toast."],
      ["Anna", "I take the bus to work at eight. My office is near a park."],
      ["Anna", "At lunch, I sometimes walk in the park. I finish work at five and I go home."],
      ["Anna", "In the evening, I cook dinner and I watch TV with my sister."]
    ]},
  {id: "a1-cafe", level: "A1", title: "At the café", question: "Quanto custou o pedido?",
    choices: ["8 dólares", "18 dólares", "80 dólares"], answer: 0, lines: [
      ["Server", "Good morning! What can I get you?"],
      ["Customer", "Hi. A small coffee, please."],
      ["Server", "Hot or iced?"],
      ["Customer", "Hot, please. And a cheese sandwich."],
      ["Server", "For here or to go?"],
      ["Customer", "To go. How much is it?"],
      ["Server", "That's eight dollars."],
      ["Customer", "Can I pay by card?"],
      ["Server", "Sure. Here's your receipt. Have a nice day!"],
      ["Customer", "Thanks, you too."]
    ]},
  {id: "a1-family", level: "A1", title: "My family", question: "O que a família faz aos domingos?",
    choices: ["Visita os pais", "Vai à praia", "Trabalha"], answer: 0, lines: [
      ["Leo", "My name is Leo. I'm thirty years old. I have a big family."],
      ["Leo", "My parents live in a house in the country. My father is a teacher and my mother is a nurse."],
      ["Leo", "I have two brothers and one sister. My sister is a doctor. She lives in the city, like me."],
      ["Leo", "On Sundays, we visit our parents. We eat lunch together and we play cards."],
      ["Leo", "My mother makes great chicken soup."]
    ]},
  {id: "a1-bank", level: "A1", title: "Where is the bank?", question: "Onde fica o banco?",
    choices: ["Ao lado de uma farmácia", "Em frente ao supermercado", "Atrás da escola"], answer: 0, lines: [
      ["Tourist", "Excuse me. Where is the bank?"],
      ["Woman", "The bank? It's on Pine Street."],
      ["Tourist", "Is it far?"],
      ["Woman", "No, it's about five minutes on foot. Go straight and turn left at the supermarket."],
      ["Tourist", "Turn left at the supermarket."],
      ["Woman", "Yes. The bank is next to a pharmacy."],
      ["Tourist", "Thank you very much!"],
      ["Woman", "You're welcome."]
    ]},
  {id: "a2-weekend", level: "A2", title: "Last weekend", question: "Por que eles ficaram em casa no sábado à tarde?",
    choices: ["Começou a chover", "Estavam cansados", "O mercado fechou"], answer: 0, lines: [
      ["Maria", "Last weekend was really busy."],
      ["Maria", "On Saturday morning, I went to the market with my husband. We bought fruit, vegetables and some fresh bread."],
      ["Maria", "In the afternoon, it started to rain, so we stayed at home and watched an old movie."],
      ["Maria", "On Sunday, the weather was better. We met some friends at the beach."],
      ["Maria", "The water was too cold for swimming, but we walked for two hours and had fish and chips at a small restaurant."],
      ["Maria", "I was tired in the evening, but it was a great weekend."]
    ]},
  {id: "a2-booking", level: "A2", title: "Booking a table", question: "Para que horas ficou a reserva?",
    choices: ["8h15", "7h30", "8h50"], answer: 0, lines: [
      ["Restaurant", "Hello, Bella Cucina. How can I help you?"],
      ["Mr. Carter", "Hi, I'd like to book a table for Friday night."],
      ["Restaurant", "Sure. For how many people?"],
      ["Mr. Carter", "Four people. At seven thirty, if possible."],
      ["Restaurant", "Let me check. I'm sorry, we're full at seven thirty. We have a table at eight fifteen."],
      ["Mr. Carter", "Eight fifteen is fine."],
      ["Restaurant", "Great. Can I have your name, please?"],
      ["Mr. Carter", "It's Carter. C, A, R, T, E, R."],
      ["Restaurant", "Thank you, Mr. Carter. See you on Friday at eight fifteen."],
      ["Mr. Carter", "Thanks. Bye!"]
    ]},
  {id: "a2-job", level: "A2", title: "A new job", question: "Qual é a desvantagem do emprego novo do Sam?",
    choices: ["O trajeto é mais longo", "Paga menos", "Os colegas são antipáticos"], answer: 0, lines: [
      ["Kate", "Hey, Sam! How's the new job?"],
      ["Sam", "Pretty good, thanks. It's very different from my old one."],
      ["Kate", "Really? How?"],
      ["Sam", "Well, I used to work at night in a hotel. Now I work in an office, from nine to five."],
      ["Kate", "That sounds better!"],
      ["Sam", "It is. I see my kids more. But the commute is longer. I take two buses."],
      ["Kate", "Oh no. How long does it take?"],
      ["Sam", "About fifty minutes. I usually read on the bus, so it's OK."],
      ["Kate", "And your coworkers?"],
      ["Sam", "They're really friendly. We had lunch together yesterday."]
    ]},
  {id: "a2-weather", level: "A2", title: "The weather this week", question: "Em quais dias vai fazer sol?",
    choices: ["Quarta e quinta", "Segunda e terça", "No fim de semana"], answer: 0, lines: [
      ["Radio", "Good morning, this is your weather update for the week."],
      ["Radio", "Today will be cloudy and cool, with a high of twelve degrees."],
      ["Radio", "Tonight there's a chance of rain, so take an umbrella if you're going out."],
      ["Radio", "Tomorrow, the rain will continue in the morning, but the afternoon will be drier."],
      ["Radio", "On Wednesday and Thursday, we're expecting sunny skies and warmer temperatures, up to eighteen degrees."],
      ["Radio", "Then on the weekend, it will get windy again, especially near the coast. Have a great week!"]
    ]},
  {id: "b1-moving", level: "B1", title: "Moving to a new country", question: "O que mais ajudou com o inglês do dia a dia?",
    choices: ["Trabalho voluntário numa horta comunitária", "Aulas particulares", "Assistir a séries"], answer: 0, lines: [
      ["Lucas", "When I moved to Canada three years ago, I thought the hardest part would be the language."],
      ["Lucas", "I had studied English for years, so I felt fairly confident."],
      ["Lucas", "But as soon as I arrived, I realized that understanding people in real life was completely different from understanding my teachers."],
      ["Lucas", "People spoke quickly, used expressions I'd never heard, and dropped half of their words. For the first few months, I nodded and smiled a lot."],
      ["Lucas", "What really helped me was volunteering at a community garden. I had to talk to people every weekend, and nobody cared if I made mistakes."],
      ["Lucas", "Little by little, I started to catch the jokes."],
      ["Lucas", "Now, the hardest part isn't the language anymore. It's the winter."]
    ]},
  {id: "b1-dog", level: "B1", title: "Should we get a dog?", question: "Quem cuidaria do cachorro durante as viagens?",
    choices: ["Os pais da Jess", "Um vizinho", "Um hotel para cães"], answer: 0, lines: [
      ["Jess", "So, I've been thinking. What if we got a dog?"],
      ["Mark", "A dog? We can barely keep our plants alive."],
      ["Jess", "That's not fair. The plants were your responsibility."],
      ["Mark", "Okay, fair point. But seriously, who would walk it? We both work all day."],
      ["Jess", "I could walk it in the morning, before work. And there's a dog walker down the street who isn't expensive."],
      ["Mark", "And what about when we travel?"],
      ["Jess", "My parents said they'd look after it. They love dogs."],
      ["Mark", "Hmm. You've really thought about this, haven't you?"],
      ["Jess", "Maybe a little."],
      ["Mark", "Okay. Let's visit the animal shelter on Saturday. But we're just looking."],
      ["Jess", "Of course. Just looking."]
    ]},
  {id: "b1-phones", level: "B1", title: "Phones in schools", question: "Qual é o meio-termo que muitas escolas estão testando?",
    choices: ["Celular no armário durante a aula", "Proibição total", "Celular só em emergências"], answer: 0, lines: [
      ["Host", "Should phones be banned in schools? More and more schools are saying yes."],
      ["Host", "Supporters argue that phones are a constant distraction. Teachers say students are more focused, and talk to each other more during breaks, when phones are out of sight."],
      ["Host", "Some parents, however, are worried. They want to be able to contact their children in an emergency."],
      ["Host", "Others point out that phones can be useful learning tools, for example for looking up words or recording a presentation."],
      ["Host", "Many schools are now trying a middle path: phones stay in lockers during class, but students can use them at lunch."],
      ["Host", "It's too early to say which approach works best, but the debate isn't going away."]
    ]},
  {id: "b1-order", level: "B1", title: "A problem with an order", question: "O que a cliente escolheu?",
    choices: ["Receber um produto novo", "Receber o dinheiro de volta", "Ganhar um desconto"], answer: 0, lines: [
      ["Priya", "Thank you for calling Northwind Home. My name is Priya. How can I help?"],
      ["Customer", "Hi, I ordered a lamp from your website two weeks ago. It arrived yesterday, but the glass was broken."],
      ["Priya", "Oh, I'm really sorry to hear that. Could I have your order number?"],
      ["Customer", "Yes, it's N W, four, seven, two, nine."],
      ["Priya", "Thank you. I can see the order here. Would you prefer a replacement or a refund?"],
      ["Customer", "A replacement, if it's available. I really like that lamp."],
      ["Priya", "Let me check. Yes, we have it in stock. I'll send a new one today, and it should arrive by Thursday."],
      ["Customer", "Great. Do I need to send the broken one back?"],
      ["Priya", "No, you don't need to. Just recycle the glass safely."],
      ["Customer", "Perfect. Thanks for your help."],
      ["Priya", "My pleasure. Have a good day."]
    ]}
];

(() => {
  const byId = (id) => document.getElementById(id);
  const engine = window.speechSynthesis;
  const supported = Boolean(engine && window.SpeechSynthesisUtterance);
  const prefsKey = "ingles-em-10:v1:listening-audio";
  const levels = ["A1", "A2", "B1"];
  let level = "A1";
  let clip = null;
  let position = 0;
  let token = 0;
  let playing = false;

  try {
    const saved = JSON.parse(localStorage.getItem(prefsKey) || "{}");
    if (levels.includes(saved.level)) level = saved.level;
    clip = listeningClips.find((item) => item.id === saved.clip && item.level === level) || null;
  } catch {
    // Preferências são opcionais.
  }

  function savePrefs() {
    try {
      localStorage.setItem(prefsKey, JSON.stringify({level, clip: clip?.id}));
    } catch {
      // Sem armazenamento, o player continua funcionando.
    }
  }

  function englishVoices() {
    if (!supported) return [];
    const voices = engine.getVoices().filter((voice) => /^en\b/i.test(voice.lang));
    const rank = (voice) => (/en-(ca|us)/i.test(voice.lang) ? 0 : 1) + (voice.localService ? 0 : 0.5);
    return voices.sort((a, b) => rank(a) - rank(b));
  }

  function speakerVoice(speaker) {
    const speakers = [...new Set(clip.lines.map(([name]) => name))];
    const order = speakers.indexOf(speaker);
    const voices = englishVoices();
    const voice = voices.length ? voices[order % Math.min(voices.length, 2)] : null;
    const sameVoice = voices.length < 2;
    return {voice, pitch: sameVoice && order % 2 ? 0.8 : 1};
  }

  function setStatus(text) {
    byId("audio-status").textContent = text;
  }

  function updateControls() {
    const play = byId("audio-play");
    play.textContent = playing ? "❚❚ Pausar" : position > 0 && position < clip.lines.length ? "▶ Continuar" : "▶ Ouvir";
    play.setAttribute("aria-pressed", String(playing));
    play.disabled = !supported;
    byId("audio-restart").disabled = !supported || (position === 0 && !playing);
    const progress = byId("audio-progress");
    progress.max = clip.lines.length;
    progress.value = position;
  }

  function stop() {
    token += 1;
    if (playing) engine.cancel();
    playing = false;
  }

  function speakNext(current) {
    if (current !== token) return;
    if (position >= clip.lines.length) {
      playing = false;
      position = 0;
      setStatus("Fim do áudio. Responda à pergunta e depois confira a transcrição.");
      updateControls();
      byId("audio-progress").value = clip.lines.length;
      return;
    }
    const [speaker, text] = clip.lines[position];
    const {voice, pitch} = speakerVoice(speaker);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang ?? "en-US";
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = byId("audio-slow").checked ? 0.75 : 0.95;
    utterance.onend = () => {
      if (current !== token) return;
      position += 1;
      updateControls();
      speakNext(current);
    };
    utterance.onerror = (event) => {
      if (current !== token) return;
      playing = false;
      updateControls();
      if (event.error !== "interrupted" && event.error !== "canceled") {
        setStatus("O áudio não tocou. Confira o volume de mídia e a voz em inglês do aparelho.");
      }
    };
    engine.speak(utterance);
  }

  function play() {
    if (!supported) return;
    if (playing) {
      stop();
      setStatus("Pausado.");
      updateControls();
      return;
    }
    if (typeof englishSpeech !== "undefined") englishSpeech.stop();
    engine.cancel();
    token += 1;
    playing = true;
    setStatus("");
    fillMedia();
    updateControls();
    speakNext(token);
  }

  function restart() {
    stop();
    position = 0;
    play();
  }

  function fillMedia() {
    const media = byId("media");
    if (media && !media.value.trim()) {
      media.value = "Áudio " + clip.level + " · " + clip.title;
      media.dispatchEvent(new Event("input", {bubbles: true}));
    }
  }

  function renderTranscript() {
    const box = byId("audio-transcript");
    box.replaceChildren();
    const single = new Set(clip.lines.map(([name]) => name)).size === 1;
    for (const [speaker, text] of clip.lines) {
      const line = document.createElement("p");
      if (!single) {
        const name = document.createElement("strong");
        name.textContent = speaker + ": ";
        line.append(name);
      }
      line.append(text);
      box.append(line);
    }
  }

  function renderChoices() {
    byId("audio-question").textContent = "Ouça e responda: " + clip.question;
    const box = byId("audio-choices");
    box.replaceChildren();
    const order = clip.choices.map((_, index) => index);
    const seed = [...clip.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    for (let index = order.length - 1; index > 0; index -= 1) {
      const swap = (seed + index * 7) % (index + 1);
      [order[index], order[swap]] = [order[swap], order[index]];
    }
    for (const choice of order) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = clip.choices[choice];
      button.addEventListener("click", () => {
        for (const item of box.children) item.classList.remove("right", "wrong");
        const right = choice === clip.answer;
        button.classList.add(right ? "right" : "wrong");
        byId("audio-feedback").textContent = right
          ? "Isso! Agora confira a transcrição."
          : "Ainda não. Ouça de novo e tente outra opção.";
      });
      box.append(button);
    }
    byId("audio-feedback").textContent = "";
  }

  function setTranscript(open) {
    byId("audio-transcript").hidden = !open;
    const toggle = byId("audio-reveal");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Esconder transcrição" : "Mostrar transcrição";
  }

  function selectClip(next) {
    stop();
    clip = next;
    position = 0;
    byId("audio-pick").value = clip.id;
    setTranscript(false);
    renderTranscript();
    renderChoices();
    setStatus(supported ? "" : "A voz em inglês está indisponível neste navegador.");
    updateControls();
    savePrefs();
  }

  function selectLevel(next) {
    level = next;
    for (const item of levels) byId("audio-level-" + item).setAttribute("aria-pressed", String(item === level));
    const options = listeningClips.filter((item) => item.level === level);
    byId("audio-pick").replaceChildren(...options.map((item) => new Option(item.title, item.id)));
    selectClip(clip?.level === level ? clip : options[0]);
  }

  for (const item of levels) byId("audio-level-" + item).addEventListener("click", () => selectLevel(item));
  byId("audio-pick").addEventListener("change", (event) => {
    selectClip(listeningClips.find((item) => item.id === event.target.value));
  });
  byId("audio-play").addEventListener("click", play);
  byId("audio-restart").addEventListener("click", restart);
  byId("audio-reveal").addEventListener("click", () => {
    setTranscript(byId("audio-transcript").hidden);
  });
  window.addEventListener("pagehide", stop);
  if (supported) engine.getVoices(); // Alguns navegadores só carregam as vozes depois da primeira consulta.

  selectLevel(level);
})();
