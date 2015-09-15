---
title: Error handling
subTitle: PHP Best practices
---

## Using Exceptions
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">When writing a function, you should throw exceptions for error management instead of returning a boolean.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
/**
 * @return bool
 */
function writeDateInFile() {
    $result = file_put_contents("date", date("Y-m-d"));
    if ($result) {
        return true;
    } else {
        return false;
    }
}
```

Why is this bad? Because you are relying on the developer using your function to actively check the return value
and see if everything went all right.

```php
// You assume the developer using your function will write:
$result = writeDateInFile();
if ($result) {
    // Do stuff
} else {
    // Do something to actually manage the error 
}
```

But developers are **lazy**. They tend to forget to add required checks. Or they don't have time and they skip
error handling. So instead of returning a status code, your function should not return anything **but** it should 
**throw an exception** in case something goes wrong.

<div class="alert alert-success">So your code should look like this:</div>

```php
/**
 * @return bool
 */
function writeDateInFile() {
    $result = file_put_contents("date", date("Y-m-d"));
    if (!$result) {
        throw new FileWriteException("There was a problem writing file 'date'");
    }
}
```

## Subtyping exceptions
<span class="label label-warning pull-right">Intermediate</span>
### Rule

<div class="alert alert-info">You should never throw the `Exception` class directly. Instead, you should consider 
<strong>extending</strong> the <code>Exception</code> class or using one of the available sub-classes.</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
function writeDateInFile() {
    $data = $this->dao->getSomeData();
    $result = file_put_contents("date", json_encode($data));
    if (!$result) {
        throw new \Exception("Throw some generic exception");
    }
}
```

Why is this bad? Because you are preventing the developer to catch specific problems.
Look at the code above. The `getSomeData` method could also throw an exception that the developer using
your function does not want to catch.

<div class="alert alert-success">So instead, you should consider creating your own exception or using an exception for the SPL library:</div>

```php
namespace My\Namespace;

class FileWritingException extends \Exception {
}
```

Please note that your class does not need to contain any code. It just needs to extend the exception class.

Now, your code looks like this:

```php
function writeDataInFile() {
    $data = $this->dao->getSomeData();
    $result = file_put_contents("date", json_encode($data));
    if (!$result) {
        throw new FileWritingException("Throw my specific exception");
    }
}
```

and the developer can catch this specific exception if he wants to:

```php
try {
    $this->writeDataInFile();
} catch (FileWritingException $e) {
    // Do some specific stuff if we have problems with disk writing. 
}
```


## Fail early, fail loud
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info"><strong>Do not catch exceptions!</strong> If something unexpected happens, your code should 
fail loudly (with a big error message) rather than trying to hide what is going wrong.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
function doClevelStuff() {
    try {
        $results = $this->db->makeRequest("SELECT ...[insert complex SQL here] ");
        // ... Do stuff
    } catch (DBException $e) {
        $this->log->error($e->getMessage());
    }
}
```

This code is *clearly evil*. So you have this big complex SQL request, and if it fails (because there is a parse error
in the SQL), the code is catching the error, logging it... and that's it!

How long will it take before someone notices that the logs are full of SQL errors?
An SQL error is not a runtime error, it is a design error. So if there is one, there is a bug. **And you don't catch bugs.
Never.**

<div class="alert alert-success">Instead, the correct code is:</div>

```php
function doClevelStuff() {
    $results = $this->db->makeRequest("SELECT ...[insert complex SQL here] ");
    // ... Do stuff
}
```

See how this is easier? If an exception is thrown because there is a problem in the SQL, it will bubble up. It will
probably be caught by your MVC framework that will display a nice HTTP 500 page, with a nice stacktrace.
If your framework does not provide you with a nice error page, consider switching to another framework. Or use 
[Whoops, a nice error reporting library](http://filp.github.io/whoops/).

In general, there are very few cases where you will want to catch an exception. This is because exceptions are thrown
when someting goes seriously wrong and generally, there is nothing you can do to fix it:

- Your database is not reachable? There is usually nothing your program can do to fix this
- Your application does not have rights to write in a directory? There is usually nothing your program can do to fix this
- Your hard disk is full? There is usually nothing your program can do to fix this
- You have a SQL error? There is usually nothing your program can do to fix this

See? Most exceptions are meant to bubble up, so do not catch them!

So unless you are writing an error handler, or retrowing the exception, you should always consider carefully what 
exceptions you want to catch and never try to catch the `Exception` class.

<div class="alert alert-danger">Bad:</div>

```php
try {
    // ...
} catch (Exception $e) {
    // NO! Catching the Exception root class is evil unless you are writing an error handler.
}
```

<div class="alert alert-success">Good:</div>

```php
try {
    // ...
} catch (Exception $e) {
    // Do some stuff...
    // This is OK, because the exception is rethrown
    throw $e;
}
```


## Always log exceptions with the stacktrace
<span class="label label-warning pull-right">Intermediate</span>
###Rule

Ok, so you read the rule just above, and you still want to catch that exception...

<div class="alert alert-info">When logging exceptions, please log the whole stack-trace, not only the message.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
try {
    // ...
} catch (MyException $e) {
    // This is bad, you just lost the stacktrace!
    $this->logger->error($e->getMessage());
}
```

<div class="alert alert-success">Instead, the correct code is:</div>

```php
try {
    // ...
} catch (MyException $e) {
    // This is good, the stacktrace is logged.
    $this->logger->error($e->getMessage(), [ 'exception' => $e ]);
}
```

You are using a [PSR-3 compatible logger, right?](http://www.php-fig.org/psr/psr-3/) The PSR-3 states that you can pass an exception to the logger in the
 `exception` key of the context array. By doing so, your logger will be allowed to log the stacktrace. If an exception
 is ever thrown, you will have the complete stack-trace and you will know where in the code it was triggered.

## Wrapping an exception? Do not lose the previous exception!
<span class="label label-danger pull-right">Pro</span>

###Rule

<div class="alert alert-info">When wrapping exceptions, please pass on the root exception.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
try {
    // ...
} catch (DatabaseException $e) {
    // This is bad, you just lost the reason why the exception happened.
    throw new MyServiceException("Something wrong happened with the database");
}
```

The code above is evil because you completely lost any knowledge of the `DatabaseException` that was triggered.
What was the message? Which line of code did trigger this exception? You don't know anymore. The only thing you know
is that you have a new `MyServiceException` that is not very helpful.

<div class="alert alert-success">Instead, the correct code is:</div>

```php
try {
    // ...
} catch (DatabaseException $e) {
    // This is good. The exception is passed as 3rd parameter of the exception constructor.
    // Now, your MyServiceException embeds the DatabaseException and both stack-traces will be displayed.
    throw new MyServiceException("Something wrong happened with the database", 0, $e);
}
```

This is good. The third parameter to the `Exception` constructor is another exception (the one that triggered this
exception). Most loggers and error reporting tools will show you both exceptions, so you will have a very detailed
view of what is going wrong.