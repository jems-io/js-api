export const singularize = (word: string): string => {
  if (!word) {
    return word;
  }
  if (irregularRules[word]) {
    return irregularRules[word];
  }
  for (let rule of rules) {
    if (rule[0].test(word)) {
      return word.replace(rule[0], rule[1]);
    }
  }
  return word;
};

const rules: [RegExp, string][] = [
  [/s$/i, ''],
  [/(ss)$/i, '$1'],
  [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
  [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
  [/ies$/i, 'y'],
  [/(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, '$1ie'],
  [/\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, '$1ie'],
  [/\b(mon|smil)ies$/i, '$1ey'],
  [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
  [/(seraph|cherub)im$/i, '$1'],
  [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
  [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
  [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
  [/(test)(?:is|es)$/i, '$1is'],
  [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
  [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
  [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
  [/(alumn|alg|vertebr)ae$/i, '$1a'],
  [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
  [/(matr|append)ices$/i, '$1ix'],
  [/(pe)(rson|ople)$/i, '$1rson'],
  [/(child)ren$/i, '$1'],
  [/(eau)x?$/i, '$1'],
  [/men$/i, 'man'],
];

const irregularRules: { [plural: string]: string } = {
  'we': 'I',
  'us': 'me',
  'they': 'she',
  'them': 'them',
  'ourselves': 'myself',
  'yourselves': 'yourself',
  'themselves': 'itself',
  'are': 'is',
  'were': 'was',
  'have': 'has',
  'these': 'this',
  'those': 'that',
  // Words ending in with a consonant and `o`.
  'echoes': 'echo',
  'dingoes': 'dingo',
  'volcanoes': 'volcano',
  'tornadoes': 'tornado',
  'torpedoes': 'torpedo',
  // Ends with `us`.
  'genera': 'genus',
  'viscera': 'viscus',
  // Ends with `ma`.
  'stigmata': 'stigma',
  'stomata': 'stoma',
  'dogmata': 'dogma',
  'lemmata': 'lemma',
  'schemata': 'schema',
  'anathemata': 'anathema',
  // Other irregular rules.
  'oxen': 'ox',
  'axes': 'axe',
  'dice': 'die',
  'yeses': 'yes',
  'feet': 'foot',
  'eaves': 'eave',
  'geese': 'goose',
  'teeth': 'tooth',
  'quizzes': 'quiz',
  'humans': 'human',
  'proofs': 'proof',
  'carves': 'carve',
  'valves': 'valve',
  'looies': 'looey',
  'thieves': 'thief',
  'grooves': 'groove',
  'pickaxes': 'pickaxe',
  'passersby': 'passerby',
};