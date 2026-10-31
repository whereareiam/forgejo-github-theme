(() => {
  // The code view's file tree keeps the file lists of recent commits in a database per signed-in user
  // (repo-source-browser.js). Once someone else, or nobody, is signed in in this browser, delete the other databases, so
  // the file lists of private repositories do not outlast the session that could see them.
  const current = `repo-source-tree:${document.currentScript.dataset.viewer}`;
  try {
    indexedDB
      .databases()
      .then(databases => {
        for (const { name } of databases)
          if (name?.startsWith("repo-source-tree") && name !== current) indexedDB.deleteDatabase(name);
      })
      .catch(() => {
        /* Nothing stored. */
      });
  } catch {
    /* No IndexedDB, or no way to list its databases. */
  }
})();
