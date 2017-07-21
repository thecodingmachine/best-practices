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

<div class="alert alert-info"><a href="http://cs.sensiolabs.org/">Use PHP-CS-Fixer.</a> It will do all the work
for you. Run PHP-CS-Fixer <strong>before any commit you plan to do</strong>.</div>

**Tip:** install PHP-CS-Fixer globally using Composer. You will be able to use it on any project, anywhere in the
project tree.
Some IDEs like PHPStorm already have a CS-Fixer implemented.
