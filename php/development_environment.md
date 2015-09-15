---
title: Development environment
subTitle: PHP Best practices
---

This series of tips is dedicated to building an efficient development environment for PHP.
Do not underestimate the importance of a fully set up environment. This will help you be more efficient,
and in the end, you will develop faster and with less errors.

## Enable error reporting
<span class="label label-success pull-right">Beginner</span>
### Rule 

<div class="alert alert-info">Configure your <code>php.ini</code> for maximum error verbosity!</div>

Please ensure that you have the following settings on your development environment:

```ini
error_reporting = E_ALL
display_errors = On
```

Also, please install [Xdebug](http://xdebug.org/).

### Explanation

You want each and every error to be **directly displayed on screen**. If it goes to the logs, there is a chance you will
never notice it. Also, you want PHP to be **as strict as possible** because this will help you diagnose potential bugs.
 
Finally, installing Xdebug is really important because it will allow you to have a **stack-trace** for each error
that is triggered (by default, PHP only displays stack-traces for exceptions, not errors)

## Install an IDE (a real one!)
<span class="label label-success pull-right">Beginner</span>
### Rule

<div class="alert alert-info">Install a real PHP IDE. One with code completion and debugging support</div>

### Explanation

No, your text editor is not enough. Even if it comes with all bell and whistles (I'm looking at you Notepad++ and
Sublime text).

You absolutely need these 2 features to be efficient:

- **Auto-completion**: here we are not talking about autocompleting core PHP functions. We want an autocomplete that
  analyzes your code and proposes methods available in your objects, based on the context.
- **Debugging support**: because a debugger is way more powerful than putting `var_dump`s in your code!

Looking for such an IDE? At the time of writing, here are 3 IDEs that stand out:
  
- [Eclipse](http://eclipse.org/), with PDT plugin
- [Netbeans](https://netbeans.org/)
- [PHPStorm](https://www.jetbrains.com/phpstorm/), probably the best PHP IDE out there, but unlike Eclipse and NetBeans,
  it is not free.

## Setup a debugger
<span class="label label-success pull-right">Beginner</span>
### Rule

<div class="alert alert-info">Install and configure XDebug</div>

### Explanation

Installing and configuring XDebug can be challenging when you've never done it before, but it is worth 10x the time you'll 
spend configuring it.

<div class="alert alert-danger">Do not start your project if you don't have a working debugger first!</div> 