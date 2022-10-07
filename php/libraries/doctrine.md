---
title: Doctrine
subTitle: PHP Best practices
currentMenu: php-orm-doctrine
---

## Persist entity only when you need to
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">You have to persist an entity when you want it to be managed by Doctrine. But please don't
persist entities that are already managed by Doctrine.</div>

###Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
<?php
$article = $entityManager->find('CMS\Article', 1234);
$article->setHeadline('Hello World dude!');
$entityManager->persist($article);
$entityManager->flush();
```

When you get an entity from the database, it's already managed by Doctrine. You don't have to persist it again. It will not create
any errors or bugs but you will add useless code in your project.
<div class="alert alert-success">Only persist new entity:</div>

```php
<?php
$user = new User;
$user->setName('Mr.Right');
$em->persist($user);
$em->flush();
```

## Naming strategy 
<span class="label label-success pull-right">Beginner</span>

### Rule 

<div class="alert alert-info">Naming strategy can provide rules for automatically generating database identifiers, 
columns and tables names when the table/column name is not given. This feature helps reduce the verbosity of the mapping document, eliminating repetitive noise</div>

### Explanation

<div class="alert alert-danger">What you should NOT do:</div>

```php
/**
 * @Entity
 * @Table(name="users")
 *
 */
class User
{
    /**
     * @Id @GeneratedValue @Column(name="id", type="integer")
     */
    private $id = null;

    /**
     * @Column(name="login", type="string")
     */
    public $login;

    /**
     * @Column(name="password", type="string")
     */
    public $password = null;
}
```

See in all the annotation we have a name property. Every developper use different naming conventions for columns and tables names.


<div class="alert alert-success">So your code should look like this:</div>

```php
/**
 * @Entity
 * @Table
 *
 */
class User
{
    /**
     * @Id @GeneratedValue @Column(type="integer")
     */
    private $id = null;

    /**
     * @Column(type="string")
     */
    public $login;

    /**
     * @Column(type="string")
     */
    public $password = null;
```

With the above code, the developper will not have to take care about the name of columns and tables names, so they will
be more efficient and will not have to care about creepy things.

<div class="alert alert-info">Note: Doctrine provides different naming strategies and let you the possibility to implements 
your own ones, see <a href="https://www.doctrine-project.org/projects/doctrine-orm/en/latest/reference/namingstrategy.html">Doctrine Naming strategies</a></div>
