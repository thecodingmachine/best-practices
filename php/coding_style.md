---
title: Coding style
subTitle: PHP Best practices
currentMenu: php-coding-style
---

## Respect PSR-1 and PSR-2
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">PHP now has a coding style guide shared by many projects. Its name is 
<a href="http://www.php-fig.org/psr/psr-2/">PSR-2</a>. You should follow it.</div>

###Explanation

At TheCodingMachine, most of us hate spaces. We prefer tabs. So why not ask for developers to use tabs?
Because PSR-2 says we should use spaces. We might not like everything in PSR-2 but at least, it is a shared standard.
It means that if you follow it, your code will follow the same standard as the vast majority of projects out there.

Oh... one very important thing! **Do not spend any time learning PSR-2**. This is useless! Instead, use a code
formatting tool that will do the work for you!

<div class="alert alert-info">Use <a href="http://cs.sensiolabs.org/">PHP-CS-Fixer.</a> or <a href="https://github.com/squizlabs/PHP_CodeSniffer">PHP Code Sniffer</a>. 
Both tools will do all the work for you. Run PHP-CS-Fixer or Code Sniffer <strong>before any commit you plan to do</strong>.</div>

Note: Some IDEs like PHPStorm already have a CS-Fixer implemented.

## Use an advanced rule set
<span class="label label-danger pull-right">Pro</span>

###Rule

<div class="alert alert-info">While PSR-2 is considered easy to follow, there are more advanced and stricter rule set you can use.
You will require more work to implement but lead to high quality code.</div>

###Explanation

<a href="https://github.com/squizlabs/PHP_CodeSniffer">PHP Code Sniffer</a> comes with a number of extensions that add additional rules.

Here is a list:

- [Doctrine coding standard](https://www.doctrine-project.org/projects/coding-standard.html): the coding standard used by the Doctrine project.
  It is very strict. In particular, it forces typing everything (so this is great).
- [Hard mode](https://github.com/mnapoli/hard-mode): a slightly modified version of the Doctrine coding standard that we enjoy using
- [Slevomat coding standard](https://github.com/slevomat/coding-standard): a set of rules you can cherry-pick to build your own coding standard (if you feel like it).
  The Doctrine coding standard and "hard mode" are based on those rules.

<div class="alert alert-success">If you are starting a new project, by all means, please use an advanced rule set.</div>

<div class="alert alert-danger">However, if you are already working on an existing project with a large code base, this might require a large effort
for a small to medium gain.</div>
