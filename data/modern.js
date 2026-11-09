// After the Sengoku: the Tokugawa peace, the end of the shogunate, the Meiji state and the wars to 1945.
// Loaded after data/history.js and adds to its lists; same rules (written for this app, checked against Wikipedia).

ERAS.push(
  [1615, 'Genna', '元和'], [1624, 'Kan\'ei', '寛永'], [1644, 'Shōhō', '正保'], [1648, 'Keian', '慶安'], [1652, 'Jōō', '承応'],
  [1655, 'Meireki', '明暦'], [1658, 'Manji', '万治'], [1661, 'Kanbun', '寛文'], [1673, 'Enpō', '延宝'], [1681, 'Tenna', '天和'],
  [1684, 'Jōkyō', '貞享'], [1688, 'Genroku', '元禄'], [1704, 'Hōei', '宝永'], [1711, 'Shōtoku', '正徳'], [1716, 'Kyōhō', '享保'],
  [1736, 'Genbun', '元文'], [1741, 'Kanpō', '寛保'], [1744, 'Enkyō', '延享'], [1748, 'Kan\'en', '寛延'], [1751, 'Hōreki', '宝暦'],
  [1764, 'Meiwa', '明和'], [1772, 'An\'ei', '安永'], [1781, 'Tenmei', '天明'], [1789, 'Kansei', '寛政'], [1801, 'Kyōwa', '享和'],
  [1804, 'Bunka', '文化'], [1818, 'Bunsei', '文政'], [1830, 'Tenpō', '天保'], [1844, 'Kōka', '弘化'], [1848, 'Kaei', '嘉永'],
  [1854, 'Ansei', '安政'], [1860, 'Man\'en', '万延'], [1861, 'Bunkyū', '文久'], [1864, 'Genji', '元治'], [1865, 'Keiō', '慶応'],
  [1868, 'Meiji', '明治'], [1912, 'Taishō', '大正'], [1926, 'Shōwa', '昭和'],
);

PHASES.push(
  [1615, 'The Tokugawa peace', '徳川の世'],
  [1639, 'The closed country', '鎖国'],
  [1853, 'The end of the shogunate', '幕末'],
  [1868, 'The Meiji Restoration', '明治維新'],
  [1889, 'The Empire', '大日本帝国'],
  [1931, 'The road to war', '戦争への道'],
  [1941, 'The Pacific War', '太平洋戦争'],
);

// how much room each stretch of years gets on the band and in play: busy times 1, quiet ones squeezed
const BAND_WEIGHTS = [[1604, 1636, .3], [1637, 1639, .8], [1640, 1852, .09], [1853, 1877, 1], [1878, 1893, .3],
                      [1894, 1905, .7], [1906, 1930, .25], [1931, 1945, 1]];

DYES.rikyu = '#8a907c'; // rikyū-nezumi, a grey-green: the modern state

Object.assign(CLANS, {
  imperial: {
    en: 'Imperial army', ja: '新政府軍', dye: 'kariyasu', motif: 'kikko', title: 'Satsuma, Chōshū and the new government, 1868',
    short: 'The side that fought for the emperor in the Boshin War of 1868–69, led by Satsuma and Chōshū with Tosa and Hizen, under the brocade banner the emperor\'s court granted them.',
    long: 'After the shogun handed back his powers in late 1867, Satsuma and Chōshū pushed through the "restoration of imperial rule" and stripped the Tokugawa of their lands. When the Tokugawa forces marched on Kyoto in January 1868, the domains on the emperor\'s side beat them at Toba–Fushimi, and most of western and central Japan came over. Saigō Takamori led the army east; Edo surrendered without a fight in May, the northern domains were beaten by the autumn, and the last shogunate holdouts in Hakodate gave up in June 1869. The men of Satsuma and Chōshū went on to run the new state. On this map, the provinces in 1868 are dyed by the side their domains took.',
    people: [['Saigō Takamori', '西郷隆盛', '1828–1877', 'Satsuma\'s commander in the Boshin War.'],
             ['Ōkubo Toshimichi', '大久保利通', '1830–1878', 'Satsuma statesman; the new government\'s strongest minister.'],
             ['Kido Takayoshi', '木戸孝允', '1833–1877', 'Chōshū\'s leader in the alliance and the restoration.']],
  },
  shogunate: {
    en: 'Shogunate forces', ja: '旧幕府軍', dye: 'matsuba', motif: 'uroko', title: 'The Tokugawa side and the northern alliance, 1868',
    short: 'The forces that fought on for the Tokugawa in 1868–69: the shogun\'s own troops, Aizu, and the alliance of northern domains, ending with a short-lived republic in Ezo.',
    long: 'Tokugawa Yoshinobu had given up the shogun\'s powers but not his lands. After defeat at Toba–Fushimi he went back to Edo and gave up; Edo castle was handed over in May 1868. Others fought on: the Shōgitai at Ueno, the domain of Nagaoka in Echigo, and the alliance of northern domains led by Sendai, with Aizu at its heart, which fell after a month-long siege in November 1868. Enomoto Takeaki sailed the shogunate fleet to Hakodate and set up the Republic of Ezo, which surrendered in June 1869.',
    people: [['Tokugawa Yoshinobu', '徳川慶喜', '1837–1913', 'The last shogun, who chose not to fight on.'],
             ['Matsudaira Katamori', '松平容保', '1836–1893', 'Lord of Aizu, the north\'s hardest-fought domain.'],
             ['Enomoto Takeaki', '榎本武揚', '1836–1908', 'Admiral of the shogunate fleet and president of the Republic of Ezo.']],
  },
  empire: {
    en: 'Empire of Japan', ja: '大日本帝国', dye: 'rikyu', motif: 'dots', title: 'The modern state, 1871–1945',
    short: 'The modern Japanese state: in 1871 the domains were abolished and replaced by prefectures governed from Tokyo, and the old provinces lived on only as names.',
    long: 'In 1871 the Meiji government abolished the 261 domains and replaced them with prefectures run by appointed governors; the lords were pensioned off. Within a generation Japan had a conscript army, railways, a national school system and, from 1889, a constitution with an elected Diet under a sovereign emperor. It fought and beat China (1894–95) and Russia (1904–05), took Taiwan and annexed Korea (1910). From 1931 the army drove the country into war in Manchuria, then China (1937), then against the United States and Britain (1941), which ended with Japan\'s defeat and surrender in 1945. On this map the home islands are dyed as one state from 1871; the empire overseas is not shown.',
    people: [['Emperor Meiji', '明治天皇', '1852–1912', 'Reigned 1867–1912, over the whole transformation.'],
             ['Itō Hirobumi', '伊藤博文', '1841–1909', 'Chōshū statesman; first prime minister and author of the constitution.'],
             ['Tōjō Hideki', '東條英機', '1884–1948', 'Prime minister 1941–44; executed as a war criminal.']],
  },
  rebels: {
    en: 'Satsuma rebels', ja: '薩摩軍', dye: 'bengara', motif: 'hishi', title: 'Saigō Takamori\'s last war, 1877',
    short: 'The army of former Satsuma samurai who rose under Saigō Takamori in 1877, the last and largest revolt against the Meiji state.',
    long: 'The samurai lost their stipends, their right to carry swords and their role as the only soldiers. In Satsuma many gathered in Saigō Takamori\'s private schools. In 1877 they marched north and besieged Kumamoto castle, but the conscript army held it and drove them back. Saigō died at Shiroyama above Kagoshima in September 1877. He was pardoned after his death and remains one of Japan\'s most loved heroes.',
    people: [['Saigō Takamori', '西郷隆盛', '1828–1877', 'Hero of the restoration, then its last rebel.']],
  },
});

// the Ezo lands (Hokkaido): outside the realm until the Boshin War, then part of Japan
const EZO_HOLDERS = [[1467, null], [1868, 'shogunate'], [1869, 'imperial'], [1871, 'empire']];
// the Ryukyu islands (Okinawa), in the inset box: a kingdom of their own, outside the realm, until Japan annexed them in
// 1879. The Amami islands in the north were taken by Satsuma in 1609 and follow Satsuma's holder from then on (app.js).
const RYUKYU_HOLDERS = [[1467, null], [1879, 'empire']];
const EZO_NOTE = 'Ezo 蝦夷: the land of the Ainu, outside the realm, with the Matsumae clan trading from its southern tip. Renamed Hokkaido in 1869.';

// the Tokugawa settle in, then two wars of sides: 1868 (dyed by side) and 1877
CHANGES.push(
  [1614, 'awa_boso', 'tokugawa', 'The Satomi are removed from Awa.'],
  [1615, 'settsu', 'tokugawa', 'Osaka falls; the Toyotomi are destroyed.'],
  [1615, 'kawachi', 'tokugawa', null], [1615, 'izumi', 'tokugawa', null],
);
{
  // 1868: dyed by the side each province's domains took in the Boshin War
  const split = {
    musashi: ['imperial', 'shogunate', 'Edo is handed over in May; the Shōgitai fight on at Ueno.'],
    shimotsuke: ['imperial', 'shogunate', 'Battles at Utsunomiya and Nikkō.'],
    shimosa: ['imperial', 'shogunate', null],
    echigo: ['shogunate', 'imperial', 'Nagaoka fights for the north.'],
    dewa: ['shogunate', 'imperial', 'Shōnai for the north, Akita for the emperor.'],
  };
  for (const p of Object.keys(BASE)) {
    if (p === 'mutsu') CHANGES.push([1868, p, 'shogunate', 'The northern alliance; Aizu falls in November after a month-long siege.']);
    else if (split[p]) CHANGES.push([1868, p, split[p].slice(0, 2), split[p][2]]);
    else CHANGES.push([1868, p, 'imperial', p === 'yamashiro' ? 'Toba–Fushimi: the shogunate army is beaten outside Kyoto.' : null]);
  }
  for (const p of [...Object.keys(split), 'mutsu']) CHANGES.push([1869, p, 'imperial', null]);
  for (const p of Object.keys(BASE)) CHANGES.push([1871, p, 'empire', p === 'musashi' ? 'The domains are abolished; Tokyo governs prefectures.' : null]);
  for (const p of ['satsuma', 'osumi', 'hyuga', 'higo']) CHANGES.push([1877, p, ['empire', 'rebels'], p === 'higo' ? 'Saigō\'s army besieges Kumamoto castle.' : null]);
  for (const p of ['satsuma', 'osumi', 'hyuga', 'higo']) CHANGES.push([1878, p, 'empire', null]);
}

ALLIANCES.push(
  ['satcho', 1866, 1867, ['shimazu', 'mori'], 'The Satsuma–Chōshū alliance', '薩長同盟',
   'Old enemies Satsuma and Chōshū, brought together by Sakamoto Ryōma in Kyoto in 1866, agreed to bring down the shogunate.'],
);

// at: a province, or 'ezo' or 'ryukyu' (placed by lon/lat in the inset); abroad: 'west' places the mark out in the sea
// toward the continent, 'east' out in the Pacific
EVENTS.push(
  { id: 'ryukyu1609', year: 1609, en: 'Satsuma invades Ryukyu', ja: '琉球侵攻', at: 'ryukyu', lon: 127.72, lat: 26.22, kind: 'battle',
    sides: ['shimazu', null], winner: 'shimazu',
    short: 'With the shogun\'s leave, the Shimazu of Satsuma send some 3,000 men in a hundred ships against the kingdom of Ryukyu and take its royal castle at Shuri. Ryukyu keeps its king but answers to Satsuma from now on.',
    long: 'Ryukyu had grown rich as a trading kingdom between China, Japan, Korea and South-east Asia. In the spring of 1609 the Shimazu, with Tokugawa Ieyasu\'s permission, took the Amami islands and landed on Okinawa; Shuri surrendered in April. King Shō Nei was taken to Kagoshima and on to meet Ieyasu and the shogun, and allowed home in 1611 after swearing loyalty to the Shimazu. Satsuma kept the Amami islands for itself. For two and a half centuries Ryukyu lived a double life: still sending tribute to China, but ruled from Satsuma, whose wealth grew on the China trade that passed through it.' },
  { id: 'osaka', year: 1615, en: 'The fall of Osaka', ja: '大坂の陣', at: 'settsu', dx: 6, dy: 3, kind: 'battle',
    sides: ['tokugawa', 'toyotomi'], winner: 'tokugawa',
    short: 'Tokugawa Ieyasu besieges Toyotomi Hideyori in Osaka castle in the winter of 1614 and storms it in the summer of 1615. Hideyori and his mother die as the castle burns; the Toyotomi line ends.',
    long: 'Hideyori, now grown, still held Osaka and its great castle, and masterless samurai flocked to him. Ieyasu took offence at an inscription on a temple bell Hideyori had dedicated and besieged Osaka in the winter of 1614. The peace that followed made the Toyotomi fill in the castle\'s outer moats. In the summer of 1615 the Tokugawa came back. Sanada Nobushige (Yukimura) led a charge at Tennōji that nearly reached Ieyasu, but the castle fell, and Hideyori and his mother Yodo-dono killed themselves. Ieyasu died the next year; there would be no more great wars in Japan for two and a half centuries.' },
  { id: 'sankin', year: 1635, en: 'Alternate attendance', ja: '参勤交代', at: 'musashi', dx: -4, dy: -6, kind: 'event',
    short: 'Shogun Tokugawa Iemitsu makes it law that every lord spend alternate years in Edo, leaving his wife and heir there as hostages.',
    long: 'The revised Laws for the Military Houses of 1635 made the custom compulsory. Lords marched to Edo and back with hundreds or thousands of retainers, every other year, at ruinous cost. The system kept the lords in check and their treasuries thin, and it built the great highways, their post towns and inns, and Edo itself, which became one of the largest cities in the world.' },
  { id: 'shimabara', year: 1637, en: 'The Shimabara Rebellion', ja: '島原の乱', at: 'hizen', dx: 10, dy: 18, kind: 'battle',
    sides: ['tokugawa', null], winner: 'tokugawa',
    short: 'Peasants and Christians of Shimabara and Amakusa, crushed by taxes and persecution, rise under the teenage Amakusa Shirō and hold out in Hara castle until April 1638.',
    long: 'Famine, heavy taxes and the persecution of Christians drove the people of the Shimabara peninsula and the Amakusa islands to revolt in late 1637, led by a charismatic teenager, Amakusa Shirō. Some 37,000 rebels held the ruined Hara castle against a shogunate army of some 125,000 for months; a Dutch ship even shelled the castle for the shogunate. When it fell in April 1638 almost all the defenders were killed. The shogunate blamed Christianity, and closed the country.' },
  { id: 'sakoku', year: 1639, en: 'The country closed', ja: '鎖国', at: 'hizen', dx: 2, dy: 8, kind: 'event',
    short: 'The Portuguese are expelled. From 1641 the Dutch are confined to the little island of Dejima in Nagasaki harbour, and for two centuries Japanese may not leave the country.',
    long: 'A series of edicts in the 1630s banned Christianity, forbade Japanese to travel abroad or come back, and in 1639 expelled the Portuguese. Trade went on through four gates only: the Dutch and Chinese at Nagasaki, Korea through the Sō of Tsushima, the Ryukyu kingdom through Satsuma, and the Ainu through the Matsumae in Ezo. The word sakoku, "closed country", was coined later; Japan was controlled, not sealed.' },
  { id: 'meireki', year: 1657, en: 'The Great Fire of Meireki', ja: '明暦の大火', at: 'musashi', dx: 4, dy: -2, kind: 'event',
    short: 'Fire sweeps through Edo for three days, destroying most of the city and the keep of Edo castle. Over 100,000 people are thought to have died.',
    long: 'Driven by winter winds, the fire burned for three days in March 1657 and destroyed some two thirds of the city, including the great keep of Edo castle, which was never rebuilt. Estimates of the dead run to over 100,000. Edo was rebuilt with firebreaks and wider streets, and spread across the Sumida river.' },
  { id: 'shakushain', year: 1669, en: 'Shakushain\'s war', ja: 'シャクシャインの戦い', at: 'ezo', lon: 142.37, lat: 42.33, kind: 'event',
    short: 'The Ainu chief Shakushain calls the Ainu of Ezo to rise against the Matsumae, the Japanese lords who control their trade. By the end of the year he has been killed by Matsumae warriors.',
    long: 'The Matsumae held the southern tip of Ezo and, by the shogun\'s grant, the sole right to trade with the Ainu. Their samurai ran trading posts across the island, forced bad rates on the Ainu and overfished the salmon rivers. In 1669 a feud between Ainu groups on the Shibuchari river became a general rising when word spread that the Matsumae had poisoned Ainu envoys. The Ainu attacked Japanese traders, ships and mining camps. Shakushain surrendered at the end of the year and was murdered; the fighting went on until 1672. Afterwards the Ainu had to swear allegiance to the Matsumae, who tightened their hold on the island\'s trade.' },
  { id: 'ako', year: 1703, en: 'The forty-seven rōnin', ja: '赤穂事件', at: 'musashi', dx: 2, dy: 4, kind: 'event',
    short: 'Forty-seven retainers of the lord of Akō avenge their master by killing the courtier Kira Yoshinaka in Edo, then forty-six of them are ordered to commit seppuku.',
    long: 'In 1701 Asano Naganori, lord of Akō in Harima, drew his sword on the court official Kira Yoshinaka inside Edo castle and was ordered to kill himself; his domain was confiscated. Nearly two years later, on a snowy night at the end of 1702 by the old calendar (January 1703), forty-seven of his former retainers broke into Kira\'s mansion and took his head. The shogunate ordered the forty-six who gave themselves up to commit seppuku. Retold endlessly on the stage as Chūshingura, it became Japan\'s great story of loyalty.' },
  { id: 'hoei', year: 1707, en: 'Mount Fuji erupts', ja: '宝永大噴火', at: 'suruga', dx: 4, dy: -8, kind: 'event',
    short: 'Fuji\'s last eruption, weeks after one of the largest earthquakes in Japan\'s history. Ash falls on Edo, a hundred kilometres away.',
    long: 'The great Hōei earthquake struck in October 1707. In December Mount Fuji erupted from a new vent on its south-east flank, and ash fell for two weeks over the farmland to the east and on Edo itself. Fuji has not erupted since.' },
  { id: 'kaitai', year: 1774, en: 'A Dutch anatomy in Japanese', ja: '解体新書', at: 'musashi', dx: -6, dy: 6, kind: 'event',
    short: 'Sugita Genpaku and Maeno Ryōtaku publish Kaitai Shinsho, a translation of a Dutch book of anatomy: the first full translation of a Western book into Japanese. "Dutch learning" takes off.',
    long: 'In 1771 Sugita and Maeno watched the dissection of an executed criminal at the Kozukappara execution ground in Edo, with the Dutch Ontleedkundige Tafelen in their hands. Its plates matched what they saw. They began translating the next day, with very little Dutch between them, and published in 1774. Maeno, who did most of the translating, left his name off the book.' },
  { id: 'tenmei', year: 1782, en: 'The Tenmei famine', ja: '天明の大飢饉', at: 'mutsu', dx: 4, dy: 10, kind: 'event',
    short: 'Cold summers and the eruption of Mount Asama in 1783 bring years of famine. The north-east suffers worst; hundreds of thousands die.',
    long: 'From 1782 cold, wet summers ruined harvests; in 1783 Mount Asama erupted, and ash and cold made things worse. The famine lasted until about 1788 and struck the domains of the north-east hardest. Rice riots broke out in Edo and Osaka, and the senior councillor Tanuma Okitsugu fell from power.' },
  { id: 'laxman', year: 1792, en: 'A Russian ship at Nemuro', ja: 'ラクスマン来航', at: 'ezo', lon: 145.58, lat: 43.33, kind: 'event',
    short: 'Adam Laxman sails into Nemuro to bring home Japanese castaways and ask for trade. He leaves with a paper allowing one Russian ship to call at Nagasaki, and the shogunate turns its eyes north.',
    long: 'Laxman, a lieutenant in the Russian service, brought back the castaway Daikokuya Kōdayū and his companions and asked to take them to Edo himself. The senior councillor Matsudaira Sadanobu sent envoys to stop him; Laxman sailed on to Hakodate and was received at Matsumae. He was told that foreign trade could be done only at Nagasaki, and given a permit for one Russian ship. When the envoy Nikolai Rezanov came to Nagasaki in 1804, he was sent away.' },
  { id: 'ino', year: 1800, en: 'Inō Tadataka sets out', ja: '伊能忠敬の測量', at: 'ezo', kind: 'event',
    short: 'Inō Tadataka, a retired sake brewer of fifty-five, leaves Edo at his own expense to survey the coast of Ezo. He spends the rest of his life walking and measuring Japan.',
    long: 'Inō ran a prosperous sake and rice business in Sawara until he retired at 49, then moved to Edo to study Western astronomy under Takahashi Yoshitoki. In 1800 the shogunate let him survey Ezo, where Russian ships had begun to appear, but paid him nothing; he measured by counting his steps and fixed his place by the stars. Nine more journeys followed, more and more at the shogunate\'s cost, some 35,000 km in all. He died in 1818 and his team finished the great map in 1821. It remained the standard map of Japan for nearly a century.' },
  { id: 'siebold', year: 1828, en: 'The Siebold incident', ja: 'シーボルト事件', at: 'hizen', dx: -4, dy: 12, kind: 'event',
    short: 'Philipp Franz von Siebold, the doctor of the Dutch post at Dejima, is found with maps of Japan drawn from Inō Tadataka\'s surveys, which no foreigner may own. He is accused of spying and expelled.',
    long: 'Siebold came to Dejima in 1823 as physician to the Dutch and collected Japan\'s plants, animals and books for Europe. The court astronomer Takahashi Kageyasu gave him detailed maps of Japan and Korea from Inō\'s work. When the maps were found, the shogunate accused Siebold of spying for Russia; Takahashi was thrown into prison, where he died, and Siebold was held under house arrest and expelled in 1829. The ban on him was lifted in 1858.' },
  { id: 'oshio', year: 1837, en: 'Ōshio Heihachirō\'s rising', ja: '大塩平八郎の乱', at: 'settsu', dx: 4, dy: 8, kind: 'battle',
    sides: ['tokugawa', null], winner: 'tokugawa',
    short: 'In the Tenpō famine a former police official of Osaka rises with townspeople and farmers to help the starving. The rising is crushed in a day, but a fifth of Osaka burns.',
    long: 'Ōshio Heihachirō, a retired Osaka police official and scholar, sold his books to feed the poor and, when the city magistrates kept shipping rice to Edo, rose in arms in March 1837. The rising was put down within a day, and Ōshio killed himself weeks later, but fire spread through much of the city. That a former shogunate official had rebelled shocked the country.' },
  { id: 'perry', year: 1853, en: 'The black ships', ja: '黒船来航', at: 'sagami', dx: 10, dy: 8, kind: 'event', threshold: true,
    short: 'Commodore Matthew Perry anchors four American warships off Uraga and demands that Japan open its ports. He comes back the next year, and the shogunate signs.',
    long: 'Perry arrived in July 1853 with two steam frigates and two sailing ships, the "black ships", carrying a letter from President Fillmore. He returned with a larger fleet in early 1854, and the shogunate signed the Treaty of Kanagawa, opening two ports. The shogunate\'s failure to keep the foreigners out, after two centuries of control, began its fall.' },
  { id: 'ansei', year: 1858, en: 'The unequal treaties', ja: '安政の五カ国条約', at: 'musashi', dx: 10, dy: 12, kind: 'event',
    short: 'Under pressure, the shogunate signs trade treaties with the United States, Britain, France, Russia and the Netherlands, without the emperor\'s approval, and crushes its critics.',
    long: 'The treaties opened ports to trade, let foreigners be tried by their own consuls and fixed low tariffs: the "unequal treaties" Japan would spend fifty years undoing. The great elder Ii Naosuke signed without the emperor\'s consent and then purged his opponents in the Ansei purge, arresting and executing dozens.' },
  { id: 'sakuradamon', year: 1860, en: 'The Sakuradamon incident', ja: '桜田門外の変', at: 'musashi', dx: 0, dy: 8, kind: 'event',
    short: 'Masterless samurai, most of them from Mito, kill the great elder Ii Naosuke in the snow outside Edo castle\'s Sakurada gate.',
    long: 'On a snowy morning in March 1860 a band of former Mito samurai, joined by one from Satsuma, ambushed Ii Naosuke\'s procession at the Sakurada gate and killed him. The murder of the shogunate\'s most powerful official at its own gate showed how weak it had become; the slogan "revere the emperor, expel the barbarians" spread.' },
  { id: 'kagoshima', year: 1863, en: 'The bombardment of Kagoshima', ja: '薩英戦争', at: 'satsuma', dx: 4, dy: 2, kind: 'battle',
    sides: ['shimazu', null], winner: null,
    short: 'A British squadron shells Kagoshima after Satsuma men killed a British merchant. Satsuma learns how far behind it is, and soon buys British ships and guns.',
    long: 'In 1862 a British merchant, Charles Richardson, was cut down for failing to give way to the procession of Satsuma\'s regent at Namamugi near Yokohama. In August 1863 a British squadron bombarded Kagoshima and burned much of the town, though Satsuma\'s batteries also hit the ships. Afterwards Satsuma paid an indemnity and turned to Britain for modern weapons and training.' },
  { id: 'shimonoseki', year: 1864, en: 'The Shimonoseki campaign', ja: '下関戦争', at: 'nagato', dx: -2, dy: 4, kind: 'battle',
    sides: ['mori', null], winner: null,
    short: 'Chōshū fires on foreign ships in the Shimonoseki strait; in 1864 a fleet of seventeen British, French, Dutch and American warships destroys its forts.',
    long: 'In 1863 Chōshū, home of the most radical "expel the barbarians" men, closed the strait and fired on passing foreign ships. In September 1864 an allied fleet bombarded and landed at Shimonoseki and destroyed its batteries. Like Satsuma, Chōshū drew the lesson, and rebuilt its army with Western weapons and mixed units of samurai and commoners.' },
  { id: 'taisei', year: 1867, en: 'The shogun returns power', ja: '大政奉還', at: 'yamashiro', dx: 2, dy: -6, kind: 'event',
    short: 'The fifteenth shogun, Tokugawa Yoshinobu, hands the powers of government back to the emperor, hoping to lead the new order. Two months later Satsuma and Chōshū declare the restoration of imperial rule.',
    long: 'In November 1867 Yoshinobu formally returned governing authority to the young Emperor Meiji, expecting the Tokugawa to remain the leading house. Sakamoto Ryōma, who had helped forge the Satsuma–Chōshū alliance and promote this plan, was murdered in Kyoto a month later. On 3 January 1868 Satsuma and its allies seized the palace gates and proclaimed the restoration of imperial rule, stripping the Tokugawa of office and lands.' },
  { id: 'toba', year: 1868, en: 'Toba–Fushimi and the Boshin War', ja: '戊辰戦争', at: 'yamashiro', dx: -4, dy: 6, kind: 'battle', threshold: true,
    sides: ['imperial', 'shogunate'], winner: 'imperial',
    short: 'Outside Kyoto in January 1868 a smaller army of Satsuma and Chōshū, under the emperor\'s brocade banner, beats the shogunate\'s forces. Yoshinobu flees to Edo, and the civil war of 1868–69 begins.',
    long: 'The Tokugawa army marched on Kyoto and met Satsuma and Chōshū troops on the roads at Toba and Fushimi on 27 January 1868. Better armed and led, and fighting under the imperial brocade banner, which made their enemies rebels, the imperial side won in four days. Domains across the west declared for the emperor; Yoshinobu took ship for Edo. In the months that followed the imperial army marched east and north in what came to be called the Boshin War, after the year\'s name in the old cycle.' },
  { id: 'edo1868', year: 1868, en: 'Edo surrenders', ja: '江戸開城', at: 'musashi', dx: 6, dy: 2, kind: 'event',
    short: 'Katsu Kaishū for the shogunate and Saigō Takamori for the emperor agree to hand over Edo castle without a battle, sparing the city of a million people.',
    long: 'As the imperial army approached, the shogunate\'s Katsu Kaishū met Saigō Takamori and arranged the surrender of Edo castle, which was handed over in May 1868. Holdouts of the Shōgitai were crushed at Ueno that summer. Edo was renamed Tokyo, "eastern capital", and the emperor moved there.' },
  { id: 'aizu', year: 1868, en: 'The siege of Aizu', ja: '会津戦争', at: 'mutsu', dx: -12, dy: 50, kind: 'battle',
    sides: ['imperial', 'shogunate'], winner: 'imperial',
    short: 'The northern domains fight on. Aizu, the shogunate\'s most loyal domain, holds out in Wakamatsu castle for a month before surrendering in November.',
    long: 'The northern domains formed an alliance led by Sendai to resist the new government. Imperial armies broke into Aizu in October 1868. Its young reserve unit, the Byakkotai, retreating to Iimori hill and believing the castle burned, killed themselves; the castle held out for a month under bombardment before Matsudaira Katamori surrendered. Its fate made Aizu a symbol of loyalty and loss.' },
  { id: 'hakodate', year: 1869, en: 'The battle of Hakodate', ja: '箱館戦争', at: 'ezo', kind: 'battle',
    sides: ['imperial', 'shogunate'], winner: 'imperial',
    short: 'The last shogunate forces, who had sailed to Ezo and declared a republic, surrender at Hakodate in June 1869. The Boshin War is over.',
    long: 'Admiral Enomoto Takeaki took the shogunate fleet north to Ezo in late 1868, seized Hakodate and its star fort of Goryōkaku, and set up the Republic of Ezo, with French officers among his advisers. The imperial navy and army attacked in the spring of 1869; Enomoto surrendered in June. Ezo was renamed Hokkaido and settled from the main islands. Enomoto was pardoned and later served the government.' },
  { id: 'haihan', year: 1871, en: 'The domains abolished', ja: '廃藩置県', at: 'musashi', dx: -8, dy: 0, kind: 'event',
    short: 'With one decree the government abolishes the domains and replaces them with prefectures governed from Tokyo. The lords are pensioned off; the samurai\'s world ends.',
    long: 'In 1869 the lords had already returned their lands to the emperor and stayed on as governors. In August 1871 the government, backed by troops from Satsuma, Chōshū and Tosa, abolished the 261 domains outright and created prefectures under appointed governors. Conscription (1873) and the end of samurai stipends (1876) followed. The old provinces lived on as names and in people\'s sense of home.' },
  { id: 'seinan', year: 1877, en: 'The Satsuma Rebellion', ja: '西南戦争', at: 'higo', dx: -2, dy: -8, kind: 'battle',
    sides: ['empire', 'rebels'], winner: 'empire',
    short: 'Saigō Takamori leads the former samurai of Satsuma against the government. The conscript army holds Kumamoto castle and wears the rebels down; Saigō dies at Shiroyama in September.',
    long: 'About 30,000 Satsuma men marched north in February 1877 and besieged Kumamoto castle, whose garrison of conscripts held out for some fifty days. Relieved, the government armies pushed the rebels back through Kyushu. With a few hundred men left, Saigō made a last stand at Shiroyama above Kagoshima and died there on 24 September. The war proved that a conscript army could beat samurai, and it was the last civil war in Japan.' },
  { id: 'ryukyu1879', year: 1879, en: 'Ryukyu becomes Okinawa', ja: '琉球処分', at: 'ryukyu', lon: 127.72, lat: 26.22, kind: 'event',
    short: 'Japan abolishes the kingdom of Ryukyu. Police and troops are sent to Shuri, the last king, Shō Tai, is moved to Tokyo, and the islands become Okinawa Prefecture.',
    long: 'Japan had already made Ryukyu a domain under Tokyo in 1872, and kept it from sending tribute to China. In 1879 it ended the kingdom outright, in what Japanese history calls the Ryukyu Disposition: Shō Tai gave up Shuri castle and was settled in Tokyo as a noble. China protested but could do nothing. Okinawans were pressed to give up their language and customs for those of the main islands, and the new prefecture stayed one of the poorest in Japan.' },
  { id: 'constitution', year: 1889, en: 'The Meiji Constitution', ja: '大日本帝国憲法', at: 'musashi', dx: 2, dy: -10, kind: 'event',
    short: 'The emperor grants Japan a written constitution, modelled largely on Prussia\'s, with an elected lower house but sovereignty resting with the emperor.',
    long: 'Drafted by a team under Itō Hirobumi after study in Europe, the constitution was proclaimed on 11 February 1889. It created a Diet with an elected lower house, chosen at first by a small fraction of men who paid enough tax, and courts and a cabinet, but placed the army and navy directly under the emperor, a weakness that the military would later exploit.' },
  { id: 'sinojapanese', year: 1894, en: 'The First Sino-Japanese War', ja: '日清戦争', at: 'tsushima', abroad: 'west', kind: 'battle',
    sides: ['empire', null], winner: 'empire',
    short: 'Japan and Qing China go to war over Korea. Japan wins on land and at sea and, by the treaty of Shimonoseki in 1895, takes Taiwan.',
    long: 'The war was fought over influence in Korea, in Korea itself, in Manchuria and at sea, with the imperial headquarters at Hiroshima. Japan\'s modern army and navy beat China\'s in months. By the treaty signed at Shimonoseki in April 1895 China recognised Korea\'s independence, paid a large indemnity and ceded Taiwan; Russia, France and Germany forced Japan to give back the Liaodong peninsula, a humiliation that shaped the next war.' },
  { id: 'tsushima1905', year: 1905, en: 'The Battle of Tsushima', ja: '日本海海戦', at: 'tsushima', abroad: 'west', kind: 'battle',
    sides: ['empire', null], winner: 'empire',
    short: 'In the Russo-Japanese War, Admiral Tōgō Heihachirō\'s fleet destroys the Russian Baltic Fleet in the strait of Tsushima after its voyage halfway round the world.',
    long: 'Japan and Russia went to war in 1904 over Korea and Manchuria. After the costly siege of Port Arthur and the battle of Mukden, Russia\'s Baltic Fleet arrived in May 1905 and was annihilated in the Tsushima strait in two days. The Treaty of Portsmouth gave Japan southern Sakhalin, Russia\'s rights in southern Manchuria and a free hand in Korea. It was the first great victory of an Asian power over a European one.' },
  { id: 'korea1910', year: 1910, en: 'Korea annexed', ja: '韓国併合', at: 'tsushima', abroad: 'west', dy: -14, kind: 'event',
    short: 'Japan annexes Korea, which it rules as a colony until 1945.',
    long: 'Korea had been a Japanese protectorate since 1905; Itō Hirobumi, its first resident-general, was assassinated by the Korean independence activist An Jung-geun in 1909. In August 1910 Japan formally annexed the country. Colonial rule lasted thirty-five years and is remembered in Korea for repression, forced assimilation and, in wartime, forced labour and the "comfort women" system.' },
  { id: 'kanto1923', year: 1923, en: 'The Great Kantō earthquake', ja: '関東大震災', at: 'sagami', dx: 6, dy: -4, kind: 'event',
    short: 'A great earthquake strikes Tokyo and Yokohama at midday on 1 September 1923; fires burn for days. Over 100,000 people die.',
    long: 'The earthquake hit as charcoal stoves were lit for lunch, and the fires that followed destroyed much of Tokyo and Yokohama. Some 105,000 people died. In the chaos, rumours spread that Koreans were poisoning wells, and vigilantes, police and soldiers killed thousands of Koreans, as well as Chinese and Japanese leftists.' },
  { id: 'manchuria', year: 1931, en: 'The Manchurian Incident', ja: '満州事変', at: 'tsushima', abroad: 'west', dy: -26, kind: 'battle', threshold: false,
    sides: ['empire', null], winner: 'empire',
    short: 'Japanese army officers set off a small bomb by a railway line near Mukden, blame China, and seize Manchuria without orders from Tokyo. A puppet state, Manchukuo, follows in 1932.',
    long: 'Officers of the Kwantung Army staged a small explosion beside the South Manchuria Railway on 18 September 1931; it barely damaged the track, but they blamed China and used it as a pretext to occupy all of Manchuria. The government in Tokyo could not or would not stop them. When the League of Nations condemned the takeover in 1933, Japan walked out. Through the 1930s the army\'s influence grew, helped by assassinations of politicians and a failed coup in 1936.' },
  { id: 'china1937', year: 1937, en: 'War with China', ja: '日中戦争', at: 'tsushima', abroad: 'west', dy: 12, kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'A clash at the Marco Polo Bridge near Beijing becomes full-scale war. Japanese troops take Shanghai and Nanjing, where they massacre civilians and prisoners.',
    long: 'Fighting began on 7 July 1937 and spread rapidly. After a hard battle for Shanghai, Japanese troops took the Chinese capital, Nanjing, in December and carried out weeks of mass killing and rape; estimates of the dead range from tens of thousands to over 200,000, and it remains one of the war\'s defining atrocities. China did not surrender, and the war became a long stalemate that drained Japan and drew it toward conflict with the Western powers.' },
  { id: 'pearl', year: 1941, en: 'Pearl Harbor and the Pacific War', ja: '真珠湾攻撃', at: 'musashi', abroad: 'east', kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'Japanese carrier aircraft attack the US fleet at Pearl Harbor on 7 December 1941, while Japanese forces strike across Southeast Asia. Within months Japan holds an empire from Burma to the central Pacific.',
    long: 'Cut off from American oil by an embargo, Japan\'s leaders chose war. The attack on Pearl Harbor sank or damaged eight battleships but missed the American carriers. On the same day Japan attacked Malaya, Hong Kong and the Philippines; Singapore fell in February 1942. The occupation that followed brought forced labour, killings of civilians and prisoners, and great suffering across Asia.' },
  { id: 'midway', year: 1942, en: 'The Battle of Midway', ja: 'ミッドウェー海戦', at: 'musashi', abroad: 'east', dy: 18, kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'In June 1942 American carrier aircraft sink four Japanese carriers near Midway atoll. From then on Japan is on the defensive.',
    long: 'Admiral Yamamoto Isoroku hoped to lure the American carriers to destruction. Instead, with Japanese codes partly broken, American dive bombers caught the Japanese carriers rearming and sank all four. Japan could not replace its carriers or its trained pilots. The long American advance across the Pacific followed: Guadalcanal, the Marianas, the Philippines, Iwo Jima.' },
  { id: 'tokyo1945', year: 1945, en: 'The firebombing of Tokyo', ja: '東京大空襲', at: 'musashi', dx: 8, dy: -4, kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'On the night of 9–10 March 1945 American bombers drop incendiaries on Tokyo. Some 90,000 to 100,000 people die in one night; most Japanese cities are burned in the months that follow.',
    long: 'Low-level night raids by B-29s with incendiary bombs set firestorms through Tokyo\'s wooden districts east of the castle; the raid of 9–10 March was the deadliest air attack of the war. In the following months nearly every large Japanese city was firebombed, including Nagoya, Osaka and Kobe; Nagoya castle burned in May.' },
  { id: 'okinawa', year: 1945, en: 'The Battle of Okinawa', ja: '沖縄戦', at: 'ryukyu', lon: 127.76, lat: 26.14, kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'From April to June 1945 the Americans fight to take Okinawa, south of Kyushu. Over 100,000 Okinawan civilians die, between a quarter and a third of the island\'s people.',
    long: 'Okinawa, once the kingdom of Ryukyu and annexed by Japan in 1879, became the last great battlefield before the home islands. Japanese troops fought from caves and tunnels; kamikaze aircraft attacked the American fleet offshore. Civilians were caught between the armies, and many were driven to mass suicide by the Japanese military. The islands are drawn in the box south of Shikoku.' },
  { id: 'atomic', year: 1945, en: 'Hiroshima and Nagasaki', ja: '原爆投下', at: 'aki', dx: 4, dy: 4, kind: 'battle',
    sides: ['empire', null], winner: null,
    short: 'On 6 August 1945 an American atomic bomb destroys Hiroshima; on 9 August a second destroys Nagasaki. By the end of the year about 140,000 people have died in Hiroshima and 74,000 in Nagasaki.',
    long: 'The bomb dropped on Hiroshima killed tens of thousands instantly and many more from burns and radiation in the following months; Nagasaki, in Hizen, was bombed three days later, the day after the Soviet Union declared war on Japan. The survivors, the hibakusha, carried the effects for the rest of their lives. The bombings remain the only use of nuclear weapons in war.' },
  { id: 'surrender', year: 1945, en: 'Japan surrenders', ja: '終戦', at: 'musashi', dx: 14, dy: 10, kind: 'event', threshold: true,
    short: 'On 15 August 1945 Emperor Hirohito announces Japan\'s surrender by radio; on 2 September it is signed aboard USS Missouri in Tokyo Bay. The empire is over.',
    long: 'Most Japanese heard their emperor\'s voice for the first time in the radio broadcast, telling them to "endure the unendurable". Japan lost its colonies, and the Allied occupation under General MacArthur, lasting until 1952, disarmed the country and brought a new constitution in which sovereignty rests with the people and Japan renounces war. The old provinces had long since become prefectures; the story on this map ends here.' },
);

// later castles; and when the earlier ones fell or were pulled down after 1603
CASTLES.push(
  { id: 'nagoya', photo: 'The keep in the photo was rebuilt in 1959.', en: 'Nagoya Castle', ja: '名古屋城', at: 'owari', dx: 2, dy: 2, from: 1610, to: 1945, wiki: 'Nagoya Castle',
    short: 'Built by Ieyasu from 1610 for his son, replacing Kiyosu, with golden dolphins on its keep. The keep burned in an American air raid in May 1945.' },
  { id: 'hikone', en: 'Hikone Castle', ja: '彦根城', at: 'omi', dx: 0, dy: -10, from: 1622, to: 1945, wiki: 'Hikone Castle',
    short: 'Seat of the Ii, the Tokugawa\'s red-armoured vassals, built after Sekigahara partly from the stones of Ishida Mitsunari\'s Sawayama castle. Its keep still stands.' },
  { id: 'hiroshima', photo: 'The keep in the photo was rebuilt in 1958.', en: 'Hiroshima Castle', ja: '広島城', at: 'aki', dx: 6, dy: 8, from: 1591, to: 1945, wiki: 'Hiroshima Castle',
    short: 'Built by Mōri Terumoto from 1589 on the delta of the Ōta river, and later the Asano clan\'s. Imperial headquarters in the war of 1894–95; destroyed by the atomic bomb in August 1945.' },
  { id: 'nijo', en: 'Nijō Castle', ja: '二条城', at: 'yamashiro', dx: -3, dy: -5, from: 1603, to: 1945, wiki: 'Nijō Castle',
    short: 'The shoguns\' seat in Kyoto, begun by Ieyasu in 1601 and finished in 1626. In 1867 the last shogun, Yoshinobu, handed power back to the emperor in its Ninomaru Palace.' },
  { id: 'goryokaku', en: 'Goryōkaku', ja: '五稜郭', at: 'ezo', lon: 140.757, lat: 41.797, from: 1866, to: 1945, wiki: 'Goryōkaku',
    short: 'A star-shaped fort of the European kind at Hakodate, finished in 1866. In 1869 it was the headquarters of the short-lived Republic of Ezo, and the scene of the last battle of the Boshin War.' },
  { id: 'shuri', photo: 'The halls in the photo were rebuilt from 1992.', en: 'Shuri Castle', ja: '首里城', at: 'ryukyu', lon: 127.7195, lat: 26.217, from: 1467, to: 1945, wiki: 'Shuri Castle',
    short: 'The palace of the Ryukyu kings from 1429 until Japan annexed the kingdom in 1879. The Japanese defence of Okinawa centred on it in 1945, and the castle was almost completely destroyed.' },
);
{
  const until = { odawara: 1870, kasugayama: 1607, sunpu: 1868, okazaki: 1873, kiyosu: 1610, gifu: 1601, fushimi: 1623,
                  gassantoda: 1611, kurokawa: 1874, edo: 1945, osaka: 1945, himeji: 1945, kumamoto: 1945 };
  for (const c of CASTLES) if (c.id in until) c.to = until[c.id];
  const more = {
    gifu: ' Abandoned in 1601.',
    odawara: ' The castle was pulled down from 1870.',
    osaka: ' The Tokugawa rebuilt it from 1620; it burned again in 1868, and its keep was rebuilt in 1931.',
    kumamoto: ' In 1877 its garrison held it for some fifty days against Saigō Takamori\'s army; the keep burned at the start of the siege.',
    edo: ' In 1868 it became the emperor\'s palace.',
    kurokawa: ' It held out for a month in the siege of 1868 and was pulled down in 1874.',
  };
  for (const c of CASTLES) if (more[c.id]) c.short += more[c.id];
}

PEOPLE.push(
  { id: 'yoshinobu', en: 'Tokugawa Yoshinobu', ja: '徳川慶喜', born: 1837, died: 1913, portrait: 'clan:shogunate',
    roles: [[1867, 1867, 'tokugawa', 'leads'], [1868, 1868, 'shogunate', 'leads']],
    short: 'The fifteenth and last shogun, who handed back power to the emperor, lost the war that followed, and chose not to fight to the end.',
    life: [[1837, 'Born in Edo, a son of the lord of Mito.', null], [1847, 'Adopted into the Hitotsubashi branch of the Tokugawa.', null],
           [1862, 'Becomes guardian of the young shogun.', null], [1867, 'Becomes shogun; in November returns power to the emperor.', 'taisei'],
           [1868, 'Beaten at Toba–Fushimi; flees to Edo and surrenders it.', 'toba'], [1869, 'Retires to Shizuoka, out of public life.', null]] },
  { id: 'saigo', en: 'Saigō Takamori', call: 'Saigō', ja: '西郷隆盛', born: 1828, died: 1877, portrait: 'clan:imperial',
    roles: [[1854, 1867, 'shimazu', 'serves'], [1868, 1869, 'imperial', 'leads'], [1871, 1873, 'empire', 'serves'], [1877, 1877, 'rebels', 'leads']],
    short: 'The samurai of Satsuma who led the emperor\'s army in 1868, served the government he had made, and died leading the last rebellion against it.',
    life: [[1828, 'Born in Kagoshima, son of a low-ranking samurai.', null], [1854, 'Goes to Edo in the service of Satsuma\'s lord, Shimazu Nariakira.', null],
           [1859, 'Exiled to the island of Amami Ōshima; in 1862 exiled again, to harsher Okinoerabu.', null], [1866, 'Agrees the alliance with Chōshū.', null],
           [1868, 'Commands the imperial army; agrees the peaceful surrender of Edo.', 'edo1868'], [1871, 'Joins the new government in Tokyo.', null],
           [1873, 'Resigns when the government refuses his plan for Korea.', null], [1877, 'Leads the Satsuma Rebellion; dies at Shiroyama.', 'seinan']] },
  { id: 'ryoma', en: 'Sakamoto Ryōma', ja: '坂本龍馬', born: 1836, died: 1867, portrait: 'person:ryoma', landless: 'a rōnin, outside any domain',
    roles: [[1836, 1861, 'tozama', 'serves']],
    short: 'A samurai of Tosa who left his domain, became Katsu Kaishū\'s pupil, and brought Satsuma and Chōshū together against the shogunate. He was murdered a month after the shogun gave up power.',
    life: [[1836, 'Born in Kōchi, in the domain of Tosa.', null],
           [1853, 'Studying swordsmanship in Edo when Perry\'s ships arrive.', 'perry'],
           [1862, 'Leaves Tosa without leave. Sets out to kill Katsu Kaishū, and becomes his pupil instead.', null],
           [1864, 'Takes refuge with Satsuma in Kagoshima.', null],
           [1865, 'Founds the Kameyama Shachū in Nagasaki, a trading company and private navy.', null],
           [1866, 'Brokers the secret alliance of Satsuma and Chōshū; survives an attack at the Teradaya inn.', null],
           [1867, 'Drafts his "Eight Proposals" for a new government; the shogun hands back power.', 'taisei'],
           [1867, 'Murdered with Nakaoka Shintarō at an inn in Kyoto.', null]] },
  { id: 'kaishu', en: 'Katsu Kaishū', ja: '勝海舟', born: 1823, died: 1899, portrait: 'person:kaishu', landless: 'with the Tokugawa, in Shizuoka',
    roles: [[1823, 1867, 'tokugawa', 'serves'], [1868, 1868, 'shogunate', 'serves'], [1872, 1899, 'empire', 'serves']],
    short: 'A minor shogunate retainer who studied Dutch, sailed the first Japanese ship to America, built the shogun\'s navy, and in 1868 handed Edo to the imperial army without a fight.',
    life: [[1823, 'Born in Edo, son of a minor retainer of the shogun.', null],
           [1855, 'Joins the new naval academy at Nagasaki, under Dutch officers.', null],
           [1860, 'Captains the Kanrin Maru to San Francisco, the first Japanese ship to sail to the West.', null],
           [1862, 'Sakamoto Ryōma comes to kill him and stays as his pupil.', null],
           [1863, 'Runs the naval school at Kobe.', null],
           [1868, 'Agrees the surrender of Edo castle with Saigō Takamori.', 'edo1868'],
           [1873, 'First Minister of the Navy of the new state.', null], [1899, 'Dies, a count of the empire.', null]] },
);
