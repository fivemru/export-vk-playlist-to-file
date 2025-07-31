(async () => {
  const scroll = (top) => window.scrollTo({ top, behavior: 'smooth' });
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  async function scrollPlaylist() {
    const spinner = document.querySelector('.CatalogBlock__autoListLoader');
    let lastHeight = 0;
    while (true) {
      const scrollHeight = document.body.scrollHeight;
      if (scrollHeight === lastHeight) {
        if (!spinner || spinner.style.display === 'none' || spinner.hidden) break;
      }
      lastHeight = scrollHeight;
      scroll(scrollHeight);
      await delay(1000);
    }
  }

  function parsePlaylist() {
    return [...document.querySelectorAll('.ai_label')].map(row => {
      const title = row.querySelector('.ai_title')?.textContent.trim() || '';
      const artist = row.querySelector('.ai_artist')?.textContent.trim() || '';
      return `${artist} - ${title}`;
    });
  }

  function saveToFile(filename, content) {
    const data = content.replace(/\n/g, '\r\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Main
  await scrollPlaylist();
  const list = parsePlaylist();
  if (list.length === 0) {
    console.warn('Empty song list, possible selectors out-of date. Write to repository maintainers');
  } else {
    saveToFile('vk-playlist.txt', list.join('\n'));
    console.log(`Сохранено ${list.length} треков`);
  }
})();
