// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

var networks = {
  bitcoin: {
    magic: 0xd9b4bef9,
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 546, // https://github.com/bitcoin/bitcoin/blob/v0.9.2/src/core.h#L151-L162
    feePerKb: 10000 // https://github.com/bitcoin/bitcoin/blob/v0.9.2/src/main.cpp#L53
  },
  testnet: {
    magic: 0xd9b4bef9,
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 546,
    feePerKb: 10000
  },
  litecoin: {
    magic: 0xd9b4bef9,
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x05,
    wif: 0xb0,
    dustThreshold: 0, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L360-L365
    dustSoftThreshold: 100000, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.h#L53
    feePerKb: 100000 // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L56
  },
  dogecoin: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
    dustSoftThreshold: 100000000, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/main.h#L62
    feePerKb: 100000000 // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/main.cpp#L58
  },
  viacoin: {
    messagePrefix: '\x18Viacoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x47,
    scriptHash: 0x21,
    wif: 0xc7,
    dustThreshold: 560,
    dustSoftThreshold: 100000,
    feePerKb: 100000
  },
  viacointestnet: {
    messagePrefix: '\x18Viacoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x7f,
    scriptHash: 0xc4,
    wif: 0xff,
    dustThreshold: 560,
    dustSoftThreshold: 100000,
    feePerKb: 100000
  },
  gamerscoin: {
    messagePrefix: '\x19Gamerscoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x26,
    scriptHash: 0x05,
    wif: 0xA6,
    dustThreshold: 0, // https://github.com/gamers-coin/gamers-coinv3/blob/master/src/main.cpp#L358-L363
    dustSoftThreshold: 100000, // https://github.com/gamers-coin/gamers-coinv3/blob/master/src/main.cpp#L51
    feePerKb: 100000 // https://github.com/gamers-coin/gamers-coinv3/blob/master/src/main.cpp#L54
  },
  jumbucks: {
    messagePrefix: '\x19Jumbucks Signed Message:\n',
    bip32: {
      public: 0x037a689a,
      private: 0x037a6460
    },
    pubKeyHash: 0x2b,
    scriptHash: 0x05,
    wif: 0xab,
    dustThreshold: 0,
    dustSoftThreshold: 10000,
    feePerKb: 10000
  },
  zetacoin: {
    messagePrefix: '\x18Zetacoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x50,
    scriptHash: 0x09,
    wif: 0xe0,
    dustThreshold: 546, // https://github.com/zetacoin/zetacoin/blob/master/src/core.h#L159
    feePerKb: 10000 // https://github.com/zetacoin/zetacoin/blob/master/src/main.cpp#L54
  }
}

function estimateFee (tx, network) {
  var baseFee = network.feePerKb
  var byteSize = tx.byteLength()

  var fee = baseFee * Math.ceil(byteSize / 1000)
  if (network.dustSoftThreshold === undefined) return fee

  tx.outs.forEach(function (output) {
    if (output.value < network.dustSoftThreshold) {
      fee += baseFee
    }
  })

  return fee
}

// FIXME: 1.5.3 compatibility patch(s)
function patchEstimateFee (network, tx) {
  return estimateFee(tx, network)
}

for (var networkName in networks) {
  var network = networks[networkName]

  network.estimateFee = patchEstimateFee.bind(null, network)
}

module.exports = networks
