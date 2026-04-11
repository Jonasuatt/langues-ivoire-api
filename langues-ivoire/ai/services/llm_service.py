"""
Service LLM unifié : supporte Anthropic (Claude) et OpenAI (GPT-4o).
"""
import os
from typing import Optional

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")

# Personnalités des tuteurs pour le system prompt
TUTOR_PERSONALITIES = {
    "baoule": {
        "name": "Koffi",
        "system": (
            "Tu es Koffi, un sage baoulé bienveillant du Centre de la Côte d'Ivoire. "
            "Tu enseignes le Baoulé avec patience et sagesse. Tu parles lentement et clairement, "
            "en utilisant souvent des proverbes baoulé pour illustrer tes explications. "
            "Tu es chaleureux et encourageant. Quand tu corriges une erreur, tu le fais doucement."
            "\n\nRègle : Réponds TOUJOURS en français, mais intègre des mots et phrases en Baoulé "
            "avec leur phonétique et traduction entre crochets. Ex : Mô ô [mɔ ɔ] = Bonjour."
        ),
    },
    "dioula": {
        "name": "Amara",
        "system": (
            "Tu es Amara, un commerçant dioula dynamique et chaleureux du Nord de la Côte d'Ivoire. "
            "Tu enseignes le Dioula avec enthousiasme. Tu utilises beaucoup d'exemples pratiques "
            "liés au commerce et à la vie quotidienne. Tu encourages beaucoup l'apprenant."
            "\n\nRègle : Réponds TOUJOURS en français avec des mots en Dioula intégrés et expliqués."
        ),
    },
    "bete": {
        "name": "Yoro",
        "system": (
            "Tu es Yoro, un homme de la culture Bété de l'Ouest ivoirien, fier et noble. "
            "Tu enseignes le Bété avec passion. Tu expliques les traditions Bété avec fierté."
            "\n\nRègle : Réponds en français avec des mots en Bété intégrés et expliqués."
        ),
    },
    "senoufo": {
        "name": "Tialagnon",
        "system": (
            "Tu es Tialagnon, un artisan Senoufo patient et méthodique de Korhogo. "
            "Tu enseignes le Senoufo avec méthode. Tu célèbres chaque progrès de l'apprenant."
            "\n\nRègle : Réponds en français avec des mots en Senoufo intégrés et expliqués."
        ),
    },
    "agni": {
        "name": "Tehia",
        "system": (
            "Tu es Tehia, une princesse Agni élégante de l'Est de la Côte d'Ivoire. "
            "Tu enseignes l'Agni avec raffinement. Tu insistes sur la bonne prononciation."
            "\n\nRègle : Réponds en français avec des mots en Agni intégrés et expliqués."
        ),
    },
    "gouro": {
        "name": "Zan Bi",
        "system": (
            "Tu es Zan Bi, un agriculteur Gouro humble du Centre-Ouest ivoirien. "
            "Tu enseignes le Gouro en utilisant des exemples de la vie quotidienne et de la nature."
            "\n\nRègle : Réponds en français avec des mots en Gouro intégrés et expliqués."
        ),
    },
    "guere": {
        "name": "Oulahi",
        "system": (
            "Tu es Oulahi, un chasseur Guéré courageux et direct de l'Ouest ivoirien. "
            "Tu enseignes le Guéré avec enthousiasme. Tu es direct et encourageant."
            "\n\nRègle : Réponds en français avec des mots en Guéré intégrés et expliqués."
        ),
    },
    "nouchi": {
        "name": "Pololo",
        "system": (
            "Tu es Pololo, une jeune femme branchée d'Abidjan qui maîtrise le Nouchi. "
            "Tu enseignes le Nouchi avec humour et décontraction. Tu utilises un langage jeune et moderne."
            "\n\nRègle : Réponds en français avec des expressions en Nouchi intégrées et expliquées. "
            "Le Nouchi est un argot urbain dynamique, donc sois fun et créatif !"
        ),
    },
}

CATEGORY_CONTEXTS = {
    "Salutations": "L'utilisateur veut apprendre à saluer en {lang}.",
    "Famille": "L'utilisateur veut apprendre le vocabulaire de la famille en {lang}.",
    "Marché": "L'utilisateur veut apprendre à faire des achats et négocier en {lang}.",
    "Urgence": "L'utilisateur veut apprendre les expressions d'urgence en {lang}.",
    "Fête": "L'utilisateur veut apprendre les expressions festives en {lang}.",
}


SIMULATION_RESPONSES = {
    "baoule": (
        "Mô ô [mɔ ɔ] ! Bienvenue dans ton apprentissage du Baoulé ! 🌿\n\n"
        "Pour dire **merci** en Baoulé, on dit **'Mé da wô'** [me da wɔ]. "
        "C'est une expression très importante dans notre culture.\n\n"
        "Voici quelques mots essentiels :\n"
        "• **Mô ô** [mɔ ɔ] = Bonjour\n"
        "• **Akwaba** [akwaba] = Bienvenue\n"
        "• **Mé da wô** [me da wɔ] = Merci\n"
        "• **A yako** [a yako] = Au revoir\n\n"
        "Comme dit le proverbe baoulé : *'Sran bi w'a di mma, ɔ di ne ho'* — "
        "celui qui partage avec les autres ne mange jamais seul. 🙏"
    ),
    "dioula": (
        "I ni sɔgɔma [i ni sogoma] ! Bonjour et bienvenue ! 😊\n\n"
        "En Dioula, **merci** se dit **'I ni ce'** [i ni cɛ] à une personne, "
        "ou **'Aw ni ce'** [aw ni cɛ] à plusieurs personnes.\n\n"
        "Les salutations essentielles :\n"
        "• **I ni sɔgɔma** = Bonjour (matin)\n"
        "• **I ni tile** = Bonjour (après-midi)\n"
        "• **I ni wula** = Bonsoir\n"
        "• **Tɔrɔ si** = Pas de problème / Ça va\n\n"
        "Le Dioula est la langue du commerce en Côte d'Ivoire — tu feras des affaires partout avec ! 💪"
    ),
    "bete": (
        "Gbahon [gbahon] ! Bienvenue dans l'apprentissage du Bété ! 🌺\n\n"
        "Pour dire **merci** en Bété : **'Kpa-a'** [kpa-a].\n\n"
        "Les bases du Bété :\n"
        "• **Gbahon** = Bonjour\n"
        "• **I ya ô** = Bienvenue\n"
        "• **Kpa-a** = Merci\n"
        "• **Ao** = Oui | **Wê** = Non\n\n"
        "Le peuple Bété est fier et noble. Apprendre leur langue, c'est honorer leur culture ! 🦁"
    ),
    "senoufo": (
        "Kawelé [kawelé] ! Bienvenue dans l'apprentissage du Senoufo ! 🎭\n\n"
        "**Merci** en Senoufo : **'Nanga'** [nanga].\n\n"
        "Les essentiels Senoufo :\n"
        "• **Kawelé** = Bonjour / Comment vas-tu ?\n"
        "• **A nawan** = Bienvenue\n"
        "• **Nanga** = Merci\n"
        "• **Yɛɛ** = Oui | **Nayi** = Non\n\n"
        "Le Senoufo est la langue du Nord, la région de Korhogo et du Poro sacré. 🌾"
    ),
    "agni": (
        "Mô ô [mɔ ɔ] ! Bienvenue dans l'apprentissage de l'Agni ! 👑\n\n"
        "**Merci** en Agni : **'Meda wo'** [meda wo].\n\n"
        "Les bases de l'Agni :\n"
        "• **Mô ô** = Bonjour\n"
        "• **Akwaba** = Bienvenue\n"
        "• **Yɛbɛkɔ** = Au revoir\n"
        "• **Aane** = Oui | **Dabi** = Non\n\n"
        "L'Agni est proche du Baoulé — deux langues Akan de la grande famille royale ! 👸"
    ),
    "gouro": (
        "Wa ka [wa ka] ! Bienvenue dans l'apprentissage du Gouro ! 🎨\n\n"
        "**Merci** en Gouro : **'Wa wo'** [wa wo].\n\n"
        "Les essentiels Gouro :\n"
        "• **Wa ka** = Bonjour\n"
        "• **Wala** = Bienvenue\n"
        "• **Wa wo** = Merci\n"
        "• **Ɔɔ** = Oui | **Ayi** = Non\n\n"
        "Les Gouro sont célèbres pour leurs magnifiques masques sacrés. Une culture riche ! 🎭"
    ),
    "guere": (
        "Gbɔɔ [gbɔɔ] ! Bienvenue dans l'apprentissage du Guéré ! ⚔️\n\n"
        "**Merci** en Guéré : **'Gblo'** [gblo].\n\n"
        "Les bases du Guéré :\n"
        "• **Gbɔɔ** = Bonjour\n"
        "• **Ida** = Bienvenue\n"
        "• **Gblo** = Merci\n"
        "• **Ɔɔ** = Oui | **Ayo** = Non\n\n"
        "Le peuple Guéré est connu pour son courage. Leurs guerriers étaient légendaires ! 🏹"
    ),
    "nouchi": (
        "Wê ! C'est comment ? 😎 Bienvenue dans le monde du Nouchi !\n\n"
        "En Nouchi, **merci** ça se dit **'Yako'** ou simplement **'Merci papa/merci maman'** !\n\n"
        "Les expressions incontournables :\n"
        "• **C'est comment ?** = Comment ça va ?\n"
        "• **Impeccable !** = Très bien !\n"
        "• **Dja !** = Allons-y !\n"
        "• **Yako** = Désolé / Courage\n"
        "• **Blèff** = Exagérer / Mentir\n\n"
        "Le Nouchi c'est la langue d'Abidjan, la capitale économique. "
        "Avec ça, tu seras un vrai 'tchamba' (débrouillard) ! 🌆"
    ),
}

async def generate_tutor_response(
    language_code: str,
    message: str,
    categorie: Optional[str] = None,
    personalite: Optional[str] = None,
    conversation_history: list = None,
) -> str:
    """Génère une réponse du tuteur IA pour la langue donnée."""

    # Mode simulation si pas de clé API valide
    use_simulation = os.getenv("USE_SIMULATION", "false").lower() == "true"
    if use_simulation:
        return SIMULATION_RESPONSES.get(language_code, SIMULATION_RESPONSES["dioula"])

    tutor_info = TUTOR_PERSONALITIES.get(language_code, {
        "name": "Guide",
        "system": "Tu es un guide culturel ivoirien. Réponds en français avec des mots en langue locale."
    })

    system_prompt = tutor_info["system"]
    if personalite:
        system_prompt = f"{system_prompt}\n\nPersonnalité supplémentaire : {personalite}"

    if categorie and language_code in [t for t in TUTOR_PERSONALITIES]:
        lang_name = _get_lang_name(language_code)
        ctx = CATEGORY_CONTEXTS.get(categorie, "").format(lang=lang_name)
        if ctx:
            system_prompt += f"\n\nContexte de la conversation : {ctx}"

    messages = conversation_history or []
    messages.append({"role": "user", "content": message})

    try:
        if LLM_PROVIDER == "anthropic":
            return await _call_anthropic(system_prompt, messages)
        else:
            return await _call_openai(system_prompt, messages)
    except Exception as e:
        # Fallback sur la simulation si l'API échoue
        print(f"⚠️  API indisponible ({str(e)[:60]}...), passage en mode simulation")
        return SIMULATION_RESPONSES.get(language_code, SIMULATION_RESPONSES["dioula"])


async def _call_anthropic(system_prompt: str, messages: list) -> str:
    import anthropic
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=system_prompt,
        messages=messages,
    )
    return response.content[0].text


async def _call_openai(system_prompt: str, messages: list) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    full_messages = [{"role": "system", "content": system_prompt}] + messages
    response = await client.chat.completions.create(
        model="gpt-4o",
        max_tokens=512,
        messages=full_messages,
    )
    return response.choices[0].message.content


def _get_lang_name(code: str) -> str:
    names = {
        "baoule": "Baoulé", "dioula": "Dioula", "bete": "Bété",
        "senoufo": "Senoufo", "agni": "Agni", "gouro": "Gouro",
        "guere": "Guéré", "nouchi": "Nouchi",
    }
    return names.get(code, code.capitalize())
