+++
date = '2026-02-13T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 024'
summary = ''
+++

Let's get back to the beginning of this challenge, Laravel. I have a few Laravel projects on the burner. One of them is an educational project, tied to the [Laravel From Scratch (2026)](https://laracasts.com/series/laravel-from-scratch-2026/) series on Laracasts. Laravel moves relatively fast, and despite having done this series on an earlier version of Laravel, I could use the refresh. Onto Episode 5, _Pass Data to Views_.

## Vite Hot Reload Not Working

I found that the hot reload functionality of Vite wasn't working, and I didn't want to wait until later in the course for it to be enabled. I found the option to add into `layout.blade.php`. Add the following Vite directive to the `<head>` tag.

```php
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

## Passing Simple Variables to a View (Episode 5)

In the route file, add a variable and a value, then access that variable via the view.

- web.php

```php
Route::view('/', 'welcome', [
    'greeting' => 'Hello',
    'person' => 'Jim',
]);
```

- welcome.blade.php

```php
<x-layout title="Home">
    {{  $greeting }}, {{ $person }}
</x-layout>
```

### Pass a `GET` Request Parameter

Instead of using a hard-coded value in the variable, pass in `request`.

```php
Route::view('/', 'welcome', [
    'greeting' => 'Hello',
    'person' => request('person'),
]);
```

Then pass the data via a url parameter:

```http
http://localhost:8000/?person=Jim
```

### Passing Trusted Input

If the input is trusted, using a `!!` inside a single template brace will bypass any default escaping by Laravel. This makes the parameter vulnerable to XSS if processing untrusted input.

```php
<x-layout title="Home">
    {{  $greeting }}, {!! $person !!}
</x-layout>
```

### Using `Route::get`

The syntax for using `Route::get` is slightly different than `Route::view`, but functionally the same.

```php
Route::get('/', function() {
  return view('welcome', [
    'greeting' => 'Hello',
  ]);
});
```

### Use a Default Argument

If no parameter is passed, the variable may default to `null`, which won't show anything. This could break the UI. Instead, provide a default argument that works even if the parameter was not passed. Add a second parameter to the `request` function to provide a default value.

```php
Route::view('/', 'welcome', [
    'greeting' => 'Hello',
    'person' => request('person', 'World'),
]);
```
