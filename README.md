# 8ff

8ff (8 fast fingers) is a local type testing "application" that gives you a typing test for a certain amount of seconds and gives you your average WPM (words per minute, this is how typing speed is measured).

> This application will be build in Javascript using Svelte as the front-end framework.

## Specification (😉)

"specifications" will start from the inner-most part of the app and build up.

All logic of word generation, keyboard listeners, and UI for the words view will be in `src/components/Words.svelte`.

### Words

Using the library, `random-words`, 99 words are generated. Each letter gets it's own element for word and letter indexing to keep track of user's input position. Code will look smt like so:

```svelte
{#each wordList as word, index}
	<span data-word={index}>
		{#each word as letter, index}
			<span data-letter={index}>{letter}</span>
		{/each}
	</span>
{/each}
```

this is a "nested each block" approach, so the letters can be generated from one array (`wordList` in this case).

### Input Validation/Listener

A `"keydown"` window listener will be set when the `Words` component is mounted. Only characters from A-Z will be validated. By using the word and letter index tracking variable respectively (starts at 0, 0 by default), the respective letter's element can be selected by:

> index needs to be converted to a string via `.toString()` to be a valid selector.

```js
docuemnt.querySelector(
	`[data-word="${wordTrack.toString()}"] > [data-letter="${letterTrack.toString()}"`
);
```

The letter's value will then be compared with the character the user inputted, and depending on the result, one of the classes will be applied to said letter's element: `.letter-correct`, `.letter-incorrent`.

The letter tracking index will then be incremented by 1.

If a character is inputted after reaching the end of the word, a new letter element with the class `.letter-wrong` will be created and appended to the respective word element. The reason for this is for a more "feedback"-y input feeling. UX (user experience).

To focus to the next word, the listener for the input of `Space` and jumps to the next word by incrementing the word tracking index by 1 if the following criteria is met:

- at least one letter has been typed.

> It basically means it is possible to skip a word if you find it too difficult.

To remove the last letter, the listener listens for the input of `Backspace` and removes the state class from the focused letter and decrement the tracking index by 1.

It also allows to remove a whole word by holding either `Ctrl` or `Alt` while pressing `Backspace`, that works by applying DRY and having the logic of removing the last letter into two of it's own function, the part of removing the letter's states and decrementing the index, and the part that focuses to the previous word's last modified letters' index. which is later is used like so:

```ts
/* ... */
if (e.ctrlKey || e.AltKey) {
	// Jump to previous word if the current word hasn't been started yet
	if (letterTrack == 0) {
		goToPrevWord();
	}
	// Loop through each letter and remove them
	for (let i = letterTrack - 1; i >= 0; i--) {
		removeLetter(i);
	}
} else {
	// Remove previous letter
	removeLetter(letterTrack - 1);
}
/* ... */
```

If the user hasn't typed any letter of their current word and wants to remove a whole word, it's assumed they want to remove the previous letter, just as in a normal text editor.

### Countdown Logic

When the user inputs a valid character and thus starts to type the word list, a countdown is started using `requestAnimationFrame` which runs the `countdownTick` function which gets the delta by subtracting the current time by the time recorded in the last frame, records the time for use of the next frame, subtracts the main countdown by the delta, and then goes recursive (`countdownTick` is a recursive function) until the countdown ends (`countdown <= 0`).

> the time is recorded before running the first `requestAnimationFrame` so the first frame's delta can be calculated accurately.

### WPM Algorithm

The algorithm will be progress-based to prevent mashing the keyboard give a high WPM count regardless of it all being wrong. key presses will still be used to calculate a more accurate accuracy.

> A word is considered completed after hitting `Space` after finishing the word, this is to avoid counting a half-typed word or re-adding a word's points if the last letter is re-typed.

A word will be defined as any five characters, including spaces, but NOT "modifier" keys like `Backspace`, `Ctrl`, or `Alt`. (to prevent final result being luck-based).

After each word, if only the word is completely correct, and only then will the characters be added to `correctWordLetters`. To add spaces into the formula, `wordTrack` can be used since each space is actually a `wordTrack` increment. For the accuracy however, `totalKeyPresses` will be incremented every time a valid key is pressed, and if the letter is correct, `correctKeyPresses` will be incremented.

The formulas for the each of the results are as shown:

- **WPM:** (`correctWordLetter` + `wordTrack`) ÷ 5 × `elapsedTimeInMinutes`
- **Raw WPM:** `totalKeyPresses` ÷ 5 × `elapsedTimeInMinutes`
- **Accuracy:** `correctKeyPresses` ÷ `totalKeyPresses` × 100
- **Raw Adjusted WPM (RAWPM)**: `rawWPM` × `accuracy`

### UI

The word list is wrapped with a wrapper that has a fixed height that is calculated on mount to only show 3 lines by clipping overflowing content, and as the `letterTrack` is modified, the caret moves near to the respective letter to give an accurate "caret" feel. `.getBoundingClientRect` is used on the necessary elements to know the current positioning. If the caret goes to the 3rd line (last line), the parent element of all words is then translated up by the height of each word (to hide the first line).

### Output

When the timer test is completed inside `Words.svelte`, it runs a callback passed from the main page that has the results as the callback's argument, which looks smt like this:

```js
{
	"wpm": 67     // Words Per Minute
	"rwpm": 72    // Raw Words Per Minute
	"acc": 89     // ACCuracy of key presses
	"rawpm": 68   // Raw Adjusted Words Per Minute (rwpm with accuracy accounted)
}
```

The UI of the results run in an `{#if results}`, such that when `results` are available, `<Words />` is unmounted, and only mounted back when `results` is set to `null` (when the user wants to try again).

## Testing (😅)

> Requires NodeJS

1. Install dependencies via `pnpm`

```
pnpm install
```

2. Run for development

```
pnpm dev
```

Participate in the typing test until the countdown runs down and see your results. Click "Try again" to participate again.

## Future roadmap

- Implement a settings feature for users to modify settings as they wish
- Have more test variants, word-based, time-based, and maybe even quote-based
- Implement on-screen keyboard
- Multiple layouts without having to actually switch your keyboard layout via your OS (eg. Colemak, Workman, Dvorak)
- Arabic support

## Inspirations/Credits

- [monkeytime](https://monkeytype.com) - for being so inspiring
- [ascii-faces](https://www.npmjs.com/package/ascii-faces) - for the kaomojis
- [shadcn-svelte](https://www.shadcn-svelte.com) and [tweakcn](https://tweakcn.com/editor/theme) - for the awesome skeleton-like components and theming respectively
