const digits = '^\\d+$';
const fourDigits = '^\\d{4}$';

module.exports = {
  data: [
    {
      name: 'CF',
      format: '^\\d+[A-Z]$',
    },
    {name: 'CodeChef'},
    {name: 'CSA'},
    {name: 'FHC'},
    {name: 'GCJ'},
    {name: 'HR'},
    {name: 'HE'},
    {
      name: 'HDU',
      format: fourDigits,
    },
    {name: 'LeetCode'},
    {
      name: 'LOJ',
      format: fourDigits,
    },
    {
      name: 'POJ',
      format: fourDigits,
    },
    {
      name: 'SPOJ',
      format: '^[A-Z0-9_]+$',
    },
    {name: 'TJU'},
    {name: 'Toph'},
    {
      name: 'URAL',
      format: fourDigits,
    },
    {name: 'URI'},
    {
      name: 'UVa',
      format: '^\\d{3,5}$', //3 to 5 digits
    },
    {name: 'UVaLive'},
    {name: 'ZOJ'},
  ],
};
