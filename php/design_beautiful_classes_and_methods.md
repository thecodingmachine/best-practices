---
title: Design beautiful classes and methods
subTitle: PHP Best practices
currentMenu: php-beautiful-classes-and-methods
---

## Compulsory parameters should be required in your constructor
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Your class compulsory parameters should be set in the constructor.</div>

### Explanation

The constructor is called when your class is created. If you pass the compulsory parameters to the constructor,
you know that your class is always in a "valid" state.

<div class="alert alert-danger">What you should NOT do:</div>

```php
class MyService {
    private $logger;
    
    public function setLogger(LoggerInterface $logger): void {
        $this->logger = $logger;
    }

    private function doStuff() {
        // ...
        $this->logger->info('Hello world!');
    }
}
```

The code above is evil. The `doStuff` method clearly needs the `$logger` variable to be set.
But nothing says the developers using your class that they have to set the logger.

Someone could call the service this way:

```php
$myService = new MyService();

$myService->doStuff(); // BOOM! $this->logger is null!
```

<div class="alert alert-success">Instead, you should consider passing all required services and parameters in 
the constructor:</div>

```php
class MyService {
    private $logger;
    
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    private function doStuff(): void {
        // ...
        $this->logger->info('Hello world!');
    }
}
```

With this code, there is no possible way `$logger` can be null!

Avoid optional services as much as possible
-------------------------------------------
<span class="label label-danger pull-right">Pro</span>

### Rule 

<div class="alert alert-info">Avoid optional services as much as possible. Use compulsory "void" services instead</div>

### Explanation

It is often tempting to design a class that can optionally require some services.
For instance, a mailer service might optionally accept a logger service in order to log whether mails have been
successfully sent or not. What appears to be a good idea can actually make your code harder to read.

<div class="alert alert-danger">What you should NOT do:</div>

```php
class MyMailer {
    private $logger;
    
    public function __construct(LoggerInterface $logger = null) {
        $this->logger = $logger;
    }

    private function sendMail(Mail $mail): void {
        // Do stuff that actually sends the mail...
        // ...
        if ($this->logger) {
            $this->logger->info('Mail successfully sent.');
        }
    }
}
```

The `MyMailer` constructor can take a logger in parameter, but it is optional. This is great because it is flexible,
but each time we want to call the logger in the `MyMailer` code, we have to wrap the call to the logger into a `if` 
statement:

```php
// Each time we call the logger, we must first check that it exists.
if ($this->logger) {
    $this->logger->info('Mail successfully sent.');
}
```

The additional calls to `if` make your code less readable.

Instead, you should consider using a "void" class (sometimes called a "null" class), i.e. a class that exhibits the
behaviour of a service but that does nothing.

<div class="alert alert-success">So your code should look like this:</div>

```php
class MyMailer {
    private $logger;
    
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    private function sendMail(Mail $mail): void {
        // ...
        $this->logger->info('Mail successfully sent.');
    }
}
```

In the code above, the `$logger` is **compulsory** instead of optional.

If the developer does not want to log anything, he can use a [`NullLogger`](https://github.com/php-fig/log/blob/master/Psr/Log/NullLogger.php)
so that nothing is logged.

```php
use Psr\Log\NullLogger;

$myMailer = new MyMailer(new NullLogger());
```

Most libraries come with these kind of *null* or *void* objects. Some examples:

- A cache service that does not cache anything: [*Doctrine's VoidCache*](https://github.com/doctrine/cache/blob/master/lib/Doctrine/Common/Cache/VoidCache.php)
- A mailer that does not mail anything (Swift comes with a *null* mail transport)
- ...

As a side note, if you are designing a new interface implemented by many classes, it is a good practice to 
provide along the interface a *null* class associated to this interface.

<div class="alert alert-info"><strong>Heads up!</strong> After reading this, you still want to implement 
optional parameters in your class? You should set those either using <strong>an optional constructor argument</strong>
or <strong>using a setter</strong>.</div>

##Never use public properties
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Your class should <strong>not contain any public property</strong>.</div>

### Explanation

Public properties are exposing the inside of the class to the outer world.
Anyone outside the class can suddenly modify any property, therefore can put anything in the property, including
data that make no sense. Public properties decrease the *robustness* of your code.

<div class="alert alert-danger">What you should NOT do:</div>

```php
class Customer {
    public $login;
    public $password;
    /**
     * @var DateTimeImmutable
     */
    public $createTime;
}
```

A developer using your class could easily write:

```php
$customer = new Customer();
$customer->createTime = date(); // This is terribly wrong! We expect a DateTimeImmutable and are being given a timestamp.
```

<div class="alert alert-success">Instead, you need to 
<a href="https://en.wikipedia.org/wiki/Encapsulation_%28computer_programming%29">encapsulate properties</a> in your 
code, by using getters and setters (or getters only when it is possible). Your code should look like this:</div>

```php
class Customer {
    ...
    
    /**
     * @var DateTimeImmutable
     */
    private $createTime;
    
    public function setCreateTime(DateTimeImmutable $createTime) {
        $this->createTime = $createTime;
    }
    
    public function getCreateTime(): DateTimeImmutable {
        return $this->createTime;
    }
}
```

Because we are using type-hinting, there is no way a developer using our class can set anything else that a 
`DateTimeImmutable` instance into our `$createTime` property.

<div class="alert alert-info"><strong>Heads up!</strong> Yes, writing setters and getters is a fastidious.
Please do not write those yourself. Your IDE should be able to write getters and setters for you
(and if it cannot, consider changing your IDE).</div>

- PHPStorm supports generating getters and setters out of the box.
- Eclipse PDT has [extensions allowing generating getters and setters too](http://p2-dev.pdt-extensions.org/phpfeatures.html)
- ...

##Avoid option arrays in constructors
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Avoid passing an array of options to your constructor.</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
class Table {
    // ...
    
    public function __construct(array $options) {
        // ...
    }
}
```

Arrays of options are not self-explanatory. There is no way you can know all the possible keys accepted by the `$options`
array without reading the code or reading the documentation (assuming the documentation is up to date!)

<div class="alert alert-success">Instead, consider passing all parameters in the constructor:</div>

```php
class Table {
    // ...
    
    public function __construct(array $rows, int $borderWidth = 0, string $borderColumn = "red", /*, ...*/) {
        // ...
    }
}
```

If you have really too many possible options (20+ possible options with many being optional), consider writing a 
`Configuration` class for your service:

```php
class Table {
    // ...
    
    public function __construct(Configuration $configuration) {
        // ...
    }
}

class Configuration {
    private $rows;
    private $borderWidth = 0;
    private $borderColumn = "red";
    
    // Compulsory parameters go in the constructor
    public function __construct(array $rows) {
        $this->rows = $rows;
    }
    
    // Optional parameters go in setters
    public function setBorderWidth(int $borderWidth) {
        $this->borderWidth = $borderWidth;
    }
    
    // ...
}
```

This has a number of advantages:

- The developer using your code cannot create an object without passing all the requested parameters
- Your IDE can provide auto-completion on setters.

## Use type-hinting, as much as possible
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Type-hint everything you can. If you are using PHP7, use strict mode and
scalar type hinting.</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
class MyMailer {
    private $logger;
    
    /**
     * @param LoggerInterface $logger
     */
    public function __construct($logger) {
        $this->logger = $logger;
    }
}
```

PHP is weakly typed by default. This means you could put absolutely anything in the `$logger` parameter.

Like this:

```php
$myMailer = new MyMailer("log.txt"); // BOOM! We are expecting a logger instance, not a string!
```

<div class="alert alert-success">Instead, you should write:</div>

```php
class MyMailer {
    private $logger;
    
    /**
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }
}
```

With the code above, developers calling your constructor MUST pass a `LoggerInterface` to the `$logger` parameter. 
Otherwise, PHP will report an error.

<div class="alert alert-info">From PHP7+, you should of course use
strict mode and provide a return type for all your methods.</div>

<div class="alert alert-info"><strong>Heads up!</strong> You can enforce this rule using the <a href="https://github.com/thecodingmachine/phpstan-strict-rules/blob/master/doc/typehinting_rules.md">thecodingmachine/phpstan-strict-rules</a> package.</div>

## Write beautiful PHPDoc
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">If you cannot use a type-hint, then you must document it in a docblock.
Please add <a href="https://en.wikipedia.org/wiki/PHPDoc">PHPDoc</a> to your code <em>if it provides additional information</em>.
In particular, please detail the content of arrays using the <code>Object[]</code> notation.
If you are coding with a legacy PHP 5.x application, please also provide <code>@return</code> statements.</div>

### Explanation

Many tools can read the PHPDoc and help you with it.

- Your IDE can read it and provide auto-completion based on it
- [Mouf](http://mouf-php.com) offers a drag'n'drop interface for instances based on PHPDoc
- [Scrutinizer](http://scrutinizer-ci.com/) performs a number of type checks based on PHPDoc

<div class="alert alert-success">You should be sure to use the <code>Object[]</code> notation in addition to an <code>array</code> type-hint to explain what kind of object is expected.</div>

```php
/**
 * @param User[] $users
 */
public function sendSubscriptionMails(array $users) {
    foreach ($users as $user) {
        $user->getEma... // Here the IDE will be able to provide autocompletion on the $user variable based on the PHPDoc 
    }
}
```

<div class="alert alert-warning">Avoid docblocks with no value</div>

You don't need to add PHPDoc for the sake of adding PHPDoc if it provides no additional value.

```php
/**
 * Sets the product.
 *
 * @param Product $product
 */
public function setProduct(Product $product): void
```

The PHPDoc block above is useless. It provides no additional value for the developer.

<div class="alert alert-success">Only add PHPDoc when you have something to say that matters</div>

```php
/**
 * @param Product[] $products An array of products **indexed by product ID**
 */
public function setProducts(array $products): void 
```

The comment above is interesting as it informs the developer that the array must be indexed by product ID.
The comment is meaningful. Strive for that!

If all your comments actually matter, there is a bigger chance that developers using your code will actually read them.

<div class="alert alert-info"><strong>Heads up!</strong> You can enforce this rule using the <a href="https://github.com/thecodingmachine/phpstan-strict-rules/blob/master/doc/typehinting_rules.md">thecodingmachine/phpstan-strict-rules</a> package.</div>

## Type-hint on the interface, not the implementation
<span class="label label-danger pull-right">Pro</span>

### Rule 

<div class="alert alert-info">When putting type hinting into your methods, <strong>always put an interface</strong> 
rather than a concrete class.</div>

### Explanation

If your class is depending on interfaces rather than classes, your class has no dependencies on a specific 
implementation. Your code becomes more modular. 

<div class="alert alert-danger">What you should NOT do:</div>

```php
class MyMailer {
    private $logger;
    
    public function __construct(FileLogger $logger) {
        $this->logger = $logger;
    }
}
```

In the example above, the `MyMailer` class requires a `FileLogger` class to run. This means that the mailer will 
always write in a log file using the `FileLogger` class. This is very rigid.

<div class="alert alert-success">Instead, you should write:</div>

```php
class MyMailer {
    private $logger;
    
    /**
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }
}
```

Now, the `MyMailer` class can take any existing logger, including database loggers, null loggers, etc...

Your code becomes more **decoupled**.

<div class="alert alert-info"><strong>Heads up!</strong> This principle is called the 
<em><a href="https://en.wikipedia.org/wiki/Dependency_inversion_principle">Dependency inversion principle</a></em> 
(not to be mistaken for the dependency injection principle which is 
something completely different). It is sometimes expressed this way: <em>Depend upon Abstractions. Do not depend upon 
concretions.</em></div>

<div class="alert alert-info"><strong>Heads up 2!</strong> This principle is very important when you are 
manipulating services, or when you are designing reusable packages. Creating an interface takes some time however,
and if you are absolutely positive that this interface will never be implemented more than once (for instance
if you are manipulating business objects or entities), it can be acceptable to type-hint on the class directly.</div>

## Avoid passing IDs to methods when you can pass objects
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">When designing a method, prefer using objects as attributes rather than
using an ID representing these objects.</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
class MyMailer {
    public function sendSubscriptionMail($userId) {
        // Do stuff...
    }
}
```

You cannot type-hint on an ID. When an ID is passed to your method, you never know if it is a valid ID or not.

In the example above, a lot of things can go wrong:
 
```php
$myMailer->sendSubscriptionMail(null); // BOOM!
$myMailer->sendSubscriptionMail(-42); // BOOM! -42 is not likely to be a valid ID
```

<div class="alert alert-success">Instead, you should consider passing directly the object 
(for instance an entity that comes from the DB).</div>

```php
class MyMailer {
    public function sendSubscriptionMail(User $user) {
        // Do stuff...
    }
}
```

###A quick note about performance

Sometimes, the service only needs the ID and nothing else stored in the object.
For instance, if you build a TODO software, you might have a service that fetches all TODOs the current user has. 
The service will probably perform a query in database on the "todo" table, filtering on the user id.

It is tempting to write something like this:

```php
class TodoService {
    // ...
    
    public function getTodoForUser($userId) {
        $sql = "SELECT * FROM todos WHERE user_id = :userId";
        return $this->db->query($sql, [ "userId", $userId ];
    }
}
```

Especially, you don't have to call the `UserService` to get the `User` object, which can save an access to the database.
So this code is optimal right? Well... first of all, don't do premature optimisation.

Instead, please consider writing:

```php
class TodoService {
    // ...
    
    public function getTodoForUser(User $user) {
        $sql = "SELECT * FROM todos WHERE user_id = :userId";
        return $this->db->query($sql, [ "userId", $user->getId() ];
    }
}
```

Yes, you will need to retrieve the `$user` object first, but until you are facing a performance problem, this code 
is more robust and safer. Also, please consider that some ORM tools have a capability for lazy-loading objects.
For instance, [TDBM](https://github.com/thecodingmachine/tdbm) can return an instance of the `User` object without performing any call to the database. The call 
is performed only when needed. So in the end, passing the `User` object could be as fast, and of course, it is 
more reliable.
