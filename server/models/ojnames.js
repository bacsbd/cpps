const fourDigits = '^\\d{4}$';
const capitalAlphaNumeric = '^[A-Z0-9_]+$';

// TODO: Show full names in bracket
module.exports = {
  data: [
    {
      displayName: 'Codeforces',
      name: 'cf',
      format: '^\\d+[A-Z]$',
    },
    {
      name: 'cc',
      displayName: 'CodeChef',
      format: capitalAlphaNumeric,
    },
    // {name: 'CSA'},
    // {name: 'FHC'},
    // {name: 'GCJ'},
    // {name: 'HR'},
    // {name: 'HE'},
    {
      name: 'hdu',
      displayName: 'HDU',
      format: fourDigits,
    },
    // {name: 'LC'},
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
    // {name: 'TJU'},
    // {name: 'Toph'},
    // {
    //   name: 'URAL',
    //   format: fourDigits,
    // },
    // {name: 'URI'},
    {
      displayName: 'UVa Online Judge',
      name: 'uva',
      format: '^\\d{3,5}$', //3 to 5 digits
    },
    // {name: 'UVaLive'},
    {
      displayName: 'VJudge',
      name: 'vjudge',
    },
    // {name: 'ZOJ'},
  ],
};
