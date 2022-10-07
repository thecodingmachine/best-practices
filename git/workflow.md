---
title: Git Workflow
subTitle: 
currentMenu: git-workflow
---

The goal of this section is to give a few tips on how to use Git in a team.

Having a good Git workflow is essential to avoid conflicts and to keep a clean history.

## Define a workflow

The workflow defines how you will work with Git.
It defines how you will create branches, how you will merge branches, how you will name your commits, etc.

There exists multiple workflows such as:
- [GitLab's workflow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [GitHub's workflow](https://guides.github.com/introduction/flow/)
- [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

The workflow you choose is not important. What is important is that you choose a workflow and that you stick to it.

We advise you to choose GitHub's workflow as it is really simple and easy to understand.

- `main` is the main branch. It should always be in a deployable state.
- `feature/[ticket-number]-[short-description]` are feature branches. They are created from `main` and merged back into `main` using a pull request.
- `fix/[ticket-number]-[short-description]` are release branches. They are created from `main` and merged back into `main` using a pull request.
- `hotfix/*` are hotfix branches. They are created from current production tag and merged back into `main` (after being re-deployed) using a pull request.

In order to keep a clean history, we advise you to:
- `squash` your commits before merging
- use Fast-Forward merges (`git pull -ff`).

## Beautiful commit messages

In order to ensure beautiful commit messages, we advise you to follow those rules:
- Use the imperative, present tense: "change" not "changed" nor "changes".
- Don't capitalize the first letter.
- No dot (.) at the end.
- Limit the first line to 72 characters.
- Reference issues and pull requests liberally after the first line.
- When only changing documentation, include [ci skip] in the commit description.
- Consider starting the commit message with an applicable emoji (see [gitmoji](https://gitmoji.dev/)).
  - 🎨 `:art:` when improving the format/structure of the code

You may also want to check out [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/) that gives a standardisation for commit's message.

Using such standard helps you generate changelogs and release notes with [automated tools](https://www.conventionalcommits.org/en/about/).

## Pull Request (Merge Request)

### As an author

- The ticket assignee (TA) take a ticket from the sprint.
- The TA take a ticket from the sprint and create a branch from `main` named with a syntax like `[feature/fix]/[GRE-300]-short-description`
- The TA develop the ticket on his branch
- Once development is done, he creates a merge request (pull request) as WIP
- He pass on his ticket to a "cross tester". 
- Once the cross-test (and fix developed) are done, the prefix "WIP" should be removed from the merge-request name.
- Once the WIP prefix is removed, the TA pass on the ticket to a "merge request validator"
- Once feedback have been implemented and the code is validated by the "merge request validator", the TA should squash his commits to have one feature per commit
- Once commits are squashed, the TA should ask the project maintainer to merge the branch
- If the merge-request is a hotfix, you should not remove the branch after the deployment. You should create a new production tag from the branch, then update the hotfix branch from main then merge the hotfix branch to main.

### As a reviewer

For the reviewer, reviewing a merge-request is a top priority.
The reviewer should validate the PR before continuing his work. To avoid blocking any other development, furthermore fast feedback keeps the author in the same mind context, so he should be able to address review's comments easier and faster.

The reviewer should check these points:

 - What does this merge-request? Learn about its context (linked ticket for example)
 - Does it do what it should
 - Is the code readable and understandable
 - Test coverage
 - Suggestions for a more clever code
 - Suggestions for a shorter code

## Add a pull-request template

In order to always remember the above list you can create Merge Request templates in both [Gitlab](https://docs.gitlab.com/ee/user/project/description_templates.html#create-a-merge-request-template) and [GitHub](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository).

This pull-request template could look like this

```markdown
### Description

<!-- Please describe what the changes are made in this pull request and why the change was necessary. -->

### Pre-Review (author)

- [ ] I have added a summary of my changes to the changelog
- [ ] I have added/updated tests to cover my changes
- [ ] All new and existing tests pass
- [ ] I removed newly introduced dead code (if applicable)
- [ ] I updated the documentation / changelog (if applicable)

### Issue(s) this PR fixes

This fixes #ISSUE_NUMBER

### How to test

<!-- Please describe how this PR has been tested. e.g. "I added a unit test to cover my changes." -->

### Review Checklist (reviewer)

- [ ] The changes do what is expected (cross-test)
- [ ] The (algorithmic) design of this functionality is good
- [ ] The code is readable and understandable (complexity, naming etc)
    - [ ] The code is well documented
- [ ] Tests are added / updated accordingly and are correct
```

## Additional resources

- [Workflow Comparison](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Google's reviewer and author guide](https://google.github.io/eng-practices/)
