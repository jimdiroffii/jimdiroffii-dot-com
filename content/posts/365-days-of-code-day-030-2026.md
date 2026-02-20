+++
date = '2026-02-19T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 030'
summary = ''
+++

## Project Status

Going to start including the project status table moving forward. This should help better track progress over the year.

| Project                 | Language      | Status          | Due Date   | Latest Update                                                                                             |
| :---------------------- | :------------ | :-------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. There are some TODOs. Need to work on categorization, tagging, and layout improvements. |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 6                                                                                                 |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Project Euler           | C             | Ongoing         | None       | Working on P25 on a best effort basis. Currently building a BigInt library.                               |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                                                                   |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                                                                   |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                                                             |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |

## Laravel From Scratch - Blade Directives

_Blade Directives_ are shortcuts for PHP control structures, such as `if/else` or `for` loops. There are a ton of convenience features available through blade directives. Such as `@unless`.

```php
@unless (Auth::check())
    You are not signed in.
@endunless
```

This is a fairly huge topic that dives deep into the power of the blade system.

## Laravel From Scratch - Forms

Forms in Laravel are typical forms, but there are a few tricks, such as handling CSRF tokens.

```php
<form>
  @csrf
</form>
```

On the route side, check the data that was submitted by using `dd`. The `request()->all()` methods can be used to check the data that was received.

```php
Route::post('/ideas', function () {
    dd(request()->all());
});
```

And the request data is returned.

```php
array:2 [▼ // routes/web.php:9
  "_token" => "Nm7FxeHWJjOKZ3BXNRFdWtxJnTlfUvzFgmBZUHHZ"
  "idea" => "asdf"
]
```

The data could be accessed using the request method.

```php
Route::post('/ideas', function () {
    $idea = request('idea');
    echo $idea;
});
```

It is also possible to use a Laravel Facade.

```php
use Illuminate\Support\Facades\Request;

Route::post('/ideas', function () {
    $idea = Request('idea');
    echo $idea;
});
```

It is also possible to use the request as a parameter.

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/ideas', function (Request $request) {
    $idea = $request->input('idea');
    // or, $request->idea;
    echo $idea;
});
```

Ensure the correct `use` class for the method.

### Store Session and Redirect

The data pushed via the request can be stored in the session. Furthermore, we can redirect the user to another page, where that data is displayed.

```php
Route::post('/ideas', function (Request $request) {
    $idea = $request->input('idea');
    session()->push('ideas', $idea);

    return redirect('/');
});
```

```php
@if (count($ideas))
<div>
    <h2>Your Ideas</h2>
    <ul>
        @foreach ($ideas as $idea)
            <li>{{ $idea }}
        @endforeach
    </ul>
</div>
@endif
```

## Syntax Highlighting Blade Files in Markdown

Syntax highlighting. How does it work? _iykyk_

Syntax highlighters use either regex or parsing to tokenize the source code and apply a style to the tokens.

This is relevant because my Hugo markdown does not support syntax highlighting for Blade by default. I'll need to add this support, or just use PHP. Hugo uses the [Chroma](https://github.com/alecthomas/chroma) package to provide syntax highlighting. There is no support for Blade in Chroma. To support most highlighting, I'm going to switch my Blade code fences to PHP, even if there are some highlights missing (such as `endunless`, above).

Much like [timezone parsing](https://www.youtube.com/watch?v=-5wpm-gesOY), let's all be very grateful to the people that maintain syntax highlighting rules.
