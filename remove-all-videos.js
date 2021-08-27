(async () => {
  const scroll = (top) => window.scrollTo({ top });
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  async function loadFullPlaylist() {
    let pageHeight = 0;
    do {
      pageHeight = document.body.clientHeight;
      scroll(pageHeight);
      await delay(250);
    } while (pageHeight < document.body.clientHeight);
  }

  function parseVideos() {
    return [...document.querySelectorAll('.video_item')];
  }

  async function deleteVideos(list) {
    const queue = [...list];
    const bulkSize = 80;
    do {
      const chunk = queue.splice(0, bulkSize);
      for (const item of chunk) {
        const deleteBtn = item.querySelector('.video_thumb_action_delete');
        deleteBtn.click();
      }
      await delay(350);
    } while (queue.length);
  }

  // Main
  await loadFullPlaylist();
  const list = parseVideos();
  await deleteVideos(list);
})();
