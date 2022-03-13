/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ALL_CHAINS } from '../../models';

describe('Chains Format Validation', () => {
  describe('ADA', () => {
    const cases = [
      'addr1w999n67e86jn6xal07pzxtrmqynspgx0fwmcmpua4wc6yzsxpljz3',
      'addr1qy5nqq2qxp76n3xd4wshl4m6ykx52nzfqk950ccc438jwu85qg0a3mf3x6hegmc2s4z3qwcxrwlsexw2wy4ud4dfl4eqx650nz',
      'addr1qyu098z354kwl6cgatxjluqy59zg4n6qg8wslv2mcaq50a4nfga9055cfsaelmah03y0grv4t8hwf9gx50lkwkv26jys0x5sjm',
      'addr1q8fvhvstnpw25rxdrdlymjnngsvxzexnqmrmal63uargtutv4fzscx4ta2x8vl72wz38vjwkvufxw4xcxmf6rxwujpqqqje3ll',
      'addr1v94z0l2l7eexfuw4qpqq87z2khf7d6hd0lr92rz772s6w5q26hysn',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ADA')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ATOM', () => {
    const cases = [
      'cosmos1ug4fwtd7t9slhundztj2rsdyxnmgvuhge7pcdw',
      'cosmos15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74',
      'cosmos1vk6dvjzyqgzuj2yvfam55ewxwcnea34m36m57s',
      'cosmos1k0kw7zchz4grl9tnta2529upr92g26wr4g699k',
      'cosmos12pwmp5rned75hpn82z5vkecez2ngr4zxmdqwdl',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ATOM')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('BAND', () => {
    const cases = [
      'band1hlj3cuvvvqn8kzc3kl075u24cfr8nsek76lj98',
      'band1gwfjrw2cw5q3pqupnxwlpa089q6ujaa94z3963',
      'band1zpspqxpgq5kkk3209d3fce7e6gmpk6cy4n4s4t',
      'band13e0m8mptdpk6jduagjse8wnrzwgmjsu4ml35mk',
      'band1lrakj39k2ledcahdktye5ugjgzhz445ntg5rll',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BAND')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('BEP20 (BSC)', () => {
    const cases = [
      '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0',
      '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0',
      '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0',
      '0x4982085c9e2f89f2ecb8131eca71afad896e89cb',
      '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BSC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('BEP2 (BNB)', () => {
    const cases = [
      'bnb16393jwffdxu75xcj679zcmhgmfmvq7su99jz9t',
      'bnb1z35wusfv8twfele77vddclka9z84ugywug48gn',
      'bnb1s3f8vxaqum3pft6cefyn99px8wq6uk3jdtyarn',
      'bnb1e94a756ytemd4l73ecdfeur4kvvykn9wn4ru25',
      'bnb13zrtzlxkyr3h3wdn6tqlpy24x3vgg7w9h7tn3h',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BNB')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('Bitcoin (BTC)', () => {
    const cases = [
      '37XuVSEpWW4trkfmvWzegTHQt7BdktSKUs',
      'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97',
      '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
      '38UmuUqPCrFmQo4khkomQwZ4VbY2nZMJ67',
      'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BTC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('Bitcoin Cash (BCH)', () => {
    const cases = [
      'qqa0dwrk79um6wgmzk9rrv303l2qwppuk5vmr8taqq',
      'qrupkpwuk98z8namft7kgmtps93dtnrnhutzvjahfv',
      'qrlg8z5ev760275cctddj47n6yuf6rltyuuljm9mu5',
      'qrmspnxmlmrchpt092vhyzqv9vzcefscuyfxmqpnjf',
      'qpyyxvpyw4lu38rtrulpa680nmactre6lvpcz4zpzs',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BCH')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('Bitcoin Gold (BTG)', () => {
    const cases = [
      'AVUkERUnQLxi3a57zP9icKgptKbtYwYFqM',
      'ASVtTH3jLzwzT4csTqyPDLnQJQ384MqutS',
      'AKmwX1CjWaJrvVeZyuTxN7DVL2XMacoDba',
      'Ac9FnwXUBo6GGz6fcYXiUYXFE6iHtYgqjP',
      'ATTav2PtmotBZwxgWjrZCgaZpE89kcJ29B',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'BTG')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('DASH', () => {
    const cases = [
      'XksFbQwBcrHe8Vf42KTPaTPxCHfUFsDCGV',
      'XjMtKWs4THGDHxef9h2XhDX4wkxqQ1LDWz',
      'XvTT2qw47u2tqpjnY2DroHZ5gqzo7NqRH7',
      'XeBhRTXxHdzzPRrE8PvD6uj3znhEZuaPuD',
      'XvcnoCQAH7sSp1jh5KYjpZ22yq6jptw4Wz',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'DASH')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('DGB', () => {
    const cases = [
      'D8aqBgYRNeLgdJ6i3sF9arFTkbtsY9NLvR',
      'DELKpcEv79CGCjZ6Xx7HXnMSpAPhjc7BPo',
      'DEyHcgHBSseXbcfCxyUASvNMF9BVLAEAUi',
      'DFf3P5fE4ckcQnCTdvNtbmUjdL24gXZMVr',
      'DBUcFmUtngK2qnp4fLYzHgzt5VtjV3GwMo',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'DGB')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('DOGE', () => {
    const cases = [
      'DMr3fEiVrPWFpoCWS958zNtqgnFb7QWn9D',
      'D6uyGk16KjveySPFuV7sujaYWARuSqjhJg',
      'DH1fvDBnfZeKNtWzg7sgnS8xiMveh5GTjm',
      'DDxVsRD5MGVcDRV5VSmTg4CALT8EMumwBW',
      'DNKMuuHkuqDJ2uwcUUkPN2nMP2R7cfcbxe',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'DOGE')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('EOS', () => {
    const cases = ['playuplandme', 'push.sx', 'oracle.defi', 'hezdsnryhage', 'gbitokencoin'];

    const chain = ALL_CHAINS.find((c) => c.name === 'EOS')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ERC20 (ETH)', () => {
    const cases = [
      '0xba7f8b5fb1b19c1211c5d49550fcd149177a5eaf',
      '0x206376e8940e42538781cd94ef024df3c1e0fd43',
      '0xdf7ff54aacacbff42dfe29dd6144a69b629f8c9e',
      '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b',
      '0x144e0e99e871fddc76a1e72f8357b9fec58d9b70',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ETH')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ETC', () => {
    const cases = [
      '0x5756980e54d7cce3a2bc18fb58c8eb9863dd58e5',
      '0xd67a3679050331d0708639bdfe23d48533bec41f',
      '0x45d022c169c1198c29f9cbe58c666fc8d1bb41f1',
      '0x0b2c43f70d862fcfb67c75276d94ef8b329b5650',
      '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ETC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('FTM', () => {
    const cases = [
      '0xA4CE312A62f1940e5FCb72D2296706dF10BDAbEf',
      '0x28b01538a6BA098a283Fe7E69811E4164DAb7a84',
      '0x06e8B44333C32df7560490D3E2BfC55e14636372',
      '0x0E3085c3Ed7B3E7F03780bF4230772E8E0F2E441',
      '0x2b616855bcD1753aeF16157fA0C3Ccc599C68917',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ETC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('NANO', () => {
    const cases = [
      'nano_1x6qw7x85qw1eacugc6ap95gtx4d8uzp6ws83w8dmydh1pma3o8qkuxidfnr',
      'nano_1jze45fugj18yaj1f53ihg9k64u93xsfmsaipwhkeonm5hbgacn6s7apydt4',
      'nano_3omhze59yuo5gpwjjed7q8ixegugx7nfohafrnd1kcn7asmqrtofcpjqdspw',
      'nano_3ases8xsf1dcsqsafjjgsqutmcb76ooeq761wcxgkersehrm8t417fz7krxp',
      'nano_3tbis4mfwusp4cnkb3mzx3wdqr3yziq6h6zwhs5tt7h89xawahoschwnmhi4',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'NANO')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('NEO', () => {
    const cases = [
      'AWjvTDuUHQLReAKj5ppqsvRRNtu4GhWmbU',
      'AZ3JaZ9myjiW98hwLvc3F4RQVvVX4Pm83M',
      'AKDVzYGLczmykdtRaejgvWeZrvdkVEvQ1X',
      'AXvbEb4TEy86LSaeMTZ57esTtgeqWeCF6q',
      'AJzoeKrj7RHMwSrPQDPdv61ciVEYpmhkjk',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'NEO')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ICX', () => {
    const cases = [
      'hx8913f49afe7f01ff0d7318b98f7b4ae9d3cd0d61',
      'hx409884e7f8dbec5ea0032619d2bd1361d581db5e',
      'hx980ab0c7473013f656339795a1c63bf44898ce95',
      'hx6b38701ddc411e6f4e84a04f6abade7661a207e2',
      'hxa2c9f82aef9bf1e34f171462f097f5888a3c55b5',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ICX')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('KCC', () => {
    const cases = [
      '0xba832e3adfb6943f3cd420a459052f406838eac5',
      '0xeb100036e07b7eb1e1aebb17fd087aa03a3ea6ab',
      '0x32900c29948ce1c098984678cf3e6afbb404dd15',
      '0x196bc0bd331cf5edafbc028f30582b8b58defbf6',
      '0x2d1039a8159740c65cab40f5225f8c4302fa245e',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'KCC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('LSK', () => {
    const cases = ['3975649959792505193L', '16437239348023464007L', '7375935243044347605L', '11358917037272540595L', '4030037007922112965L'];

    const chain = ALL_CHAINS.find((c) => c.name === 'LSK')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('LTC', () => {
    const cases = [
      'MR6ENNaoMXsVzmPRwHKwhNfDJ3NeMu9MJx',
      'ltc1qs9fcy6mmkn2mvvvundhcfq59d4lt23qns9mjqc',
      'LZEjckteAtWrugbsy9zU8VHEZ4iUiXo9Nm',
      'LectSLekhkxEQBHofNFHa3pVHndnb4Z9fN',
      'MMWVvHgwRjnhBhk38mstNbvT16DCyAU1Va',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'LTC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('MATIC (Polygon)', () => {
    const cases = [
      '0x26E44f4ADCc49189B4f18DD8d07d8dB1E4E8f2Cd',
      '0x94788309d420ad9f9f16d79fc13ab74de83f85f7',
      '0x5cb83a331f08a906c9712db6d6aa0184471318cd',
      '0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9',
      '0x3ce07ad298ee2b3aabea8c8b3f496c3acc51e647',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'MATIC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('QTUM', () => {
    const cases = [
      'QhcUVpdns3wUgSPpvM5dqJVyQhANBZ48Lt',
      'MTsianH2u4iS6R8ofyLXPeNA4xv1FuQ4TA',
      'QTELDP95V3Wywus7RZCkyYck52BuYhTNQe',
      'QSjSR5e1jxvhiGzwk8gfu7BYfU1h69rQD4',
      'QcutdhEQzMzxpf4TeyARdoJGayqJ2ndaHz',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'QTUM')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('RVN', () => {
    const cases = [
      'RRQmbdHHNwEkVsZoVWtGR51WdU8RkLhTTi',
      'RRS7bLhVpG3yaZ5ewQjs7GgNpP6uXoF151',
      'RUciYsJoYDKmCS8mWzedZbxkuT3MxjA9c5',
      'RW1gxY4q6iZpu6XkRxp3mmNxiHRbQbTxVY',
      'RVuPEveZJrWjoyKTmNfM9f1kfh8jwwtNow',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'RVN')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('SC (Siacoin)', () => {
    const cases = [
      '4948c07850bc2843f2b9d1d813326cbbfd1c4aa729c8c04e93e2da3b8dd25f61829ecaef3dd8',
      '0001a32a1bfe722965b1127e08d7539357b530eec3b2f2038c399d8368e1065c871123d2a038',
      'ea25f1a3d02ac7a45bc2c2e9d30fa5f5da26e1b515f25b18fcc9e85347dbc65ce0c0984c6223',
      'f7da03d7efeb7ed0e1a0918bf1d256d5afacf488ee8d4f5938c8de234641f06425a32c654b25',
      '6b24e82fffdc679a728123f91f76863c571f71828089b57f5b468ea608651a775bb34d3dc6a1',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'SC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('SOL (Solana)', () => {
    const cases = [
      'DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy',
      '2UuVd6BMW97MRnj7mCpq8PhYmqmUYuojvDkqWstwASCm',
      '3qmEGZpEUFYxXiLU5CZjSaUy2X28oV51qVLenKEutYDe',
      'BEL5CeekyNyWdocqr2YXTVVvYwzeActXNGMPJhmvFVsb',
      '4VLLdnsisL5TeQqD7ZzMxWtJGR5DDfJ7Xbywxz8toDD8',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'SOL')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('TRC20 (TRX)', () => {
    const cases = [
      'TGDJSP555p5H4uqcxL8tuQvMaV3Ty63Q27',
      'TGXKnRymvNgzXTia6WagaSraGe7QTbajYe',
      'TRdS4yVnSk54yUdnuT6oRGRKybnjERk7fZ',
      'TCPDofEwp7xor4Uu5KsSQ3EZ8CmAhcVbBs',
      'TH5uK3YN7XHDXLSpb6xy1kdZDcZEpqRp8D',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'TRX')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('VET (VeChain)', () => {
    const cases = [
      '0xAa629877DC748FF4106AA0Ff3369FaaE6e84a747',
      '0x2c593298dc0913E2bB43B383BE74132DD3D98E0c',
      '0xD6d918Cb7870C5752fe033C3461dB32BcdB64Fbd',
      '0x8eE3b768b460D9a199e2C19eDA7935f37B4a7B6E',
      '0xD6d918Cb7870C5752fe033C3461dB32BcdB64Fbd',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'VET')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('WAVES', () => {
    const cases = [
      '3PNMYZEJvMFpsAtuGszT4pmZkGuq6wkm2C3',
      '3PGFHzVGT4NTigwCKP1NcwoXkodVZwvBuuU',
      '3PNoTERycbCUStb1C7iYXmS2fHcUs2sMCnz',
      '3PJAg4A4gPQXtSLKQNAf5VxbXV2QVM9wPei',
      '3PDrYPF6izza2sXWffzTPF7e2Fcir2CMpki',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'WAVES')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('XLM (Stellar)', () => {
    const cases = [
      'GAZZB5KPOWEWK4C5S5H5B6YPR2EQMUIJEFFBNQ6MWYYAG7DOEELBOHLW',
      'GAI3GJ2Q3B35AOZJ36C4ANE3HSS4NK7WI6DNO4ZSHRAX6NG7BMX6VJER',
      'GAYTPLDTSCZUGW6HXIF5Z5UBVNANOTWZS3435IYZD2KUYZHERQ3DEMIO',
      'GCUXXSRLN3FS5JUI5OSFOZGIZHQDAF4EJN3AQWQ4WQKVMBOPMA7JJM35',
      'GAGDTJNYKR7BIH6TZCMQSUPVPYUPXFEXJD6N6ID4CQPWQA4MNWTZMOY7',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'XLM')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('XRP (Ripple)', () => {
    const cases = [
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
      'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
      'r4KapTupp7ba9DA2XgbCvY3f69bQzh62LX',
      'rGfwgkSXidEiwPmFhr93hSSCgkxrHGygsH',
      'rs9edq1mv5Pt8w98cB1ZcoNdoZFRAKfund',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'XRP')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('XTZ (Tezos)', () => {
    const cases = [
      'tz1YdqGLH3ak8YowN26phPgSfaywtyqbPzAw',
      'tz1YUUyEuRKATY6EXjaNMhQGjCY714KmbYFF',
      'tz1TFdQV1tt8UkorpBFahndn7rwZCg1oNdWi',
      'tz1SZxvD3FHWys9XZEzUZXH6ArzGuNHLUiUJ',
      'tz1VJzyc6TgS7snvSqvXEfETKAEWAdKsgGuV',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'XTZ')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('XVG (Verge)', () => {
    const cases = [
      'DQkwDpRYUyNNnoEZDf5Cb3QVazh4FuPRs9',
      'DP3GZ3p9jQSumFcVpAj4MTHLaQd4TLh76N',
      'DDBLi87cUQPFzkyiXYwkJ5Ceu3PLDnL3Gs',
      'DLCDJhnh6aGotar6b182jpzbNEyXb3C361',
      'DDjSVDQbefecwo9cecq9LTRhighCiUgpkR',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'XVG')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ZEC (ZChain)', () => {
    const cases = [
      't1QQzmFKJ2mBtGqemrVZoL8eJAjWykBeiHK',
      't3S3yaT7EwNLaFZCamfsxxKwamQW2aRGEkh',
      't1QmhHooCM7a5sZFtNWEWjzSFfY7Ymz1AAy',
      't1XwfXEX7FmTo5eLNPDAUQEXJVmorFpXtYJ',
      't1UrKL7p9JtFBDpPkEp5qdHu7RxPAaJ6kMo',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ZEC')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });

  describe('ZIL (Zilliqa)', () => {
    const cases = [
      'zil1h6ggq9rwqde72a27mp7eaa5u3y0hq9l69u9p2c',
      'zil10eg50z4f2tde84pl30hu35aw45pu2wksxzaug9',
      'zil1gkwt95a67lnpe774lcmz72y6ay4jh2asmmjw6u',
      'zil1p5suryq6q647usxczale29cu3336hhp376c627',
      'zil17rpyuuf3vw4z0jfhqyc04fw2mnpffwj9w9na5p',
    ];

    const chain = ALL_CHAINS.find((c) => c.name === 'ZIL')!;
    const format = new RegExp(chain.token_format);

    test.each(cases)('Should match %p', (address) => {
      // Act.
      const result = format.test(address);

      // Assert.
      expect(result).toBe(true);
    });
  });
});
