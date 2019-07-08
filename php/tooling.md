---
title: Tooling
subTitle: PHP Best practices
currentMenu: tooling
---

This section list a number of tools that will help you respecting the best practices. 

## Use a static analysis tool
<span class="label label-success pull-right">Beginner</span>

###Rule

<div class="alert alert-info">Install a static code analyzer in your project like <a href="https://github.com/phpstan/phpstan">PHPStan</a> 
or <a href="https://psalm.dev/">Psalm</a>.</div>

###Explanation

A static analysis tool can automatically analyze your code base and issue warnings on potential bugs.
Unlike styling tools (like PHP-CS-Fixer), the static analysis tools actually understand your code by creating a tree like
representation of all your classes. They can go deep in your code and provide advanced issues reports.

At TheCodingMachine, we are [proud sponsors of PHPStan](https://github.com/phpstan/phpstan#sponsors). We even
went as far as designing an extension for PHPStan that actually checks some of the rules described in this very web site.

Psalm is also known to be a very good static analysis tool and is especially great at checking types. It comes with its
own generics syntax.

###Rule

<div class="alert alert-info">If you are using PHPStan, install 
<a href="https://github.com/thecodingmachine/phpstan-strict-rules">thecodingmachine/phpstan-strict-rules</a> for in-depth best practices checks.</div>


## Use unit/integration tests
<span class="label label-success pull-right">Beginner</span>

###Rule

<div class="alert alert-info">Write unit tests, for instance using <a href="https://phpunit.de/">PHPUnit</a>.</div>

###Explanation

Unit / integration tests are a great way to test your program automatically.

A whole book could be written on unit tests so rather than writing too few, here is [a link to best practices from PHPUnit](https://phpunit.de/manual/6.5/en/testing-practices.html)

## Use Continuous Integration
<span class="label label-success pull-right">Beginner</span>

###Rule

<div class="alert alert-info">Automate the check of static analysis, coding style and unit tests by using a continuous integration server.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

You should rely on you running your tools manually.
If you have no automated way to run your tools, here is what will happen:

- At some point in your project, you will have a rush
- You will commit to your repository without running your tools
- After some time, the effort to bring back your code to a correct state will take too much effort
- You will end up abandoning the tools

<div class="alert alert-success">Instead, use a continuous integration server integrated with your development environment!</div>

Each of your changes should be written to a branch. When you open a pull-request on that branch, the CI server will 
automatically run the tools for you and notify you of any problem.

**Note:** of course, your **should** run the tests locally first. It is way faster to run the tests locally that to 
 wait for the CI server to kick in and run the tests. The CI server is only here as a last resort.

There are many CI tools out there. At TheCodingMachine, we use [Gitlab CI](https://about.gitlab.com/product/continuous-integration/) that is directly integrated to Gitlab.
But there are many other tools like [Travis](http://travis-ci.org/) (with a generous free plan for open-source projects), [Jenkins](https://jenkins.io/)...

## Use static code analyzers in your IDE
<span class="label label-warning pull-right">Intermediate</span>
###Rule

<div class="alert alert-info">If you are using PHPStorm, we highly recommand using the great 
<a href="https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-">Php Inspections ​(EA Extended)​</a> extension</div>

###Explanation

This extension adds a great number of checks to help you write high quality PHP code.
Some of the checks are redundant with PHPStan, but you get the chance to view those directly in your IDE while coding.
