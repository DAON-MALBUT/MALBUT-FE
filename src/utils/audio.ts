export async function blobToWavBase64(blob: Blob, targetSampleRate = 16000): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();

  // Decode with a temporary AudioContext
  const decodeCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
  // Close the temporary context to avoid resource leaks
  try {
    await decodeCtx.close();
  } catch (e) {
    // some browsers may not support closing or may throw; ignore
  }

  // Resample using OfflineAudioContext
  const channels = audioBuffer.numberOfChannels;
  const length = Math.ceil(audioBuffer.duration * targetSampleRate);
  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(channels, length, targetSampleRate);
  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start(0);

  const renderedBuffer = await offlineCtx.startRendering();

  // Interleave and encode to 16-bit PCM WAV
  const wavArrayBuffer = encodeWAV(renderedBuffer);

  // Convert to base64
  const bytes = new Uint8Array(wavArrayBuffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.prototype.slice.call(bytes, i, i + chunk));
  }
  const base64 = btoa(binary);
  return base64;
}

function encodeWAV(audioBuffer: AudioBuffer): ArrayBuffer {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM

  const samples = audioBuffer.length;
  const blockAlign = numberOfChannels * 2; // 16-bit
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  /* RIFF identifier */ writeString(view, 0, 'RIFF');
  /* file length */ view.setUint32(4, 36 + dataSize, true);
  /* RIFF type */ writeString(view, 8, 'WAVE');
  /* format chunk identifier */ writeString(view, 12, 'fmt ');
  /* format chunk length */ view.setUint32(16, 16, true);
  /* sample format (raw) */ view.setUint16(20, format, true);
  /* channel count */ view.setUint16(22, numberOfChannels, true);
  /* sample rate */ view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */ view.setUint32(28, byteRate, true);
  /* block align (channel count * bytes per sample) */ view.setUint16(32, blockAlign, true);
  /* bits per sample */ view.setUint16(34, 16, true);
  /* data chunk identifier */ writeString(view, 36, 'data');
  /* data chunk length */ view.setUint32(40, dataSize, true);

  // Write interleaved PCM samples
  let offset = 44;
  const channelData = [];
  for (let ch = 0; ch < numberOfChannels; ch++) {
    channelData.push(audioBuffer.getChannelData(ch));
  }

  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < numberOfChannels; ch++) {
      let sample = channelData[ch][i];
      // clamp
      if (sample > 1) sample = 1;
      else if (sample < -1) sample = -1;
      // convert to 16-bit PCM
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
