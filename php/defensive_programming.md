---
title: Defensive programming
subTitle: PHP Best practices
currentMenu: php-defensive-programming
---

This series of tips is dedicated to strengthening your code.

## Always check for unexpected values
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Your <code>switch</code> statements should always have a <code>default</code>.</div>

### Explanation

Just imagine you have a function that does some processing on an article, based on its status. Its status
can be "active", "pending" or "inactive"

<div class="alert alert-danger">What you should NOT do:</div>

```php
function doStuff($status) {
    switch ($status) {
        case "active":
            // Do some stuff
            break;
        case "pending":
            // Do some stuff
            break;
        case "inactive":
            // Do some stuff
            break;
    }
}
```

But in the future, what if a new status is added, like "archived"? How long will it take before you notice?

<div class="alert alert-success">So your code should look like this:</div>

```php
function doStuff(string $status) {
    switch ($status) {
        case "active":
            // Do some stuff
            break;
        case "pending":
            // Do some stuff
            break;
        case "inactive":
            // Do some stuff
            break;
        default:
            // This is good! In case an unexpected status is sent, you will notice
            throw InvalidStatusException(sprintf("Unknown Status '%s'", $status));
    }
}
```

By adding a `default` statement that throws an exception, you are sure to notice if something goes wrong in the future.

<div class="alert alert-info">Note: this rule also applies for long series of <code>if</code>, <code>elseif</code>
statements without a final <code>else</code>.</div>

<div class="alert alert-info"><strong>Heads up!</strong> You can enforce this rule using the <a href="https://github.com/thecodingmachine/phpstan-strict-rules/blob/master/doc/typehinting_rules.md">thecodingmachine/phpstan-strict-rules</a> package.</div>

## Use constants
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Constants should be stored in classes using the <code>const</code> keyword.</div>

Avoid using the `define` keyword for constants.

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
function doStuff(string $status): void {
    switch ($status) {
        case "active":
            // Do some stuff
            break;
        case "pending":
            // Do some stuff
            break;
        case "inactive":
            // Do some stuff
            break;
        default:
            throw InvalidStatusException(sprintf("Unknown Status '%s'", $status));
    }
}
```

<div class="alert alert-success">What you should do instead:</div>

```php
class StatusEnum
{
    const ACTIVE = "active";
    const PENDING = "pending";
    const INACTIVE = "inactive";
}
```

```php
function doStuff(string $status): void {
    switch ($status) {
        case StatusEnum::ACTIVE:
            // Do some stuff
            break;
        case StatusEnum::PENDING:
            // Do some stuff
            break;
        case StatusEnum::INACTIVE:
            // Do some stuff
            break;
        default:
            throw InvalidStatusException(sprintf("Unknown Status '%s'", $status));
    }
}
```

By storing the list of possible statuses in a class, the IDE will offer autocompletion on your enumeration class.
Furthermore, you cannot misspell a status in your code. If a status is removed from the class, you will get an error
if you try to access it (so your code will fail instead of silently ignoring the error, which is good).

You should use `const` instead of `define` because:
 
- it allows grouping constants into classes: your code is more organized and self describing
- classes can be autoloaded: you don't need to include a file containing all `define` statements for each request
  so your code is more efficient

## Use an enumeration library
<span class="label label-danger pull-right">Pro</span>

### Rule 

This is an improvement over the previous rules:

<div class="alert alert-info">Consider using an enumeration library (like 
<a href="https://github.com/myclabs/php-enum">myclabs/php-enum</a>) to manage your enumeration classes.</div>

### Explanation

Thanks to an enumeration library, you can type hint your enumerations. This is a useful type check that makes
your code more robust and simpler:

```php
use MyCLabs\Enum\Enum;

class StatusEnum extends Enum
{
    const ACTIVE = "active";
    const PENDING = "pending";
    const INACTIVE = "inactive";
}
```

```php
// Please notice the type hinting on StatusEnum
function doStuff(StatusEnum $status): void {
    if ($status == StatusEnum::ACTIVE()) {
        // Do stuff
    }
}

// Function call looks like this:
doStuff(StatusEnum::ACTIVE());
```

Using an enum library, rather than referring to the constant directly, you call a static function that has the
same name as the constant. So instead of doing `StatusEnum::ACTIVE`, you write `StatusEnum::ACTIVE()`. The `ACTIVE()`
static method will return an instance of the `StatusEnum` class that represents the constant. Therefore, you can
type hint on it.

Your code is safer and simpler. Now, no one can call the `doStuff` method without passing a valid status, so you don't need
to check that in your method!

## The Yoda condition 
<span class="label label-success pull-right">Padawan</span>

**Note:** this rule is controversial as it can makes the code harder to read for some people. Feel free to ignore it
if you feel uncomfortable about it. 

### Rule 

<div class="alert alert-info">When doing logical comparisons, always put the variable on the right side, constants or literals on the left.</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
if ( $theForce == true ) {
    $victorious = youWill( $be );
}
```

Imagine that you omit an equal sign in the above code. The assignment would be perfectly valid, returning <code>1</code>, 
causing the <code>if</code> statement to evaluate to <code>true</code>, and you could be chasing that bug for a while.

<div class="alert alert-success">So your code should look like this:</div>

```php
if ( true == $theForce ) {
    $victorious = youWill( $be );
}
```

If you omit an equal sign you’ll get a parse error, because you can’t assign to a constant like <code>true</code>

<div class="alert alert-info">Note: this rule also applies to <code>==</code>, <code>!=</code>, <code>===</code>, and <code>!==</code>. 
Yoda conditions for <code>&lt;</code>, <code> > </code>, <code>&lt;=</code> or <code>>=</code> are significantly more difficult to read and are best avoided.</div>

