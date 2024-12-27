const AUDIO_EXT = [".wav", ".mp3", ".mp4", ".aac", ".flac", ".ogg", ".webm"];
const AUDIO_MIME = [
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/flac",
  "audio/ogg",
  "application/ogg",
  "audio/webm",
];

// Given a time in seconds, return a string in the format MM:SS.
const formatTime = (time) => {
  if (time === -1) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Get today's date and time, formatted as YYYY-MM-DD HH:MM:SS.
const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const seconds = today.getSeconds();
  return `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day} ${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

// Get a somewhat unique ID.
const getUniqueId = () => {
  let id = "";
  id += "abcdefghijklmnopqrstuvwxyz".split("")[Math.floor(Math.random() * 26)];
  id += "abcdefghijklmnopqrstuvwxyz".split("")[Math.floor(Math.random() * 26)];
  id += "0123456789".split("")[Math.floor(Math.random() * 10)];
  id += "0123456789".split("")[Math.floor(Math.random() * 10)];
  return (id += Date.now());
};

// Using the FileSystem Access API, open a file picker and return the selected file(s).
const openFilesFromDisk = async () => {
  if (!("showOpenFilePicker" in window)) {
    return await legacyOpenFilesFromDisk();
  }

  // TODO: how to allow selecting a folder?
  const handles = await window.showOpenFilePicker({
    multiple: true,
    types: [
      {
        description: "Audio files",
        accept: {
          "audio/*": AUDIO_EXT,
        },
      },
    ],
  });

  const files = [];
  for (const handle of handles) {
    const file = await handle.getFile();
    if (file.type.startsWith("audio/")) {
      files.push(file);
    }
  }

  return files;
};

const legacyOpenFilesFromDisk = () => {
  // Create an input type file element.
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = [...AUDIO_EXT, ...AUDIO_MIME].join(",");

  // Simulate a click on the input element.
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  input.dispatchEvent(event);

  // Wait for the file to be selected.
  return new Promise((resolve) => {
    input.onchange = (event) => {
      resolve(event.target.files);
    };
  });
};

// Given a string with at least one dot and some text after it, return the part between the start of the string and the last dot.
const getFileNameWithoutExtension = (fileName) => fileName.split(".").slice(0, -1).join(".");

const cookieValue = (key) => document.cookie.split("; ").find((row) => row.startsWith(`${key}=`))?.split("=")[1];

export {
  formatTime,
  getFormattedDate,
  getUniqueId,
  openFilesFromDisk,
  legacyOpenFilesFromDisk,
  getFileNameWithoutExtension,
  cookieValue,
  
};
