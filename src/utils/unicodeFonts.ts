// Utility for generating stylish unicode text styles for WhatsApp and social bios

const normalChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const scriptChars = {
  lower: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
  upper: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
  num: "0123456789"
};

const gothicChars = {
  lower: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
  upper: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
  num: "0123456789"
};

const doubleStruckChars = {
  lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
  upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
  num: "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"
};

const bubbleChars = {
  lower: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ",
  upper: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ",
  num: "⓪①②③④⑤⑥⑦⑧⑨"
};

const boldSansChars = {
  lower: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
  upper: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
  num: "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
};

export interface TextConverterStyle {
  name: string;
  category: string;
  transform: (text: string) => string;
}

function mapChars(text: string, lowerMap: string, upperMap: string, numMap: string): string {
  let result = '';
  // Convert map strings to arrays of code points to handle multi-byte surrogate pairs correctly
  const lowers = Array.from(lowerMap);
  const uppers = Array.from(upperMap);
  const nums = Array.from(numMap);

  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) { // a-z
      result += lowers[code - 97] || char;
    } else if (code >= 65 && code <= 90) { // A-Z
      result += uppers[code - 65] || char;
    } else if (code >= 48 && code <= 57) { // 0-9
      result += nums[code - 48] || char;
    } else {
      result += char;
    }
  }
  return result;
}

export const stylishConverters: TextConverterStyle[] = [
  {
    name: 'Fancy Cursive Script',
    category: 'Calligraphy',
    transform: (text) => mapChars(text, scriptChars.lower, scriptChars.upper, scriptChars.num)
  },
  {
    name: 'Medieval Gothic Blackletter',
    category: 'Gothic',
    transform: (text) => mapChars(text, gothicChars.lower, gothicChars.upper, gothicChars.num)
  },
  {
    name: 'Double-Struck Mathematical',
    category: 'Aesthetic',
    transform: (text) => mapChars(text, doubleStruckChars.lower, doubleStruckChars.upper, doubleStruckChars.num)
  },
  {
    name: 'Bubble Circled Text',
    category: 'Cute',
    transform: (text) => mapChars(text, bubbleChars.lower, bubbleChars.upper, bubbleChars.num)
  },
  {
    name: 'Bold Clean Sans',
    category: 'Modern',
    transform: (text) => mapChars(text, boldSansChars.lower, boldSansChars.upper, boldSansChars.num)
  },
  {
    name: 'Vaporwave Wide Spaced',
    category: 'Retro',
    transform: (text) => text.split('').join(' ')
  }
];
