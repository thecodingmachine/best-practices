---
title: Command line and scripts
subTitle: PHP Best practices
currentMenu: php-cli
---

## Use a "Console" component
<span class="label label-warning pull-right">Intermediate</span>
###Rule

<div class="alert alert-info">Need to run a PHP script from the command line? Do not execute your PHP files directly.
Instead, consider using a "Console" component.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

You should avoid accessing scripts by running them directly from the PHP CLI: 

**my_script.php**
```php
#!/usr/bin/php
<?php

// Your PHP script that you run by typing "php my_script.php"
```

Most developers know they should use a MVC framework with a router component instead of directly accessing PHP files
from the web. When working with scripts triggered from the command line (or from a CRON task), the same rule applies!

<div class="alert alert-success">So instead, rather than directly accessing your scripts using <code>php my_script.php</code>,
you should consider using a console component from one of the major frameworks out there.</div>

Why? Because:

- You will write object oriented scripts
- You will get a nice interface to access the command line, including utility functions to:
    - manage options
    - automatically document your script
    - colorize your output
    
Here are a few console components out there:

- [Symfony console component](https://symfony.com/doc/current/components/console/introduction.html)
- [Laravel Artisan](https://laravel.com/docs/artisan)
