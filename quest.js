window.MARIA_QUEST = {
  "title": "Towards the Sun: The Twelfth Chapter",
  "subtitle": "Maria's Escape Halloween Game",
  "opening": {
    "heading": "Your invitation has reached the Archive",
    "text": [
      "Maria, your invitation said birthday party. Someone has added a line beneath it: THE TWELFTH CHAPTER IS READY.",
      "On 31 October, when the stories on a bookshelf lean close enough to whisper, a door appears between their pages. Beyond it lies the Midnight Archive: a place that keeps chapters which have not happened yet.",
      "Tonight, one book has opened for you. Its cover carries your name. Inside, a clock stands at 23:48. The next twelve minutes belong to you and the friends who came with you. This is the Archive's story clock; your team can take all the time it needs.",
      "A page turns by itself. Five marks glow in the paper: a compass, a lantern, a bridge, a map and a sun. Then a message appears.",
      "I am the Keeper of Unwritten Things. I have sealed your twelfth chapter behind the Dawn Gate. Follow the clues, recover all five sun seals, and bring them to the gate. Each will matter. Your friends have been invited because this chapter needs more than one voice.",
      "Somewhere ahead, the Archive is holding a birthday surprise. Your first clue is waiting in a place you already know."
    ],
    "first_search": "Find the word standing beside the pumpkin on Maria's bookshelf. It is not printed on a book spine. Two different letters in that word appear twice. Look behind the repeated letter nearest the pumpkin. Take envelope I.",
    "first_search_hints": [
      "Look for a word made from separate white letters beside the pumpkin.",
      "The word is THRILLER. Both L and R appear twice.",
      "Look behind the R at the right-hand end of THRILLER."
    ]
  },
  "seals": [
    {
      "symbol": "MAP",
      "letter": "N",
      "digit": "4",
      "envelope": "I"
    },
    {
      "symbol": "SUN",
      "letter": "E",
      "digit": "9",
      "envelope": "II"
    },
    {
      "symbol": "COMPASS",
      "letter": "S",
      "digit": "7",
      "envelope": "III"
    },
    {
      "symbol": "BRIDGE",
      "letter": "I",
      "digit": "1",
      "envelope": "IV"
    },
    {
      "symbol": "LANTERN",
      "letter": "H",
      "digit": "3",
      "envelope": "V"
    }
  ],
  "stages": [
    {
      "id": "court",
      "number": "I",
      "title": "The Court of Exact Words",
      "answer": "SUN",
      "accepted_answers": [
        "SUN"
      ],
      "seal": "MAP",
      "screen_text": "The first door has three keyholes: MOON, RAVEN and SUN. Three ink courtiers have left statements. Exactly one statement is true; the other two are false. Share the cards, test each possible key, and enter the name of the key that fits the rule.",
      "cards": [
        {
          "heading": "COURT RULES",
          "body": "There are three possible keys: MOON, RAVEN and SUN. Exactly ONE of the three statements below is true. The other TWO statements are false. Which key opens the door?"
        },
        {
          "heading": "INK",
          "body": "The key is MOON."
        },
        {
          "heading": "ASH",
          "body": "The key is not MOON."
        },
        {
          "heading": "THORN",
          "body": "The key is not SUN."
        }
      ],
      "hints": [
        "Choose one possible key at a time. Count how many statements would be true.",
        "INK and ASH say opposite things, so exactly one of those two is always true.",
        "THORN must therefore be false. So the key is SUN."
      ],
      "success_text": "The SUN key turns. The courtiers become thin lines of ink, and the first door opens. Keep the MAP seal from envelope I. The Keeper writes: A court always offers its visitors a seat. Find the chair marked MOON. Envelope II is taped beneath its seat."
    },
    {
      "id": "mirror",
      "number": "II",
      "title": "The Clock Beyond the Glass",
      "answer": "0000",
      "accepted_answers": [
        "0000",
        "00:00"
      ],
      "seal": "SUN",
      "screen_text": "A corridor opens on the other side of a sheet of glass. Its clock can be read only from the world behind it. Use the small mirror to read the page in envelope II. Work out the new time, then enter four digits in 24-hour time, without a colon. Keep any zeros at the beginning.",
      "mirror_lines": [
        "THE CLOCK READS 23:48.",
        "ADD MARIA'S TWELVE MINUTES.",
        "ENTER THE NEW TIME AS FOUR DIGITS.",
        "USE 24-HOUR TIME, WITH NO COLON."
      ],
      "hints": [
        "Let one person hold the page and another hold the mirror. Read the reflection line by line.",
        "There are twelve minutes between 23:48 and midnight.",
        "In 24-hour time, midnight at the start of the next day is 00:00. Remove the colon, keeping all four zeros."
      ],
      "success_text": "For one instant the clock strikes midnight. Then its hands become a thin gold line pointing ahead. Keep the SUN seal. The next witness was sitting comfortably: find the sofa cushion marked with a STAR. Envelope III is behind that cushion."
    },
    {
      "id": "case",
      "number": "III",
      "title": "The Visitor With the Missing Key",
      "answer": "ASH",
      "accepted_answers": [
        "ASH"
      ],
      "seal": "COMPASS",
      "screen_text": "Six visitors passed through the Archive. One carried the missing key. The visitors' names are aliases, and their records look almost identical. Each witness remembers a different detail. Give the five evidence cards to different people or pairs. Read every observation aloud, compare them with the case file, and enter the alias of the only visitor who matches all five.",
      "case_columns": [
        "VISITOR",
        "ARRIVAL",
        "DOOR",
        "RIBBON",
        "SEAL",
        "PAPER"
      ],
      "case_rows": [
        [
          "ASH",
          "14:06",
          "EAST",
          "BLUE",
          "SUN",
          "DRY"
        ],
        [
          "BRIAR",
          "14:09",
          "EAST",
          "BLUE",
          "SUN",
          "DRY"
        ],
        [
          "CORIN",
          "14:06",
          "WEST",
          "BLUE",
          "SUN",
          "DRY"
        ],
        [
          "EMBER",
          "14:06",
          "EAST",
          "RED",
          "SUN",
          "DRY"
        ],
        [
          "FINCH",
          "14:06",
          "EAST",
          "BLUE",
          "MOON",
          "DRY"
        ],
        [
          "LARK",
          "14:06",
          "EAST",
          "BLUE",
          "SUN",
          "WET"
        ]
      ],
      "evidence": [
        {
          "heading": "WITNESS A - THE CLOCK",
          "body": "The visitor arrived exactly six minutes after two in the afternoon."
        },
        {
          "heading": "WITNESS B - THE DOOR",
          "body": "The visitor entered through the EAST door."
        },
        {
          "heading": "WITNESS C - THE RIBBON",
          "body": "The visitor's ribbon was BLUE."
        },
        {
          "heading": "WITNESS D - THE SEAL",
          "body": "The visitor's paper carried a SUN seal, not a MOON seal."
        },
        {
          "heading": "WITNESS E - THE PAPER",
          "body": "The visitor's paper was completely DRY."
        }
      ],
      "hints": [
        "Start by translating the time into the format used in the case file.",
        "The five details are 14:06, EAST, BLUE, SUN and DRY. Cross out any row that misses even one detail.",
        "BRIAR misses the time; CORIN the door; EMBER the ribbon; FINCH the seal; LARK the paper. One visitor remains."
      ],
      "success_text": "ASH leaves a key-shaped gap in the ink, and a hidden drawer slides open. Keep the COMPASS seal. A map is waiting where a story can rest: find the closed book marked with a SUN on the table. Envelope IV is underneath that book."
    },
    {
      "id": "map",
      "number": "IV",
      "title": "The Map With No Footprints",
      "answer": "FOX",
      "accepted_answers": [
        "FOX"
      ],
      "seal": "BRIDGE",
      "screen_text": "The map belongs to the Archive, not to your house. Lay it flat with NORTH at the top. Begin in LIBRARY. Give the route cards to different players and read them in numbered order. Move one square at a time; for a two-square move, pass through the square in between. Enter the name of the place where you finish.",
      "map_rows": [
        [
          "TOWER",
          "CHAIR",
          "SUN"
        ],
        [
          "FOX",
          "LIBRARY",
          "MOON"
        ],
        [
          "KEY",
          "MIRROR",
          "RAVEN"
        ]
      ],
      "route": [
        {
          "heading": "ROUTE 1",
          "body": "From LIBRARY, move one square EAST.",
          "direction": "EAST",
          "steps": 1
        },
        {
          "heading": "ROUTE 2",
          "body": "From there, move one square NORTH.",
          "direction": "NORTH",
          "steps": 1
        },
        {
          "heading": "ROUTE 3",
          "body": "From there, move two squares WEST.",
          "direction": "WEST",
          "steps": 2
        },
        {
          "heading": "ROUTE 4",
          "body": "From there, move one square SOUTH.",
          "direction": "SOUTH",
          "steps": 1
        }
      ],
      "hints": [
        "EAST is right, NORTH is up, WEST is left and SOUTH is down.",
        "The first two moves take you from LIBRARY to MOON, then to SUN.",
        "Two squares west from SUN reaches TOWER. One square south from TOWER reaches FOX."
      ],
      "success_text": "The path glows beneath your fingers. Keep the BRIDGE seal. Its final word belongs in Maria's room as well as on the map. Find the brown-and-white plush fox on the bookshelf. Envelope V is tucked just behind it.",
      "fallback_success_text": "The path glows beneath your fingers. Keep the BRIDGE seal. Find the soft toy marked FOX. Envelope V is just behind it."
    },
    {
      "id": "embers",
      "number": "V",
      "title": "Twelve Sparks Before Dawn",
      "answer": "426",
      "accepted_answers": [
        "426",
        "4 2 6",
        "4-2-6"
      ],
      "seal": "LANTERN",
      "screen_text": "The Keeper has saved twelve sparks, one for each of Maria's twelve years. Three beacons must be lit: DAWN, DAY and DUSK. Use all twelve paper sparks. Each spark counts as one, and every beacon needs at least one. Share the sparks so every player places at least one. Work out the only arrangement that satisfies all three beacon cards. Enter the three counts in the order DAWN, DAY, DUSK, with no spaces.",
      "spark_count": 12,
      "beacons": [
        {
          "heading": "DAWN",
          "body": "I need exactly TWO MORE sparks than DAY."
        },
        {
          "heading": "DAY",
          "body": "I need at least ONE spark. All three beacons together must use all TWELVE sparks."
        },
        {
          "heading": "DUSK",
          "body": "I need exactly THREE TIMES as many sparks as DAY."
        }
      ],
      "hints": [
        "Try putting one spark on DAY, then give DAWN two more and DUSK three times that many. How many sparks have you used?",
        "If DAY has one, the counts are 3, 1 and 3: seven sparks. Try DAY with two.",
        "DAY has 2, DAWN has 4 and DUSK has 6. In the required DAWN-DAY-DUSK order, enter 426."
      ],
      "success_text": "All three beacons catch the same golden light. Keep the LANTERN seal: you now have all five. Return to the Keeper with every sun seal. Ask for the Dawn Gate card, and lay the five seals on a clear table."
    }
  ],
  "gate": {
    "number": "VI",
    "title": "The Dawn Gate",
    "answer": "73149",
    "accepted_answers": [
      "73149",
      "7 3 1 4 9",
      "7-3-1-4-9"
    ],
    "screen_text": "Five sun seals fit five spaces in the Dawn Gate. They did not arrive in the right order. Read the gate's four rules and arrange all five seals from left to right. Then read their DIGITS from left to right and enter the five-digit code. Once the gate opens, read the LETTERS as well.",
    "rules": [
      "COMPASS is first.",
      "SUN is last.",
      "BRIDGE comes immediately after LANTERN.",
      "MAP comes after BRIDGE."
    ],
    "hints": [
      "Place COMPASS at the far left and SUN at the far right. Three spaces remain.",
      "LANTERN and BRIDGE must stay together in that order. MAP must be somewhere after BRIDGE.",
      "The order is COMPASS, LANTERN, BRIDGE, MAP, SUN. Read the digits, not the letters, to open the gate."
    ],
    "requires_all_stages": [
      "court",
      "mirror",
      "case",
      "map",
      "embers"
    ],
    "card_heading": "VI - THE DAWN GATE",
    "card_instruction": "Arrange every sun seal from left to right. Follow all four rules. Enter the five DIGITS; read the LETTERS after the gate opens."
  },
  "finale": {
    "heading": "Chapter Twelve Is Yours",
    "text": [
      "The five seals settle into place. Their letters form one word: SHINE.",
      "A line of sunlight appears along the edge of the book. The ink shadows fold themselves into ordinary words. The Archive's last door opens, and the Keeper speaks one final time.",
      "Maria, the twelfth chapter was never a story I could write for you. I could prepare the first page. Your friends could help you reach it. What happens next belongs to you.",
      "Tonight, you noticed what others missed, listened to different voices, changed your mind when the evidence asked you to, and brought every seal back together. That is how new chapters begin.",
      "Happy twelfth birthday, Maria. May your next chapter be full of people who understand you, stories that surprise you, and adventures worth sharing.",
      "And to everyone who crossed the Archive with her: you are already part of that chapter.",
      "Maria, ask the Keeper for the envelope marked FINAL. Your birthday surprise is waiting with your host."
    ],
    "keepsake_title": "MARIA - CHAPTER TWELVE",
    "keepsake_subtitle": "31 October 2026",
    "keepsake_prompt": "One adventure I hope we share this year...",
    "keepsake_closing": "The next chapter belongs to you."
  }
};
