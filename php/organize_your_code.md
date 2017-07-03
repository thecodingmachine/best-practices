---
title: Organize your code
subTitle: PHP Best practices
currentMenu: php-organize
---

## Use a MVC framework
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">Use a framework.</div>

###Explanation

Depending on the project we work on, we use different set of tools. One thing is sure however: we always use a 
framework that provides a descent **router**.

There are many frameworks out there, ranging from the gigantic Symfony 2 or Zend Framework 2 to the very small
Slim 3 or Silex micro-routers. At TheCodingMachine we even have our very own [Mouf](http://mouf-php.com), 
a framework based on dependency injection with a web-based UI.

In order to have a code that does not look like a spaghetti plate, you will want to organize your code using 
controllers / services and a data layer.

<div class="row">
<div class="col-xs-6 col-xs-offset-3 box">Request</div>
</div>
<div class="row">
<div class="col-xs-6 col-xs-offset-3 arrow-down"></div>
</div>
<div class="row">
<div class="col-xs-12 box">Controllers</div>
</div>

<div class="row">
<div class="col-xs-7 arrow-down"></div>
<div class="col-xs-5 arrow-down"></div>
</div>

<div class="row">
<div class="col-xs-6 box">Services</div>
<div class="col-xs-1 arrow-right"></div>
<div class="col-xs-5 box">DAOs / Repositories</div>
</div>

<p></p>

- When a **request** arrives, it is routed by the framework to a **controller**
- The **controller** is in charge of analyzing the request and calling the relevant **services** or **DAOs** 
  (Data Access Objects, the classes in charge of communicating with the database).
- **Services** are objects that perform some kind of computation. It can be on the "domain layer" (i.e. computation
  that is directly related to the code of your application - what makes your application specific - ) or it can be
  purely technical services (like a mailer, a logger, etc...)
- Finally, the controller aggregates data received from various services and calls a "view" that will render the
  data in HTML (unless it is directly sent in another format like JSON).

## Limit the code in your controllers
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info"><strong>Limit the code in your controllers!</strong> A controller should not perform 
any kind of computation or any kind of database access. Its only role is to take the request and call the 
appropriate services. Based on the services response, it will generate the HTTP response send back to the 
browser (generally some HTML using a view, or some JSON if we are doing AJAX).</div>

###Explanation

Controllers are just meant to be an interface between the browser and the business logic of your application.
If you put business logic in your controller, this business logic becomes tied to a particular action.
If tomorrow, you want to call the same business logic from a command-line script, you won't be able to do it easily.

<div class="alert alert-danger">So this is what you should NOT do:</div>

This is a sample controller. It defines a route (`get_product?product_id=XXX`) that returns HTML data representing
a product and its price. The price is stored without VAT in database and the application must add the VAT to the price.

```php
class ProductController
{
    const VAT = 0.2;
    
    private $dbConnection;

    public function __construct(Connection $dbConnection) {
        $this->dbConnection = $dbConnection;
    }

    /**
     * This is a sample action based on Splash 8, but this could as well be used in any framework.
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        $productId = $request->getParams()['product_id'];
        // Let's get the product from database
        $sql = 'SELECT name, price FROM products WHERE id = ?';
        $stmt = $this->dbConnection->executeQuery($sql, [ $productId ]);
        $product = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        // Let's add the VAT:
        $product['price'] = $product['price'] * (1 + self::VAT); 
        
        // Let's output some HTML:
        $html = "<p>Product: ".$product['name']."</p>";
        $html .= "<p>Price: \$".$product['price']."</p>";
        return new HtmlResponse($html);
    }
}
```

This code is **wrong** on many aspects.

1. First, it performs a database access in a controller. DB access should be
processed in dedicated classes (and moreover, the developer should consider using an ORM).
2. It performs business logic, like computing the VAT from the product price.
3. It generates HTML instead of delegating this to the view component of the framework.

<div class="alert alert-success">Instead, the controller should look like this:</div>

```php
class ProductController
{
    private $productRepository;
    private $vatService;
    private $twig;

    public function __construct(ProductRepository $productRepository, 
                                VatService $vatService,
                                Twig_Environment $twig) {
        $this->productRepository = $productRepository;
        $this->vatService = $vatService;
        $this->twig = $twig;
    }

    /**
     * This is a sample action based on Splash 8, but this could as well be used in any framework.
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        // The controller is in charge of extracting the parameters from the request.
        $productId = $request->getParams()['product_id'];
        // The product is fetched from the appropriate service
        // The service should return an *object* representing the product.
        $product = $this->productRepository->getProductById($productId);
        
        // In turn, we can call the VAT service to get the product price with VAT:
        $vat = $this->vatService->computeVat($this->product->getPrice());

        // Finally, the HTML generation is deferred to a view component. Here, we use Twig:
        $template = $twig->loadTemplate('product.twig');
        return new HtmlResponse($template->render([
            'product'=>$product,
            'vat'=>$vat
        ]);
    }
}
```

## Stop using superglobals (`$_GET`, `$_POST`...)
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">Do not use superglobals like `$_GET`, `$_POST` or `$_REQUEST`.
Instead, use the request object of your framework.</div>

###Explanation

Each MVC framework comes with a **request** object. Modern frameworks should [share a common
 request object has it has been defined in PSR-7 compatible one](http://www.php-fig.org/psr/psr-7/).
This request object can be used to access GET and POST parameters.

You should use it instead of accessing `$_GET`, `$_POST` or `$_REQUEST` directly.

This has several advantages:

- you can unit-test your methods more easily since they do not rely on globals
- your framework can enrich the request, apply filters or middleware on it
- you can easily fake a request or modify a request
- your code is more predictable since only controllers are allowed to use that request object (see next rule)

<div class="alert alert-danger">So this is what you should NOT do:</div>

```php
class ProductController
{
    // ...
        
    /**
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        // NO! You don't access the $_GET superglobal anymore.
        $productId = $_GET['product_id'];

        // Do stuff...
    }
}
```

<div class="alert alert-success">The correct version of the code is:</div>

```php
class ProductController
{
    // ...
        
    /**
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        // Yes! we use the $request object to access the GET parameters.
        $productId = $request->getParams()['product_id'];

        // Do stuff...
    }
}
```

## Do not pass the request object to services
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">The request object should stay in your controller.</div>

###Explanation

This object should **stay in the controller**.

<div class="alert alert-danger">So this is what you should NOT do:</div>

```php
class ProductController
{
    // ...
    
    /**
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        // NO! Do not pass the request to a service or a DAO
        $product = $this->productRepository->getProductById($request);

        // Do stuff...
    }
}
```

The code above is *evil* because if you want to change the name of a GET parameter in your controller, suddenly, you
have to change the code in your `productRepository` service. This is obviously wrong, since services are supposed
to be independent from the context in which they run.

<div class="alert alert-success">The correct version of the code is:</div>

```php
class ProductController
{
    // ...
        
    /**
     * @URL /get_product
     */
    public function ajaxGetProductAction(ServerRequestInterface $request): ResponseInterface {
        // The controller is in charge of extracting the parameters from the request.
        $productId = $request->getParams()['product_id'];
        // The service only takes the necessary parameters
        $product = $this->productRepository->getProductById($productId);

        // Do stuff...
    }
}
```

## Services should not return encoded data
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">Services should generally return PHP objects. They should not encode data in JSON.
This is the role of the controller.</div>

###Explanation

Data returned by services should be immediately reusable by other services. In PHP, the most usable data representation
is a PHP object, so this is what a service should return.

It is not the role of a service to format the data so that it can be easily sent to the browser. This role of formatting
is usually taken by the controller (or by the view if HTML is returned) 

To put things simply: `json_encode` belongs to the controller.

<div class="alert alert-danger">So this is what you should NOT do:</div>

```php
class ProductController
{
    // ...
    
    /**
     * @URL /products
     */
    public function ajaxGetProducts(ServerRequestInterface $request): ResponseInterface {
        return $this->productRepository->getProductList();
    }
}

class ProductRepository
{
    public function getProductList(): ResponseInterface {
        $products = [];
        // Query products in databases
        // ...
        
        // NO! A service or a DAO should return objects, not encoded strings!
        return json_encode($products);
    }
}
```

<div class="alert alert-success">The correct version of the code is:</div>

```php
class ProductController
{
    // ...
    
    /**
     * @URL /products
     */
    public function ajaxGetProducts(ServerRequestInterface $request): ResponseInterface {
        // YES! The controller is encoding data in JSON
        // Moreover, it is doing so using a JsonResponse object.
        return new JsonResponse($this->productRepository->getProductList());
    }
}

class ProductRepository
{
    /**
     * @return Product[]
     */
    public function getProductList(): array {
        $products = [];
        // Query products in databases
        // ...
        // YES! The service is returning objects.
        return $products;
    }
}
```
