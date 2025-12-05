(async () => {
  const scroll = (top) => window.scrollTo({ top });
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  async function scrollPlaylist() {
    const spinner = document.querySelector(".CatalogBlock__autoListLoader");
    let pageHeight = 0;
    do {
      pageHeight = document.body.clientHeight;
      scroll(pageHeight);
      await delay(400);
    } while (
      pageHeight < document.body.clientHeight ||
      spinner?.style.display === ""
    );
  }

  function parsePlaylist() {
    return [...document.querySelectorAll(".audio_row__performer_title")].map(
      (row) => {
        const [artist, title] = [".audio_row__performers", ".audio_row__title"]
          .map((selector) => row.querySelector(selector)?.textContent || "")
          .map((v) => v.replace(/[\s\n ]+/g, " ").trim());

        return [artist, title].join(" - ");
      }
    );
  }

  function saveToFile(filename, content) {
    const data = content.replace(/\n/g, "\r\n");
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.target = "_blank";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Main
  await scrollPlaylist();
  const list = parsePlaylist();

  if (list.length === 0) {
    alert("Music not found");
  } else {
    saveToFile("vk-playlist.txt", list.join("\n"));
  }
})();
