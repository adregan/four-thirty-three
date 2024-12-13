(function () {
  var channels = 1;
  var sampleRate = 44100;
  var bitsPerSample = 16;
  var durationSeconds = 273;
  var samples = sampleRate * durationSeconds * channels;
  var spaceMultiplyer = bitsPerSample / 8;

  // The data starts at byte 44 after the header
  var buffer = new ArrayBuffer(44 + samples * spaceMultiplyer);
  var view = new DataView(buffer);

  // bytes 0 - 3 : Chunk ID "RIFF"
  view.setUint8(0, "R".charCodeAt(0));
  view.setUint8(1, "I".charCodeAt(0));
  view.setUint8(2, "F".charCodeAt(0));
  view.setUint8(3, "F".charCodeAt(0));
  // bytes 4 - 7 : ChunkSize 36 + Subchunk2 size (little endian)
  view.setUint32(4, 36 + samples * spaceMultiplyer, true);
  // bytes 8-11 : Format "WAVE"
  view.setUint8(8, "W".charCodeAt(0));
  view.setUint8(9, "A".charCodeAt(0));
  view.setUint8(10, "V".charCodeAt(0));
  view.setUint8(11, "E".charCodeAt(0));

  // fmt Chunk
  // bytes 12-15 : Subchunk1ID fmt in 4 bytes (big endian)
  view.setUint8(12, "f".charCodeAt(0));
  view.setUint8(13, "m".charCodeAt(0));
  view.setUint8(14, "t".charCodeAt(0));
  view.setUint8(15, " ".charCodeAt(0));
  // bytes 16-19 : Subchunk1Size it's always 16 (little endian)
  view.setUint32(16, 16, true);
  // bytes 20-21 : AudioFormat
  // Values other than 1 indicate compression (little endian)
  view.setUint16(20, 1, true);
  // bytes 22-23 : NumChannels How many channels? (little endian)
  view.setUint16(22, channels, true);
  //bytes 24-27 : SampleRate (little endian)
  view.setUint32(24, sampleRate, true);
  // bytes 28-31 : ByteRate
  // SampleRate * NumChannels * BitsPerSample/8 (little endian)
  view.setUint32(28, sampleRate * channels * spaceMultiplyer, true);
  // bytes 32-33 : BlockAlign NumChannels * BitsPerSample/8 (little endian)
  view.setUint16(32, channels * spaceMultiplyer, true);
  //bytes 34-35 : BitsPerSample 8 bits = 8, 16 bits = 16, etc. (little endian)
  view.setUint16(34, bitsPerSample, true);

  // DATA Chunk
  // bytes 36-39 : Subchunk2ID The letters data
  view.setUint8(36, "d".charCodeAt(0));
  view.setUint8(37, "a".charCodeAt(0));
  view.setUint8(38, "t".charCodeAt(0));
  view.setUint8(39, "a".charCodeAt(0));
  // bytes 40-43 : Subchunk2Size The size of the data
  // NumSamples * NumChannels * BitsPerSample/8
  view.setUint32(40, samples * spaceMultiplyer, true);

  // bytes 44 -> : the data (little endian)
  for (var i = 0, offset = 44; i < samples; i++, offset += 2) {
    view.setInt16(offset, 0, true);
  }

  var blob = new Blob([view], { type: "audio/wav" });
  var url = URL.createObjectURL(blob);
  var player = document.querySelector("#player");
  var downloadLink = document.querySelector("#download");

  player.src = url;
  downloadLink.href = url;
  downloadLink.download = "cage_433.wav";
})();
