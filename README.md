# foobar2000 JavaScript overhaul

> This place is not a place of honor.
>
> No highly esteemed deed is commemorated here.
>
> Nothing valued is here.
>
> What is here is dangerous and repulsive to us.
>
> This message is a warning about danger.

## What is this thing

I wrote some JavaScript a decade ago for displaying song info in foobar2000. The original code is _bad_. I wanted to make it better. This repo is me finding out exactly how much I can bend the poor JavaScript engine in the JScript Panel.

## How do I use it

You need a copy of foobar2000 and the [foo_jscript_panel plugin by marc2003](https://github.com/marc2k3/foo_jscript_panel) to use this panel.

To build this repository, you need a functioning Node dev environment and `npm` or `yarn`.

1.  Clone this repository
1.  Run `yarn`, then `yarn build`. This will produce a `dist/index.js`.
1.  In foobar2000, add the foo_jscript_panel to your UI
1.  Right click on the foo_jscript_panel and choose "Configure".
1.  In the window that pops up, click the "Tools" button in the bottom left, then choose "Import..."
1.  Navigate to the `dist/` folder in this repo and choose the index.js file.

## Experiments tried so far

* Transpilation from TypeScript using a horrifying hackjob of Browserify, Babelify, Tsify, and Gulp
* Introducing Redux, because why not

## WIP and TODO

* [ ] 🏃‍ A comprehensive and thorough documentation and type definition of the original JScript Panel interfaces and related documentation into TypeScript type definitions
* [ ] Figure out if I can get an existing JavaScript UI library to work with GDI
* [ ] Actually make my original code work again

## Is it any good

Oh god no.
