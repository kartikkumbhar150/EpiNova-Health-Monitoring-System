// Temporary placeholder for Metro symbolication.
// Metro sometimes tries to read this file when producing JS stack traces
// (InternalBytecode). Creating a no-op file stops ENOENT spam in dev logs.

// Keep this file minimal. If you upgrade Expo/Metro and the errors stop,
// you can safely remove this file.

module.exports = {};
