---
title: "Quick Tip: Add a Snippet to vs Code to Pre-fill Front Matter on Eleventy Sites"
description: I just discovered a VS Code hack everyone probably already knows!
date: 2025-03-31
draft: true
tags: software tips
permalink: "/quick-tip-add-vscode-snippets/"
---

I wanted a shortcut for pre-filling the front matter metadata that goes at the top of posts in the source code of [Eleventy.js](https://www.11ty.dev/) websites. It can look like this for a typical blog post:

```
---
title: Post title
description: Post description
date: 2025-03-31
draft: true
tags: some-tag
---
Here goes your blog post content!
```

Having to copy and paste this block of text everytime I started a new post got tedious pretty fast.

It turns out that VS Code lets users define their own [code snippets](https://code.visualstudio.com/docs/editing/userdefinedsnippets) and even create keyboard shortcuts for them, too.

With VS Code open, go to Code > Settings > Configure Snippets and type "markdown" in the dropdown (alternatively, you can type ⇧Shift + ⌘Cmd + P on Mac or Ctrl + Shift + P on Windows/Linux to pull up the Command Palette, and type "markdown" in the dropdown). This opens up a `markdown.json` configuration file. Paste the following into this file:

```json
{
  "11ty Blog Post": {
    "prefix": ["11typost"],
    "body": ["---\ntitle: ${1:Post title}\ndescription: ${2:Post description}\ndate: ${3:yyyy-mm-dd}\ndraft: true\ntags: some-tag\n---\n"],
    "description": "Pre-fill frontmatter on new blog posts"
  }
}
```

This defines a snippet named `11ty Blog Post` which will replace the shortcut `11typost` with a block of text similar to the example above. To use the snippet, type `11typost` (or whatever you defined as the prefix) anywhere in a Markdown file and press ⌥Option + Esc on Mac (or Ctrl + Space on Windows/LInux) to fill in the snippet in lieu of the shortcut. You'll notice the cursor is immediately inserted into the title block --- that's because of the `${1:Post title}` tabstop we specified in the snippet. Type in your post title, then press the Tab key, and the editor will automatically navigate you in turn to the description field (denoted with `${2:description}`), then the date field, and finally the body section of your blog post.

If for some reason you don't want this snippet available globally to all of your projects, you can create a `markdown.code-snippets` file in a `.vscode` folder in your project root and store this snippet there. Note that for local snippets, you'll likely want to specify a `"scope": "markdown"` property in the JSON block to limit that snippet to just markdown files.

For an extra power up, you can even create a shortcut for this snippet and skip the 2-step process required to activate the snippet. To do that, open your custom `keybindings.json` via Code > Settings > Keyboard Shortcuts (or Command Palette > type: "keyboard shortcuts JSON") and insert the following into the array:

```json
{
  "key": "ctrl+shift+1",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus",
  "args": {
    "langId": "markdown",
    "name": "11ty Blog Post"
  }
}
```

You can use whatever keyboard shortcut you like in the `key` field, of course.

Now all you have to do to activate this snippet is type ⌃Ctrl + ⇧Shift + 1 anywhere in your Markdown file, and you can start blogging right away. Ah!
