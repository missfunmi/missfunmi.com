---
title: "Custom Date Shortcuts in Espanso"
description: "A handy text replacement shortcut that turns :jan31: into 'Sat Jan 31, 2026' using regex and bash."
date: 2026-01-24
tags: software tips
---

For some reason, I find myself having to type out dates a lot — in race reports, meeting notes, emails, blogposts, TODO lists. I usually like to include the weekday so I don't have to look it up later, but that means I first have to look it up in my calendar to type out a date like `Sun Jun 14, 2026` on my computer. Annoying. This seemed to me like a problem text replacement could solve, but how?

The solution sort of found me while I was looking for something else. I needed to use ⌘ in a piece of text, and for what felt like the millionth time, I found myself Googling "Apple command symbol" just to copy and paste the character from the search results. While commiserating with my fellow internet users about the somewhat annoying process involved in doing this, I stumbled across a mention of [espanso](https://espanso.org/), an open source text-replacement app. With espanso installed, typing something like `:cmd` could get replaced with ⌘, `:lol` becomes 😂, and so on anywhere that accepts text on your computer (you can [exclude](https://espanso.org/docs/configuration/app-specific-configurations/) any apps from espanso use). What sorcery!

Looking through the [docs](https://espanso.org/docs/get-started/), I realized I could combine espanso's support for [regex triggers](https://espanso.org/docs/matches/regex-triggers/) and [shell extensions](https://espanso.org/docs/matches/extensions/#shell-extension) to turn a shortcut like `:jan31:` into `Sat Jan 31, 2026` or `:mar8_2027:` into `Mon Mar 8, 2027`. Could this be the thing I had been searching for all my life? Early indications suggest it might be!

Here's how I implemented this text replacement in espanso using a bash script on macOS:

--

## The Shortcut

```yaml
# This goes in $CONFIG/match/base.yml file.
# Be sure to follow proper YAML indentation: https://yaml.org/spec/1.2.2/#61-indentation-spaces
matches:
  - regex: ":(?P<month>[a-z]{3})(?P<day>[0-9]{1,2})_?(?P<year>[0-9]{0,4}):"
    replace: "{{out}}"
    vars:
      - name: out
        type: shell
        params:
          cmd: >
            month="{{month}}"; day="{{day}}"; year="{{year}}";
            [ -z "$year" ] && year=$(date +%Y);
            mm=$(echo $month | tr '[:upper:]' '[:lower:]' | sed 's/jan/1/;s/feb/2/;s/mar/3/;s/apr/4/;s/may/5/;s/jun/6/;s/jul/7/;s/aug/8/;s/sep/9/;s/oct/10/;s/nov/11/;s/dec/12/');
            date -jf "%m %d %Y" "$mm $day $year" "+%a %b %-d, %Y"
```

There are 3 key parts to this that I'll cover below:
1. The regex, which identifies and extracts parts of the date trigger,
2. A bash script, which converts those parts into a readable weekday date
3. How espanso's `vars` system connects the regex captures to the replacement output

---

## 1. The Regex

```regex
:(?P<month>[a-z]{3})(?P<day>[0-9]{1,2})_?(?P<year>[0-9]{0,4}):
```

This regex matches patterns like `:jan31:` or `:mar8_2027:`. It extracts three pieces of information into variables: `month`, `day`, and `year` (even if `year` is blank).

**How it works:**
- **`:`** → matches a literal colon at the start.
- **`(?P<month>[a-z]{3})`** → a named capture group called `month` that matches exactly 3 lowercase letters (`jan`, `feb`, etc.).
- **`(?P<day>[0-9]{1,2})`** → a named capture group called `day` that matches 1 or 2 digits (the day of the month).
- **`_?`** → an optional underscore (appears if the year is included). I added an underscore to delineate the day from the year (e.g. in my `mar8_2027` example, it extracts `8` distinctly from `2027`).
- **`(?P<year>[0-9]{0,4})`** → a named capture group called `year` that matches 0 to 4 digits. Zero digits are allowed so that `:jan31:` without a year still works — in that case, the `year` variable is still extracted as an empty string.
- **`:`** → matches a literal colon at the end. Without this trailing colon, espanso would trigger too early — typing `:jan3` would activate before you finished typing `:jan31:` (if the latter is what you meant to type).

---

## 2. The Bash Script

```bash
month="{{month}}"; day="{{day}}"; year="{{year}}";
[ -z "$year" ] && year=$(date +%Y);
mm=$(echo $month | sed 's/jan/1/;s/feb/2/;s/mar/3/;s/apr/4/;s/may/5/;s/jun/6/;s/jul/7/;s/aug/8/;s/sep/9/;s/oct/10/;s/nov/11/;s/dec/12/');
date -jf "%m %d %Y" "$mm $day $year" "+%a %b %-d, %Y"
```

This (simpler than it looks) bash script turns the regex captures into a properly formatted date string including the weekday and fills in the current year if missing.

How it works:
1. Assign the captured regex variables to shell variables:
```bash
month="{{month}}"; day="{{day}}"; year="{{year}}";
```

2. Default the year to system year if empty (using [macOS's `date` function](https://ss64.com/mac/date.html)):
```bash
[ -z "$year" ] && year=$(date +%Y);
```

3. Map the abbreviated months to their numeric equivalents using [`sed`'s substitution command](https://www.gnu.org/software/sed/manual/sed.html#The-_0022s_0022-Command), so `jan` → `1`, `feb` → `2`, …, `dec` → `12`. There's probably a more elegant way to do this, but this works and I can read it six months from now. You can add as many substitutions as you like — `s` is pretty fast! Also, notice I don't bother doing input validation since I'm the one writing the shortcut on my computer anyway 😄
```bash
mm=$(echo $month | sed 's/jan/1/;s/feb/2/;s/mar/3/;…/');
```

4. Finally, format the date to the desired output using the `date` function:
```bash
date -jf "%m %d %Y" "$mm $day $year" "+%a %b %-d, %Y"
```
- `-j` → tells the computer we're not trying to set the system date — we're just looking to parse and format via the additional flag `f`
- `-f "%m %d %Y"` → tells `date` how to interpret the input string — i.e. as `"month day year"` (e.g., `"1 31 2026"`)
- `"+%a %b %-d, %Y"` → indicates how the date should be formatted on output; i.e. the above example input date becomes `Sat Jan 31, 2026` on output

---

## 3. The `vars` Attributes

```yaml
vars:
  - name: out
    type: shell
    params:
      # The command is written in YAML Multi-line format: https://yaml-multiline.info/
      cmd: >
	      <bash script>
```

espanso's `vars` lets you dynamically compute replacement text using shell logic (or other types, like clipboard, input, etc.). In this case, the shell script reads the regex captures and outputs a formatted date string.

**How it works:**
- **`name: out`** → the variable that espanso will replace in `replace: "{{out}}"`.
- **`type: shell`** → tells espanso to execute a shell command to compute the value of this variable.
- **`params: cmd`** → the actual shell command to run. This command can reference the named regex captures using `{{month}}`, `{{day}}`, and `{{year}}`. The output of the command is then returned back as the replacement for the matched text.

---

And that's it! Note on Windows, you'd need to adapt the `date` parsing logic in step 2 from bash to the equivalent PowerShell function, but the regex and espanso structure stay the same. The core pattern of regex → shell script → formatted output works across platforms.

It took quite a few iterations, as well as some [AI help with the regex](https://www.reddit.com/r/ProgrammerHumor/comments/tdtdfn/id_like_you_to_meet_regex/), but I'm pretty happy with the result. It's not quite as snappy as the simple text replacement match pairs, which is a shame because I really wanted to feel smug about shaving 0.3 seconds off my date-typing workflow. I suppose the regex matching and script execution adds an unavoidable tiny overhead in espanso's translation. Guess I'll live with that (for now).

Now when I'm recapping meetings or writing race reports, instead of typing out "Sat Jan 31, 2026," I can just type `:jan31:` and not even have to open my calendar. Win! If only I can find a way to do this on iPhone... 🤔
