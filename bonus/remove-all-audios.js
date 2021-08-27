(async () => {
  const scroll = (top) => window.scrollTo({ top });
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  async function loadFullPlaylist() {
    let pageHeight = 0;
    do {
      pageHeight = document.body.clientHeight;
      scroll(pageHeight);
      await delay(450);
    } while (pageHeight < document.body.clientHeight);
  }

  function parseAudioList() {
    return [...document.querySelectorAll('.audio_row')];
  }

  async function deleteAudioList(list) {
    const queue = [...list];
    const bulkSize = 30;
    do {
      const chunk = queue.splice(0, bulkSize);
      for (const item of chunk) {
        const audioData = JSON.parse(item.dataset.audio);

        ajax.post('al_audio.php', {
          act: 'delete_audio',
          oid: audioData[1],
          aid: audioData[0],
          hash: audioData[13]?.split('/')[3],
          restore: 1,
          track_code: audioData[20],
        });

        item.remove();
        await delay(80);
      }
    } while (queue.length);
  }

  // Main
  await loadFullPlaylist();
  const list = parseAudioList();
  scroll(0);
  await deleteAudioList(list);
})();
