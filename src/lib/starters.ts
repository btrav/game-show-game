import type { Board } from "../types"

type StarterClue = [prompt: string, answer: string]
type StarterCategory = [title: string, clues: [StarterClue, StarterClue, StarterClue, StarterClue, StarterClue]]
type StarterBoard = {
  slug: string
  title: string
  description: string
  categories: [StarterCategory, StarterCategory, StarterCategory, StarterCategory, StarterCategory, StarterCategory]
}

const STARTERS: StarterBoard[] = [
  {
    slug: "geography",
    title: "Around the World in 30 Clues",
    description: "Capitals, rivers, borders, islands, peaks, and the strange shapes of nations.",
    categories: [
      [
        "WORLD CAPITALS",
        [
          ["This Australian capital was a planned compromise between rival cities Sydney and Melbourne.", "What is Canberra?"],
          ["Sitting at over 3,600 meters, this Bolivian seat of government is the highest capital city in the world.", "What is La Paz?"],
          ["This West African nation moved its capital from Lagos to a more central, planned city in 1991.", "What is Abuja?"],
          ["Kazakhstan renamed its capital to this in 2019 to honor its long-serving first president, then quietly reverted in 2022.", "What is Nur-Sultan?"],
          ["This Pacific island nation's capital sits on the atoll of South Tarawa, a single coral ring barely above sea level.", "What is Tarawa, Kiribati?"],
        ],
      ],
      [
        "RIVERS & LAKES",
        [
          ["This river runs through ten countries before emptying into the Black Sea, more than any other in the world.", "What is the Danube?"],
          ["Straddling Peru and Bolivia, this is the highest navigable lake in the world.", "What is Lake Titicaca?"],
          ["This Russian river, the longest in Europe, drains into the Caspian Sea rather than an open ocean.", "What is the Volga?"],
          ["This Central Asian lake has shrunk by more than 90 percent since the 1960s due to Soviet-era irrigation diversions.", "What is the Aral Sea?"],
          ["Forming much of the border between Argentina and Uruguay, this river's name in Guarani means 'river of the painted birds.'", "What is the Uruguay River?"],
        ],
      ],
      [
        "ISLANDS",
        [
          ["The world's largest island, it's an autonomous territory of Denmark.", "What is Greenland?"],
          ["This island nation off the southeast coast of Africa is home to lemurs found nowhere else on Earth.", "What is Madagascar?"],
          ["Shared by Haiti and the Dominican Republic, this is the second most populous island in the Caribbean.", "What is Hispaniola?"],
          ["This remote British overseas territory in the South Atlantic is one of the most isolated inhabited islands on Earth, over 2,400 km from any neighbor.", "What is Tristan da Cunha?"],
          ["This island in Southeast Asia is split three ways between Indonesia, Malaysia, and the tiny sultanate of Brunei.", "What is Borneo?"],
        ],
      ],
      [
        "MOUNTAIN RANGES",
        [
          ["Running roughly 7,000 km down the western edge of South America, this is the world's longest continental mountain range.", "What are the Andes?"],
          ["This range forms a traditional boundary between Europe and Asia, running north to south through Russia.", "What are the Ural Mountains?"],
          ["This North African range stretches across Morocco, Algeria, and Tunisia and shares its name with a Greek titan.", "What are the Atlas Mountains?"],
          ["The Karakoram range, home to K2, sits at the meeting point of three countries: Pakistan, China, and this third nation.", "What is India?"],
          ["This range along the Czech-Polish border contains Snezka, the highest peak in the Czech Republic, and is home to the folkloric mountain spirit Krakonos.", "What are the Krkonose (Giant Mountains)?"],
        ],
      ],
      [
        "BORDER ODDITIES",
        [
          ["The world's longest undefended border runs between these two countries.", "What are the United States and Canada?"],
          ["This double-landlocked country in Central Asia borders only Kazakhstan, Turkmenistan, Tajikistan, Kyrgyzstan, and Afghanistan.", "What is Uzbekistan?"],
          ["This tiny European country is co-ruled by a French president and a Spanish bishop, the last surviving co-principality in the world.", "What is Andorra?"],
          ["Llivia, a Spanish town entirely surrounded by France, became an exclave thanks to this 1659 treaty that handed nearby villages to France but spared towns.", "What is the Treaty of the Pyrenees?"],
          ["Until a 2015 land swap, this region between India and Bangladesh contained third-order enclaves: a piece of India inside a piece of Bangladesh inside a piece of India.", "What is Cooch Behar (or the Indo-Bangladesh enclaves)?"],
        ],
      ],
      [
        "COUNTRIES BY SHAPE",
        [
          ["Often described as boot-shaped, this country kicks the island of Sicily into the Mediterranean.", "What is Italy?"],
          ["This South American country is so long and narrow it spans 38 degrees of latitude but averages just 177 km wide.", "What is Chile?"],
          ["This Southeast Asian country is often compared to an elephant's head, with a long trunk extending down the Malay Peninsula.", "What is Thailand?"],
          ["This African nation is shaped like a long, thin sliver wrapped around the Gambia River, almost entirely enclosed by Senegal.", "What is The Gambia?"],
          ["This Central Asian country is famous for its odd panhandle, the Wakhan Corridor, deliberately created in the 19th century to separate the Russian and British empires.", "What is Afghanistan?"],
        ],
      ],
    ],
  },
  {
    slug: "history",
    title: "History Through the Ages",
    description: "Six eras and continents, from ancient empires to modern revolutions.",
    categories: [
      [
        "ANCIENT CIVILIZATIONS",
        [
          ["This Egyptian queen, the last active ruler of the Ptolemaic Kingdom, allied herself with both Julius Caesar and Mark Antony.", "Who is Cleopatra?"],
          ["This code of 282 laws, carved on a basalt stele around 1750 BCE, famously prescribed 'an eye for an eye' justice in Mesopotamia.", "What is the Code of Hammurabi?"],
          ["After defeating the Persians at the Battle of Gaugamela in 331 BCE, this Macedonian king extended his empire from Greece to the Indus River.", "Who is Alexander the Great?"],
          ["This Chinese emperor unified the warring states in 221 BCE, standardized weights and writing, and was buried with an army of terracotta soldiers.", "Who is Qin Shi Huang?"],
          ["This West African empire, centered on Timbuktu and ruled by Mansa Musa, grew fabulously wealthy from controlling trans-Saharan gold and salt trade in the 14th century.", "What is the Mali Empire?"],
        ],
      ],
      [
        "REVOLUTIONS",
        [
          ["This 1789 storming of a Parisian prison is celebrated as the symbolic start of the French Revolution.", "What is the storming of the Bastille?"],
          ["Lenin and the Bolsheviks seized power from the Provisional Government in this 1917 revolution, named for the month it occurred on the Julian calendar.", "What is the October Revolution?"],
          ["This 1791 uprising of enslaved people, led by figures like Toussaint Louverture, resulted in the first independent Black republic in the Americas.", "What is the Haitian Revolution?"],
          ["Mao Zedong proclaimed the founding of the People's Republic of China in this year, after defeating the Nationalist forces of Chiang Kai-shek.", "What is 1949?"],
          ["This 1979 revolution overthrew Shah Mohammad Reza Pahlavi and brought Ayatollah Khomeini to power, transforming Iran into an Islamic Republic.", "What is the Iranian Revolution?"],
        ],
      ],
      [
        "WORLD LEADERS",
        [
          ["This British prime minister rallied his nation through the Blitz with speeches promising 'blood, toil, tears and sweat.'", "Who is Winston Churchill?"],
          ["Imprisoned for 27 years on Robben Island, this leader became South Africa's first Black president in 1994.", "Who is Nelson Mandela?"],
          ["This Indian leader's Salt March of 1930 challenged British colonial rule through mass civil disobedience.", "Who is Mahatma Gandhi?"],
          ["Crowned in 1762, this German-born empress expanded Russia's borders to the Black Sea and corresponded with Voltaire about Enlightenment ideas.", "Who is Catherine the Great?"],
          ["This Mongol general, born Temujin, united the steppe tribes around 1206 and founded the largest contiguous land empire in history.", "Who is Genghis Khan?"],
        ],
      ],
      [
        "WARS & BATTLES",
        [
          ["Triggered by the assassination of Archduke Franz Ferdinand in 1914, this conflict was once called 'the war to end all wars.'", "What is World War I?"],
          ["This 1815 battle in present-day Belgium ended Napoleon's Hundred Days return and sent him into final exile on Saint Helena.", "What is the Battle of Waterloo?"],
          ["This three-day 1863 engagement in Pennsylvania is often called the turning point of the American Civil War.", "What is the Battle of Gettysburg?"],
          ["This 1588 naval defeat, scattered by storms and English fireships, ended Philip II's attempt to invade Elizabethan England.", "What is the Spanish Armada?"],
          ["This 1571 naval clash, where a Holy League fleet defeated the Ottomans off the coast of Greece, ended Ottoman dominance in the Mediterranean.", "What is the Battle of Lepanto?"],
        ],
      ],
      [
        "INVENTIONS & DISCOVERIES",
        [
          ["Around 1440, this German developed the movable-type printing press in Mainz, making mass-produced books possible in Europe.", "Who is Johannes Gutenberg?"],
          ["This Scottish bacteriologist's 1928 observation of mold killing bacteria in a petri dish led to the first widely used antibiotic.", "Who is Alexander Fleming?"],
          ["Watson and Crick published the double-helix structure of this molecule in 1953, relying heavily on Rosalind Franklin's X-ray images.", "What is DNA?"],
          ["This Englishwoman's 1843 notes on Charles Babbage's Analytical Engine are often considered the first computer program.", "Who is Ada Lovelace?"],
          ["This Polish-born astronomer's 1543 book 'De revolutionibus' placed the Sun, not the Earth, at the center of the known universe.", "Who is Nicolaus Copernicus?"],
        ],
      ],
      [
        "EMPIRES & DYNASTIES",
        [
          ["At its height under Trajan in 117 CE, this Mediterranean empire stretched from Britain to Mesopotamia.", "What is the Roman Empire?"],
          ["Mehmed II's 1453 capture of Constantinople ended the Byzantine Empire and cemented the rise of this Turkish empire.", "What is the Ottoman Empire?"],
          ["This Chinese dynasty (1368 to 1644) built most of the Great Wall as we know it today and sent Admiral Zheng He on voyages across the Indian Ocean.", "What is the Ming Dynasty?"],
          ["Hernan Cortes brought down this Mesoamerican empire and its capital Tenochtitlan in 1521, exploiting alliances with rival peoples and the spread of smallpox.", "What is the Aztec Empire?"],
          ["Founded by Babur in 1526 and reaching its cultural peak under Shah Jahan, builder of the Taj Mahal, this empire ruled most of the Indian subcontinent.", "What is the Mughal Empire?"],
        ],
      ],
    ],
  },
  {
    slug: "film",
    title: "Lights, Camera, Jeopardy",
    description: "Best Picture winners, animated classics, and lines you've quoted at parties.",
    categories: [
      [
        "BEST PICTURE WINNERS",
        [
          ["This 1997 epic about a doomed ocean liner tied the record with 11 Oscar wins, including Best Picture.", "What is Titanic?"],
          ["Bong Joon-ho's 2019 dark comedy became the first non-English language film to win Best Picture.", "What is Parasite?"],
          ["This 1994 Tom Hanks film about a slow-witted Alabama man who keeps stumbling into history beat out Pulp Fiction for Best Picture.", "What is Forrest Gump?"],
          ["Set during WWI, Sam Mendes's 2019 film was shot to look like one continuous take but lost Best Picture to Parasite.", "What is 1917?"],
          ["This 1955 Ernest Borgnine drama about a lonely Bronx butcher is the shortest film ever to win Best Picture, clocking in at 90 minutes.", "What is Marty?"],
        ],
      ],
      [
        "QUOTABLE QUOTES",
        [
          ["'I'll be back.'", "What is The Terminator?"],
          ["'You can't handle the truth!'", "What is A Few Good Men?"],
          ["'I feel the need... the need for speed.'", "What is Top Gun?"],
          ["'Get busy living, or get busy dying.'", "What is The Shawshank Redemption?"],
          ["'I have always depended on the kindness of strangers.'", "What is A Streetcar Named Desire?"],
        ],
      ],
      [
        "DIRECTORS' CHAIR",
        [
          ["This Steven directed Jaws, E.T., and Jurassic Park before finally winning Best Director for Schindler's List.", "Who is Steven Spielberg?"],
          ["She became the first woman to win the Best Director Oscar for The Hurt Locker in 2010.", "Who is Kathryn Bigelow?"],
          ["This Quentin made his feature debut with 1992's Reservoir Dogs and has said he plans to retire after his 10th film.", "Who is Quentin Tarantino?"],
          ["Known for The Royal Tenenbaums and The Grand Budapest Hotel, this Texan's films are famous for symmetrical framing and pastel palettes.", "Who is Wes Anderson?"],
          ["This Hong Kong auteur directed In the Mood for Love and Chungking Express, often working with cinematographer Christopher Doyle.", "Who is Wong Kar-wai?"],
        ],
      ],
      [
        "PIXAR & DISNEY ANIMATION",
        [
          ["Woody and Buzz Lightyear first squabbled over Andy's affection in this 1995 film, Pixar's feature debut.", "What is Toy Story?"],
          ["In this 2003 Pixar film, a clownfish named Marlin crosses the ocean to rescue his son from a Sydney dentist's aquarium.", "What is Finding Nemo?"],
          ["This 2013 Disney musical, loosely based on Hans Christian Andersen's 'The Snow Queen,' launched a thousand karaoke renditions of 'Let It Go.'", "What is Frozen?"],
          ["The first four minutes of this 2009 Pixar film silently chronicle Carl and Ellie's entire marriage before Carl ties balloons to his house.", "What is Up?"],
          ["Released in 1986, this Disney film about a young detective mouse in Victorian London was the studio's animation comeback after The Black Cauldron flopped.", "What is The Great Mouse Detective?"],
        ],
      ],
      [
        "SEQUELS & SAGAS",
        [
          ["In this 1980 sequel, Darth Vader drops the biggest paternity bombshell in cinema history on Luke Skywalker.", "What is The Empire Strikes Back?"],
          ["Tom Cruise's Pete Mitchell returned to the cockpit 36 years later in this 2022 blockbuster sequel.", "What is Top Gun: Maverick?"],
          ["Widely considered better than the original, this 1974 Coppola sequel intercuts young Vito Corleone's rise with Michael's reign.", "What is The Godfather Part II?"],
          ["This 1991 James Cameron sequel introduced the shape-shifting T-1000 and pioneered liquid-metal CGI effects.", "What is Terminator 2: Judgment Day?"],
          ["George Miller's 2015 fourth entry in his post-apocalyptic series stars Charlize Theron as Imperator Furiosa alongside Tom Hardy.", "What is Mad Max: Fury Road?"],
        ],
      ],
      [
        "INTERNATIONAL CINEMA",
        [
          ["Guillermo del Toro's 2006 Spanish-language dark fantasy follows a young girl into a labyrinth during Franco's Spain.", "What is Pan's Labyrinth?"],
          ["Ang Lee's 2000 wuxia film features rooftop sword fights and a stolen Green Destiny blade.", "What is Crouching Tiger, Hidden Dragon?"],
          ["This 1948 Vittorio De Sica neorealist classic follows a father and son searching post-war Rome for a stolen two-wheeler.", "What is Bicycle Thieves?"],
          ["Akira Kurosawa's 1954 epic about villagers hiring sword-for-hire defenders was remade in Hollywood as The Magnificent Seven.", "What is Seven Samurai?"],
          ["This 1966 Gillo Pontecorvo film about Algeria's fight for independence was so realistic it was reportedly screened at the Pentagon in 2003.", "What is The Battle of Algiers?"],
        ],
      ],
    ],
  },
  {
    slug: "literature",
    title: "Between the Covers",
    description: "From bedtime stories to Booker Prize winners for readers young and old.",
    categories: [
      [
        "OPENING LINES",
        [
          ["'Call me Ishmael.'", "What is Moby-Dick?"],
          ["'It was a bright cold day in April, and the clocks were striking thirteen.'", "What is 1984?"],
          ["'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.'", "What is Pride and Prejudice?"],
          ["'All this happened, more or less.'", "What is Slaughterhouse-Five?"],
          ["'Many years later, as he faced the firing squad, Colonel Aureliano Buendia was to remember that distant afternoon when his father took him to discover ice.'", "What is One Hundred Years of Solitude?"],
        ],
      ],
      [
        "CHILDREN'S LIT",
        [
          ["This very hungry caterpillar by Eric Carle eats through a week's worth of food before becoming a butterfly.", "What is The Very Hungry Caterpillar?"],
          ["Max sails to where these creatures live and is crowned their king in Maurice Sendak's classic.", "What are the Wild Things?"],
          ["In E.B. White's barnyard tale, this spider saves Wilbur the pig by weaving words into her web.", "Who is Charlotte?"],
          ["This Newbery winner by Katherine Paterson follows Jess and Leslie, who build a secret kingdom across a creek.", "What is Bridge to Terabithia?"],
          ["Lyra Belacqua and her daemon Pantalaimon are the heroes of this Philip Pullman trilogy that begins with Northern Lights, or The Golden Compass in the US.", "What is His Dark Materials?"],
        ],
      ],
      [
        "NAME THAT AUTHOR",
        [
          ["This British author wrote the seven Harry Potter novels.", "Who is J.K. Rowling?"],
          ["This American horror novelist's bibliography includes Carrie, It, and The Shining.", "Who is Stephen King?"],
          ["This Nigerian author wrote Things Fall Apart, often called the most widely read book in modern African literature.", "Who is Chinua Achebe?"],
          ["This Japanese author of Norwegian Wood and Kafka on the Shore is a perennial Nobel Prize favorite.", "Who is Haruki Murakami?"],
          ["This Chilean-American author's debut novel The House of the Spirits launched her career in 1982.", "Who is Isabel Allende?"],
        ],
      ],
      [
        "SHAKESPEARE",
        [
          ["This Danish prince delivers the 'To be, or not to be' soliloquy.", "Who is Hamlet?"],
          ["In this play, feuding Montagues and Capulets watch their teenage children die for love.", "What is Romeo and Juliet?"],
          ["Three witches greet this Scottish thane with prophecies that set him on a bloody path to the throne.", "Who is Macbeth?"],
          ["This comedy set in an Athenian forest features the mischievous fairy Puck and a weaver named Bottom.", "What is A Midsummer Night's Dream?"],
          ["This aging king divides his kingdom among his daughters based on their flattery, banishing the only one who tells the truth.", "Who is King Lear?"],
        ],
      ],
      [
        "21ST CENTURY FICTION",
        [
          ["Suzanne Collins kicked off this dystopian YA trilogy in 2008, with Katniss Everdeen volunteering as tribute.", "What is The Hunger Games?"],
          ["Khaled Hosseini's 2003 debut about Amir and Hassan in Afghanistan takes its name from this competitive pastime.", "What is kite running (or kite fighting)?"],
          ["Colson Whitehead reimagined the historical escape network as an actual subterranean train system in this 2016 Pulitzer winner.", "What is The Underground Railroad?"],
          ["Hanya Yanagihara's 700-plus-page 2015 novel follows four college friends in New York, centering on the traumatic past of a lawyer named Jude.", "What is A Little Life?"],
          ["Marlon James won the 2015 Booker Prize for this novel inspired by the 1976 attempt to assassinate Bob Marley.", "What is A Brief History of Seven Killings?"],
        ],
      ],
      [
        "BANNED BOOKS",
        [
          ["Holden Caulfield's profanity-laced narration made this J.D. Salinger novel a perennial target of school challenges.", "What is The Catcher in the Rye?"],
          ["Harper Lee's Pulitzer-winning novel about Atticus Finch defending Tom Robinson is frequently challenged over its language and racial content.", "What is To Kill a Mockingbird?"],
          ["Toni Morrison's Pulitzer-winning novel about a formerly enslaved woman haunted by her dead daughter regularly tops the ALA's banned books list.", "What is Beloved?"],
          ["Art Spiegelman's Holocaust graphic novel, which depicts Jews as mice and Nazis as cats, was famously removed from a Tennessee school district in 2022.", "What is Maus?"],
          ["Alison Bechdel's 2006 graphic memoir about growing up with her closeted father, a funeral home director, has been one of the most banned titles of the 2020s.", "What is Fun Home?"],
        ],
      ],
    ],
  },
  {
    slug: "music",
    title: "Music Across the Ages",
    description: "Classic rock, modern pop, hip hop, Broadway, lyrics, and how the bands got their names.",
    categories: [
      [
        "CLASSIC ROCK",
        [
          ["This British quartet from Liverpool released 'Hey Jude' in 1968.", "Who are The Beatles?"],
          ["Freddie Mercury fronted this band that recorded 'Bohemian Rhapsody.'", "Who is Queen?"],
          ["This 1976 Eagles album shares its name with a California establishment you can check out of but never leave.", "What is Hotel California?"],
          ["Robert Plant and Jimmy Page formed this band, named after a joke that it would go over like one of these.", "Who is Led Zeppelin?"],
          ["This Pink Floyd album spent 741 weeks on the Billboard 200 chart and features a prism on its cover.", "What is The Dark Side of the Moon?"],
        ],
      ],
      [
        "MODERN POP",
        [
          ["This singer's 2014 hit 'Shake It Off' came from her album '1989.'", "Who is Taylor Swift?"],
          ["This Canadian artist released 'Blinding Lights' in 2019 and performed at the 2021 Super Bowl halftime show.", "Who is The Weeknd?"],
          ["Born Stefani Germanotta, this pop star released 'Bad Romance' and 'Poker Face.'", "Who is Lady Gaga?"],
          ["This British singer's album '30' was released in 2021, following her pattern of naming albums after her age.", "Who is Adele?"],
          ["This Puerto Rican artist's 2020 album 'YHLQMDLG' became the highest-charting all-Spanish-language album in Billboard 200 history.", "Who is Bad Bunny?"],
        ],
      ],
      [
        "NAME THAT LYRIC",
        [
          ["'Is this the real life? Is this just fantasy?' opens this 1975 Queen epic.", "What is Bohemian Rhapsody?"],
          ["''Cause baby, you're a firework' appears in this 2010 Katy Perry hit.", "What is Firework?"],
          ["'We could have had it all, rolling in the deep' comes from this Adele single.", "What is Rolling in the Deep?"],
          ["'So no one told you life was gonna be this way' is the opening line of this sitcom theme by The Rembrandts.", "What is I'll Be There for You?"],
          ["'When the truth is found to be lies, and all the joy within you dies' appears in this 1967 Jefferson Airplane classic.", "What is Somebody to Love?"],
        ],
      ],
      [
        "HIP HOP",
        [
          ["This Compton rapper won a Pulitzer Prize for his 2017 album 'DAMN.'", "Who is Kendrick Lamar?"],
          ["This Brooklyn-born rapper and entrepreneur is married to Beyonce and founded Roc-A-Fella Records.", "Who is Jay-Z?"],
          ["This rapper's 1995 album 'Me Against the World' debuted at number one while he was in prison.", "Who is Tupac Shakur?"],
          ["This Detroit rapper's alter ego Slim Shady appeared on his 1999 major-label debut.", "Who is Eminem?"],
          ["This pioneering DJ from the Bronx is widely credited with inventing hip hop at a 1973 back-to-school party on Sedgwick Avenue.", "Who is DJ Kool Herc?"],
        ],
      ],
      [
        "BROADWAY",
        [
          ["Lin-Manuel Miranda wrote this 2015 musical about a founding father, based on a Ron Chernow biography.", "What is Hamilton?"],
          ["This Andrew Lloyd Webber musical features a masked man living beneath the Paris Opera House.", "What is The Phantom of the Opera?"],
          ["Set in 1950s New York, this Sondheim and Bernstein musical retells Romeo and Juliet with the Sharks and the Jets.", "What is West Side Story?"],
          ["This 2003 musical reimagines the witches of Oz before Dorothy arrives.", "What is Wicked?"],
          ["This Jonathan Larson rock musical about young artists in the East Village won the 1996 Pulitzer Prize for Drama.", "What is Rent?"],
        ],
      ],
      [
        "HOW THE BAND GOT ITS NAME",
        [
          ["This Irish band took its name from a U.S. spy plane shot down over the Soviet Union in 1960.", "Who is U2?"],
          ["This Seattle grunge band took its name from a Buddhist concept meaning a state of perfect peace.", "Who is Nirvana?"],
          ["This American rock duo took its name from a William S. Burroughs novel, specifically a steam-powered device best not described at family dinner.", "Who is Steely Dan?"],
          ["Robert Smith's band took its name from the song 'Easy Cure,' shortened to a single word.", "Who is The Cure?"],
          ["Originally called Darlin', this French electronic duo renamed after a Melody Maker reviewer dismissed one of their tracks as 'daft punky thrash.'", "Who are Daft Punk?"],
        ],
      ],
    ],
  },
]

export interface StarterMeta {
  slug: string
  title: string
  description: string
}

export const STARTER_META: StarterMeta[] = STARTERS.map((s) => ({
  slug: s.slug,
  title: s.title,
  description: s.description,
}))

export function buildStarterBoard(slug: string): Board | null {
  const starter = STARTERS.find((s) => s.slug === slug)
  if (!starter) return null
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    title: starter.title,
    description: starter.description,
    categories: starter.categories.map(([title, clues]) => ({
      title,
      clues: clues.map(([prompt, answer]) => ({ prompt, answer })) as [
        { prompt: string; answer: string },
        { prompt: string; answer: string },
        { prompt: string; answer: string },
        { prompt: string; answer: string },
        { prompt: string; answer: string },
      ],
    })) as Board["categories"],
    createdAt: now,
    updatedAt: now,
  }
}
