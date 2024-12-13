function toUrl() {
  const CHANNELS = 1;
  const SAMPLE_RATE = 44100;
  const BITS_PER_SAMPLE = 16;
  const DURATION_SECONDS = 273;
  const SAMPLES = SAMPLE_RATE * DURATION_SECONDS * CHANNELS;
  const SPACE_MULTIPLYER = BITS_PER_SAMPLE / 8;

  // The data starts at byte 44 after the header
  const dataView = new DataView(new ArrayBuffer(44 + SAMPLES * SPACE_MULTIPLYER));

  // bytes 0 - 3 : Chunk ID "RIFF"
  dataView.setUint8(0, "R".charCodeAt(0));
  dataView.setUint8(1, "I".charCodeAt(0));
  dataView.setUint8(2, "F".charCodeAt(0));
  dataView.setUint8(3, "F".charCodeAt(0));
  // bytes 4 - 7 : ChunkSize 36 + Subchunk2 size (little endian)
  dataView.setUint32(4, 36 + SAMPLES * SPACE_MULTIPLYER, true);
  // bytes 8-11 : Format "WAVE"
  dataView.setUint8(8, "W".charCodeAt(0));
  dataView.setUint8(9, "A".charCodeAt(0));
  dataView.setUint8(10, "V".charCodeAt(0));
  dataView.setUint8(11, "E".charCodeAt(0));

  // fmt Chunk
  // bytes 12-15 : Subchunk1ID fmt in 4 bytes (big endian)
  dataView.setUint8(12, "f".charCodeAt(0));
  dataView.setUint8(13, "m".charCodeAt(0));
  dataView.setUint8(14, "t".charCodeAt(0));
  dataView.setUint8(15, " ".charCodeAt(0));
  // bytes 16-19 : Subchunk1Size it's always 16 (little endian)
  dataView.setUint32(16, 16, true);
  // bytes 20-21 : AudioFormat
  // Values other than 1 indicate compression (little endian)
  dataView.setUint16(20, 1, true);
  // bytes 22-23 : NumChannels How many channels? (little endian)
  dataView.setUint16(22, CHANNELS, true);
  //bytes 24-27 : SampleRate (little endian)
  dataView.setUint32(24, SAMPLE_RATE, true);
  // bytes 28-31 : ByteRate
  // SampleRate * NumChannels * BitsPerSample/8 (little endian)
  dataView.setUint32(28, SAMPLE_RATE * CHANNELS * SPACE_MULTIPLYER, true);
  // bytes 32-33 : BlockAlign NumChannels * BitsPerSample/8 (little endian)
  dataView.setUint16(32, CHANNELS * SPACE_MULTIPLYER, true);
  //bytes 34-35 : BitsPerSample 8 bits = 8, 16 bits = 16, etc. (little endian)
  dataView.setUint16(34, BITS_PER_SAMPLE, true);

  // DATA Chunk
  // bytes 36-39 : Subchunk2ID The letters data
  dataView.setUint8(36, "d".charCodeAt(0));
  dataView.setUint8(37, "a".charCodeAt(0));
  dataView.setUint8(38, "t".charCodeAt(0));
  dataView.setUint8(39, "a".charCodeAt(0));
  // bytes 40-43 : Subchunk2Size The size of the data
  // NumSamples * NumChannels * BitsPerSample/8
  dataView.setUint32(40, SAMPLES * SPACE_MULTIPLYER, true);

  // bytes 44 -> : the data (little endian)
  for (let i = 0, offset = 44; i < SAMPLES; i++, offset += 2) {
    dataView.setInt16(offset, 0, true);
  }

  const blob = new Blob([dataView], { type: "audio/wav" });
  return URL.createObjectURL(blob);
};
