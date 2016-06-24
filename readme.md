> Status: 🚧💥

# git-editor

## Rationale

*  There are various tools helping with commit message drafting
*  None of them actually helps with the entire comit lifecycle
*  Git provides the editor configuration
*  A dedicated git editor could achieve awesome things

## User Experience

### Installation
*  `npm install git-editor-cli`
*  `git config --global core.editor "git-editor"`

### Commiting
**git commit**

*  Show the structure of a message according to conventional-changelog-lint
   ```
  type(scope): subject
  
  Message
  
  Footer
   ```
*  Every field in the commit message is a separate blessed input
*  `type`, `scope` grow, subject shrinks on edit
*  `Message`, `Footer` grow to `(100% - 2) / 2`, then scroll
*  Highlight active field on focus
*  Display validation errors next to fields
*  Display validation warnings next to fields
*  Display a remaining sign count if applicable
*  Do not save and quit when there are linting errors

**git commit --amend**

*  Prefill fields from previous input

**git rebase -i**

* tbd

## Ideas

*  Base this on [blessed](https://github.com/chjj/blessed)
*  Look into [blessed-react](https://github.com/Yomguithereal/react-blessed), [blessed-react-motion](https://github.com/gaearon/react-blessed-hot-motion)
*  conventional-changelog-lint should be a plugin, probably
