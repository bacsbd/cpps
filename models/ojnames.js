const fourDigits = '\\d{4}';

// TODO: Show full names in bracket
module.exports = {
  data: [
    {
      name: 'cf',
      format: '^\\d+[A-Z]$',
    },
    // {name: 'CC'},
    // {name: 'CSA'},
    // {name: 'FHC'},
    // {name: 'GCJ'},
    // {name: 'HR'},
    // {name: 'HE'},
    // {
    //   name: 'HDU',
    //   format: fourDigits,
    // },
    // {name: 'LC'},
    // {
    //   name: 'LOJ',
    //   format: fourDigits,
    // },
    // {
    //   name: 'POJ',
    //   format: fourDigits,
    // },
    // {
    //   name: 'SPOJ',
    //   format: '^[A-Z0-9_]+$',
    // },
    // {name: 'TJU'},
    // {name: 'Toph'},
    // {
    //   name: 'URAL',
    //   format: fourDigits,
    // },
    // {name: 'URI'},
    {
      name: 'uva',
      format: '^\\d{3,5}$', //3 to 5 digits
    },
    // {name: 'UVaLive'},
    // {name: 'ZOJ'},
  ],
};
