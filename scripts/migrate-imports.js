#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const pathUpdates = {
};

async function main (paths = [ 'contracts' ]) {
  const files = await listFilesRecursively(paths, /\.sol$/);

  const updatedFiles = [];
  for (const file of files) {
    if (await updateFile(file, updateImportPaths)) {
      updatedFiles.push(file);
    }
  }

  if (updatedFiles.length > 0) {
    console.log(`${updatedFiles.length} file(s) were updated`);
    for (const c of updatedFiles) {
      console.log('-', c);
    }
  } else {
    console.log('No files were updated');
  }
}

async function listFilesRecursively (paths, filter) {
  const queue = paths;
  const files = [];

  while (queue.length > 0) {
    const top = queue.shift();
    const stat = await fs.stat(top);
    if (stat.isFile()) {
      if (top.match(filter)) {
        files.push(top);
      }
    } else if (stat.isDirectory()) {
      for (const name of await fs.readdir(top)) {
        queue.push(path.join(top, name));
      }
    }
  }

  return files;
}

async function updateFile (file, update) {
  const content = await fs.readFile(file, 'utf8');
  const updatedContent = update(content);
  if (updatedContent !== content) {
    await fs.writeFile(file, updatedContent);
    return true;
  } else {
    return false;
  }
}

function updateImportPaths (source) {
  for (const [ oldPath, newPath ] of Object.entries(pathUpdates)) {
    source = source.replace(
      path.join('@dhruvinparikh/contracts', oldPath),
      path.join('@dhruvinparikh/contracts', newPath),
    );
  }

  return source;
}

module.exports = {
  pathUpdates,
  updateImportPaths,
};

if (require.main === module) {
  const args = process.argv.length > 2 ? process.argv.slice(2) : undefined;
  main(args).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
