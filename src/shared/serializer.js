const CHIP_ID_BITS = 8;
const PEG_ID_BITS = 7;
const OWNER_ID_BITS = 3;
const POSITION_BITS = 10;
const ANGLE_BITS = 10;
const SCORE_BITS = 6;

const BITS_PER_CHIP = 41;
const BITS_PER_PEG = 10;
const BITS_FOR_SCORE = 24;
const BITS_FOR_WINNER = 1;
const BITS_FOR_TARGET_SCORE = 6;

export default class Serializer {
  static toBinary(num, bitLength) {
    let output = '';
    for (let i = 0; i < bitLength; i++) { output += '0' };
    output += Number(num).toString(2);
    return output.slice(-(bitLength), output.length);
  }

  static fromBinary(numStr) {
    return parseInt(numStr, 2);
  }

  static encodeChip(chip) {
    let encoded = '';

    // Account for negative radians
    if (chip.angle < 0) {
      chip.angle = Math.PI * 2 + chip.angle;
    }

    encoded += this.toBinary(chip.id, CHIP_ID_BITS);
    encoded += this.toBinary(chip.ownerId, OWNER_ID_BITS);
    encoded += this.toBinary(Math.floor(chip.x), POSITION_BITS);
    encoded += this.toBinary(Math.floor(chip.y), POSITION_BITS);
    encoded += this.toBinary(chip.angle.toFixed(3) * 1000, ANGLE_BITS);

    return encoded;
  }

  static decodeChip(encodedChip) {
    return {
      id:      this.fromBinary(encodedChip.substr(0, CHIP_ID_BITS)),
      ownerId: String(this.fromBinary(encodedChip.substr(8, OWNER_ID_BITS))),
      x:       this.fromBinary(encodedChip.substr(11, POSITION_BITS)),
      y:       this.fromBinary(encodedChip.substr(21, POSITION_BITS)),
      angle:   this.fromBinary(encodedChip.substr(31, ANGLE_BITS)) / 1000,
    };
  }

  static encodePeg(peg) {
    let output = '';

    // ownerIds are 0-3, but can be null if there is no peg owner
    // So if ownerId is null, encode it as 0
    // Otherwise, increase by 1 (then substract when decoding)
    const ownerId = peg.ownerId === null ? 4 : peg.ownerId;

    output += this.toBinary(peg.id, PEG_ID_BITS);
    output += this.toBinary(ownerId, OWNER_ID_BITS)

    return output
  }

  static decodePeg(encodedPeg) {
    let peg = {};

    peg.id = this.fromBinary(encodedPeg.substr(0, PEG_ID_BITS));
    let ownerId = +this.fromBinary(encodedPeg.substr(7, OWNER_ID_BITS));
    peg.ownerId = ownerId === 4 ? null : String(ownerId);

    return peg
  }

  static encodeScore(score) {
    let output = '';

    output += this.toBinary(score[0], SCORE_BITS);
    output += this.toBinary(score[1], SCORE_BITS);
    output += this.toBinary(score[2], SCORE_BITS);
    output += this.toBinary(score[3], SCORE_BITS);

    return output;
  }

  static decodeScore(encodedScore) {
    return {
      0: this.fromBinary(encodedScore.substr(0, SCORE_BITS)),
      1: this.fromBinary(encodedScore.substr(6, SCORE_BITS)),
      2: this.fromBinary(encodedScore.substr(12, SCORE_BITS)),
      3: this.fromBinary(encodedScore.substr(18, SCORE_BITS))
    }
  }

  static encodeWinner(winner) {
    return this.toBinary(winner ? '1' : '0', 1);
  }

  static decodeWinner(encodedWinner) {
    const winner = encodedWinner === '1' ? true : false;
    return winner;
  }

  static encodeTargetScore(targetScore) {
    return this.toBinary(targetScore, SCORE_BITS);
  }

  static decodeTargetScore(encodedTargetScore) {
    return this.fromBinary(encodedTargetScore.substr(0, SCORE_BITS));
  }

  static stringToBuffer(encoded) {
    const BITS_IN_BYTE = 8;

    // Plus 1 for offset marker
    const byteLength = Math.ceil(encoded.length / 8) + 1
    const arr = new Uint8Array(byteLength)
    const offset = 8 - encoded.length % 8
    arr[0] = offset % 8

    while (encoded.length % 8 !== 0) {
      encoded = '0' + encoded
    }

    let index = 1;

    while (index < byteLength) {
      const chunk = parseInt(encoded.substr((index - 1) * BITS_IN_BYTE, BITS_IN_BYTE), 2);
      arr[index] = chunk
      index++
    }

    return new Buffer(arr)
  }

  static bufferToString(buffer) {
    const arr = new Uint8Array(buffer)
    let str = '';
    const offset = arr[0];

    arr.forEach(chunk => {
      let output = ('00000000' + chunk.toString(2))
      str += output.slice(-8, output.length)
    })

    return str.slice(8 + offset)
  }

  static encode({ chips, pegs, score, winner, targetScore }) {
    // let start = Date.now();
    let encoded = '';

    // Prepend the number of chips that need to be decoded
    // Up to 256 chips, so 8 bits required
    encoded += this.toBinary(chips.length, 8)

    for (let chip of chips) {
      encoded += this.encodeChip(chip)
    }

    // Prepend the number of pegs that need to be decoded
    // Always 68 so 7 bits required
    encoded += this.toBinary(pegs.length, 7)

    for (let peg of pegs) {
      encoded += this.encodePeg(peg)
    }

    encoded += this.encodeWinner(winner);
    encoded += this.encodeTargetScore(targetScore);
    encoded += this.encodeScore(score)

    // console.log("Encoding took: ", Date.now() - start)
    // return encoded
    return this.stringToBuffer(encoded)
  }

  static decode(buffer) {
    const encodedSnapshot = this.bufferToString(buffer)
    // const encodedSnapshot = buffer

    if (!encodedSnapshot) { throw new Error('Must supply encoded snapshot')}
    const chips = [];
    const pegs = [];

    // First 8 bits determine number of chips in snapshot
    const numChips = this.fromBinary(encodedSnapshot.substr(0, 8))
    const chipsEnd = 8 + numChips * BITS_PER_CHIP

    // Deserialize chips
    for (let i = 0; i < numChips; i++) {
      const chipStart = 8 + i * BITS_PER_CHIP
      chips.push(this.decodeChip(encodedSnapshot.substr(chipStart, BITS_PER_CHIP )))
    }

    // Next 7 bits determine number of pegs
    const numPegs = this.fromBinary(encodedSnapshot.substr(chipsEnd, 7))
    const pegsEnd = 7 + numPegs * BITS_PER_PEG;

    // Deserialize Pegs
    for (let i = 0; i < numPegs; i++) {
      const pegStart = chipsEnd + 7 + BITS_PER_PEG * i;
      pegs.push(this.decodePeg(encodedSnapshot.substr(pegStart, BITS_PER_PEG)))
    }

    // Deserialize winner
    const winnerStart = chipsEnd + pegsEnd;
    const winner = this.decodeWinner(encodedSnapshot.substr(winnerStart, BITS_FOR_WINNER));

    // Deserialize target score
    const targetScoreStart = winnerStart + BITS_FOR_WINNER;
    const targetScore = this.decodeTargetScore(encodedSnapshot.substr(targetScoreStart,  BITS_FOR_TARGET_SCORE));

    // Deserialize score
    const scoreStart = targetScoreStart + BITS_FOR_TARGET_SCORE;
    const score = this.decodeScore(encodedSnapshot.substr(scoreStart, BITS_FOR_SCORE))

    return { chips, pegs, score, winner, targetScore }
  }
}

// For testing

// function rng(n) {
//   return Math.floor(Math.random() * n)
// }
//
// function generateChip(id) {
//   return {
//     id: id,
//     ownerId: rng(4),
//     x: rng(600),
//     y: rng(800),
//     angle: Math.random()
//   }
// }
//
// function generatePeg(id) {
//   let rand = rng(5);
//   let ownerId = rand === 0 ? null : rand - 1;
//   return { id, ownerId };
// }
//
// function generateSnapshot(numChips=10, numPegs=10) {
//   let chips = [];
//   let pegs = [];
//
//   for (let i = 0; i < numChips; i++) {
//     chips.push(generateChip(i))
//   }
//
//   for (let i = 0; i < numPegs; i++) {
//     pegs.push(generatePeg(i))
//   }
//
//   let score = {
//     0: 33,
//     1: 12,
//     2: 0,
//     3: 10,
//   }
//
//   let targetScore = Math.floor(Math.random() * 60);
//   let winner = Math.round(Math.random());
//
//   return { chips, pegs, score, winner, targetScore }
// }

// let numChips = 0;
// let passed = true
// while (passed) {
//   let snapshot = generateSnapshot(numChips, 63);
//   let enc = Serializer.encode(snapshot);
//   let dec = Serializer.decode(enc);
//
//   if (snapshot.chips.length !== dec.chips.length) { console.log(snapshot.chips.length, dec.chips.length) }
//   numChips++
// }

//
//
// let snapshot = generateSnapshot(4, 63);
// let enc = Serializer.encode(snapshot);
// let dec = Serializer.decode(enc)
