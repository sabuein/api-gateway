const exportSongToFile = async (song) => {
    const url = song.type === "file" ? URL.createObjectURL(song.data) : song.id;
    download(url, song.title + ".mp3");
};

const download = (url, fileName) => {
    const link = document.createElement("a");
    link.setAttribute("download", fileName);
    link.setAttribute("href", url);
    link.click();
};

export { exportSongToFile };