> Status: 🚧

# git-editor

## Rationale

*  There are various tools helping with commit message drafting
*  None of them actually helps with the entire commit lifecycle
*  Git provides the editor configuration at `core.editor`
*  A dedicated git editor can achieve awesome things

## Features

**git-editor setup [--global]**
*  Add appropriate `core.editor` to either `local` or `global` git config

**git commit [--amend]**
*  Show commit message fields according to conventional-changelog
*  Prefill commit message fields based on prior messages


## Roadmap

*  [ ] Support for `body`, `footer` fields
*  [ ] `git rebase -i` support
*  [ ] Filtered select implementation for enumerable input fields
*  [ ] Remaining character counters
*  [ ] Validation messages
*  [ ] Support vim keys
*  [ ] More cues and hints
