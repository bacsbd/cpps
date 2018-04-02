const fourDigits = '^\\d{4}$';
const capitalAlphaNumeric = '^[A-Z0-9_]+$';
const normal = '^[A-Za-z0-9_\\-.]+$';
const digitsOnly = '^\\d+$';

// TODO: Show full names in bracket

const data = [
  {
    name: 'atc',
    displayName: 'AtCoder',
    format: '^[a-z0-9_]+_[a-z]$',
    usernamePattern: normal,
    profileLink: 'http://kenkoooo.com/atcoder/?user=$$$$$',
  },
  {
    name: 'cc',
    displayName: 'CodeChef',
    format: capitalAlphaNumeric,
    usernamePattern: normal,
    profileLink: 'https://www.codechef.com/users/$$$$$',
  },
  {
    name: 'cf',
    displayName: 'Codeforces',
    format: '^\\d+[A-Z]$',
    usernamePattern: normal,
    profileLink: 'http://codeforces.com/profile/$$$$$',
  },
  {
    name: 'csa',
    displayName: 'CSAcademy',
    format: normal,
    usernamePattern: normal,
    profileLink: 'https://csacademy.com/user/$$$$$',
  },
  {
    name: 'hdu',
    displayName: 'HDU',
    format: fourDigits,
    usernamePattern: normal,
    profileLink: 'http://acm.hdu.edu.cn/userstatus.php?user=$$$$$',
  },
  {
    name: 'loj',
    displayName: 'LightOJ',
    format: fourDigits,
    usernamePattern: digitsOnly,
    profileLink: 'http://www.lightoj.com/volume_userstat.php?user_id=$$$$$',
  },
  {
    name: 'poj',
    displayName: 'POJ',
    format: fourDigits,
    usernamePattern: normal,
    profileLink: 'http://poj.org/userstatus?user_id=$$$$$',
  },
  {
    name: 'spoj',
    displayName: 'SPOJ',
    format: capitalAlphaNumeric,
    usernamePattern: normal,
    profileLink: 'http://www.spoj.com/users/$$$$$',
  },
  {
    name: 'uva',
    displayName: 'UVa Online Judge',
    format: '^\\d{3,5}$', // 3 to 5 digits
    usernamePattern: normal,
    profileLink: 'http://uhunt.onlinejudge.org/u/$$$$$',
  },
  {
    name: 'vjudge',
    displayName: 'VJudge',
    profileLink: 'https://vjudge.net/user/$$$$$',
  },
];

const ojnamesOnly = data.map((x)=>x.name);

module.exports = {
  data,
  ojnamesOnly,
};
