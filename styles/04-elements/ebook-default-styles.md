# Default Stylesheet For Reader

The base stylesheet serves multiple purposes:

1. It has to be readable, legible, and well typeset.
2. Since one of the reasons why we are going with a no-author-styles approach to the Reader App is to try to leverage the text's semantic structure for active reading, the stylesheet needs to expose that semantic structure using typesetting and design conventions that the reader proper will recognise.

# The Parts

* **Headings:** We need styles for all heading levels, each clearly distinct and with a clear hierarchy.
* **Lists**: Do we want to outdent list markers? Might be possible using grid display.
* **Block Quotes**: Need to be distinct without adding undue emphasis (i.e. don't increase font size)
* **Cite**: Italic.
* **Figures**: need a base style plus styles for image, table, and quotation figures.
* **Horizontal Rule**
* **Tables**: need to support table headings both in rows and columns.
* **Footnotes**: both blog markup (i.e. `rel`) and EPUB markup.
* **Images and media**.
* **Paragraphs**. Text indents.
* **Sections and Articles**: Do we treat the beginning and end of sectional content in the same way as we do horizontal rules?
* **Definition lists**
* **Detail/Summary**
* **Links** - external, internal to book, internal to chapter
* Non-link **anchors**
* **Linked images** (border plus arrow icon in corner)

## The Layout

A six column layout (margin, sidebar, margin, main text, margin, margin buttons)

Top menu only has three (top left, centre, top right).

## Paragraph Style

Indented or spaced?

Despite the claims made by those who favour the more traditional first line indent (which includes me), there is no real concrete evidence to indicate the superiority of one method over the other. The studies I've found have generally either been flawed or so small in scale that random noise makes the result less than reliable.

There is, however a lot to be said for familiarity and convention as the space-between-paragraphs is near universal for scrolled text.

In addition, most of the arguments in favour of the first line indent claim that it helps keep the reader immersed in the text which is exactly what you don't want for active reading. You want the reader to be engaged but aware of the text as a structure and a construct. Immersion takes you into the text's world and makes you oblivious to the text itself.

# Issues

## Normalisation

Since we are creating a web service, sanitising the book's markup is essential to prevent security issues. It's possible to normalise the markup while sanitising but that is risky and prone to just plain breaking the book.

## Phishing and copying app styles

One aspect we can't overlook is malicious book content posing as native app controls. This shouldn't be much of a problem at the moment as we filter out all form elements and don't allow publisher styles, but it could be an issue with links using an app-specific class selector. It is also an issue preventing us from implementing more interesting ebook form features, long term.

The simplest solution would be for us to use a distinctive prefix for all of our class selectors and then use the sanitisation library to strip out all classes with that prefix. That should let the publisher use classes for microformats purposes and the like. Alternatively, if we think the only valid non-style, non-JS use of a class are microformats, we could simply add them to a whitelist.

## Configuration

By using CSS custom properties, it should be relatively simple to let the reader customise things like font-size, line-height, column width, and font family.

One of the big problems with text settings is that they are all _inter-related_. Line-height and column width are dependent on font size and typeface so the likeliest result of giving the reader granular controls over each variable is that it becomes _extremely difficult_ for the reader to find their optimal setting.

Other issues:

* The optimal setting for one device may be horrible on another (solved by not syncing text settings to the server but saving them locally).
* The optimal setting for one orientation may be horrible on another. This is an especially acute problem for narrow phone screens that are extremely narrow columns in portrait but as wide as a small tablet in landscape.
* The typeface the user wants may not be available. (Solved by only letting the reader select fonts we know we can embed.)
* The colour theme chosen by the reader may conflict with OS-set colour themes that serve the same purpose. E.g. a sepia toned theme conflicts with the built-in blue light filter and a reading UI dark mode can conflict with the system dark mode.

To begin with, we're only going to support colour themes through the `prefers-color-scheme` media selector. This should switch to a dark background and possibly darken images as well (brightening them again when they are hovered over or tapped).

Column width and line-height should be limited to a few broad categories (extra narrow, narrow, normal, wide, extra wide) where the exact value is dependent on the font size and type-face.

Column width setting should be disabled when the screen itself is too narrow.
