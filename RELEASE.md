# Releasing

Start on an up-to-date `master` branch.

Create the release branch with `npm run release start minor`.

Publish a release candidate with `npm run release rc`.

Publish the final release with `npm run release final`.

Follow the general [OpenZeppelin release checklist].

[Release checklist]: https://github.com/OpenZeppelin/code-style/blob/master/RELEASE_CHECKLIST.md


## Merging the release branch

After the final release, the release branch should be merged back into `master`. This merge must not be squashed because it would lose the tagged release commit. Since the GitHub repo is set up to only allow squashed merges, the merge should be done locally and pushed.

Make sure to have the latest changes from `upstream` in your local release branch.

```
git checkout release-vX.Y.Z
git pull upstream
```

```
git checkout master
git merge --no-ff release-vX.Y.Z
git push upstream master
```

The release branch can then be deleted on GitHub.

### Known issues and fixes

- `npm run release start minor` results in following error
    1.
    ```
    scripts/prepack.sh: line 4: shopt: globstar: invalid shell option name
    ```
    - fix
    ```
    $ brew install bash
    $ chsh -s /usr/local/bin/bash
    $ sudo bash -c 'echo /usr/local/bin/bash >> /etc/shells'
    $ ln -s /usr/local/bin/bash /usr/local/bin/bash-terminal-app
    ```
    2.
    ```
    You must sign up for private packages : @dhruvinparikh/contracts
    ```
    - fix
    `npm config set access public` - Reference : [https://docs.npmjs.com/cli/v7/using-npm/config](https://docs.npmjs.com/cli/v7/using-npm/config)




