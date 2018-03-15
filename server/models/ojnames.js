const fourDigits = '^\\d{4}$';
const capitalAlphaNumeric = '^[A-Z0-9_]+$';

// TODO: Show full names in bracket

const data = [{
    displayName: 'Codeforces',
    name: 'cf',
    format: '^\\d+[A-Z]$',
  },
  {
    name: 'cc',
    displayName: 'CodeChef',
    format: capitalAlphaNumeric,
  },
  {
    name: 'hdu',
    displayName: 'HDU',
    format: fourDigits,
  },
  {
    name: 'loj',
    displayName: 'LightOJ',
    format: fourDigits,
  },
  {
    name: 'poj',
    displayName: 'POJ',
    format: fourDigits,
  },
  {
    displayName: 'SPOJ',
    name: 'spoj',
    format: capitalAlphaNumeric,
  },
  {
    displayName: 'UVa Online Judge',
    name: 'uva',
    format: '^\\d{3,5}$', //3 to 5 digits
  },
  {
    displayName: 'VJudge',
    name: 'vjudge',
  },
];

const ojnamesOnly = data.map((x)=>x.name);

module.exports = {
  data,
  ojnamesOnly,
};
