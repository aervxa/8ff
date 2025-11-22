<script lang="ts">
	import { generate } from 'random-words';
	import { onMount } from 'svelte';

	const {
		onComplete
	}: {
		onComplete: (data: { start: Date; end: Date }) => void;
	} = $props();

	const wordList = generate({ exactly: 99, minLength: 1, maxLength: 7 });

	// words
	let wordTrack = 0;
	let letterTrack = 0;
	let words: HTMLDivElement;
	let caret: HTMLSpanElement;

	// TODO: Countdown must have a way to be paused, maybe Esc

	// countdown
	let countdown = 5 * 1000; // 30 seconds
	let lastTime = 0;
	let animationFrame = 0;

	const tick = () => {
		const now = Date.now();
		countdown -= now - lastTime;
		lastTime = now;

		console.log(countdown);

		// If remaining time in countdown, continue ticking
		if (countdown > 0) {
			animationFrame = requestAnimationFrame(tick);
		} else {
			endCountdown();
		}
	};

	const startCountdown = () => {
		// Set time of starting countdown
		lastTime = Date.now();
		// Start countdown
		animationFrame = requestAnimationFrame(tick);
	};

	const endCountdown = () => {
		// End countdown
		cancelAnimationFrame(animationFrame);
	};

	const updateCaret = () => {
		const word = words.querySelector(`[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const wordsRect = words.getBoundingClientRect();
			// caret's position is AFTER PREV letter
			const prevLetter = word.querySelector(`[data-letter="${(letterTrack - 1).toString()}"]`);
			// If prevLetter
			if (prevLetter) {
				const rect = prevLetter.getBoundingClientRect();
				caret.style.top = rect.y - wordsRect.y + 'px';
				caret.style.left = `calc(${rect.x - wordsRect.x}px + 1ch)`;
			} else {
				const rect = word.getBoundingClientRect();
				caret.style.top = rect.y - wordsRect.y + 'px';
				caret.style.left = rect.x - wordsRect.x + 'px';
			}
		} else {
			// Remove caret when no words (after reaching end of wordlist)
			caret.remove();
		}
	};

	const keyListener = (e: KeyboardEvent) => {
		// Select word and letter
		const word = words.querySelector(`[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const letter = word.querySelector(`[data-letter="${letterTrack.toString()}"]`);

			if (e.key == 'Backspace') {
				e.preventDefault();
				// Remove letters
				//  letter.previousElementSibling is cleaner, but doesn't work on the last index
				const prevLetter = word.querySelector(`[data-letter="${(letterTrack - 1).toString()}"]`);

				if (prevLetter) {
					// Delete if wrong letter (extra wrong letters)
					if (prevLetter.classList.contains('wrong-letter')) {
						prevLetter.remove();
					}
					// Remove class if exists
					else if (prevLetter.classList.contains('incorrect-letter')) {
						prevLetter.classList.remove('incorrect-letter');
					} else if (prevLetter.classList.contains('correct-letter')) {
						prevLetter.classList.remove('correct-letter');
					}
					// Decrement letter index tracking
					letterTrack--;
				}
				// user is on the first index (0), go to previous word's last index
				else {
					const prevWord = words.querySelector(`[data-word="${(wordTrack - 1).toString()}"]`);
					if (prevWord) {
						wordTrack--; // decrement word index
						letterTrack = prevWord.children.length; // set letter index to last letter of prevWord
					}
				}
				updateCaret();
			}

			// Cancel if any modifier key is being pressed (SHIFT included since all words are lowercase)
			if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
				return;
			}

			const allowedChars = 'abcdefghijklmnopqrstuvwxyz ';
			// Ignore if chars are not allowed
			if (!allowedChars.includes(e.key)) {
				return;
			}

			// prevent default behavior if valid key is pressed
			e.preventDefault();

			// Start countdown
			startCountdown();

			// If key press is a letter
			if (allowedChars.trim().includes(e.key)) {
				// if letter index is 14 (max length of possible words is 13)
				if (letterTrack == 14) {
					return;
				}

				// If letter exists
				if (letter) {
					// If letter matches
					if (e.key == letter.innerHTML) {
						letter.classList.add('correct-letter');
					} else {
						letter.classList.add('incorrect-letter');
					}
				}
				// Create a new letter and append to word
				else {
					const newLetter = document.createElement('span');
					newLetter.classList.add('wrong-letter');
					newLetter.dataset.letter = letterTrack.toString();
					newLetter.innerHTML = e.key;
					word.appendChild(newLetter);
				}

				letterTrack++; // increment letter index track
				updateCaret();
			}
			// If word is over (if letter index is equal to word length, the word is over)
			else if (letterTrack >= wordList[wordTrack].length) {
				wordTrack++;
				letterTrack = 0;
				updateCaret();
			}
		}
		// Remove listener once wordList is completed
		else {
			window.removeEventListener('keydown', keyListener);
			// TODO: complete wordList action (let user know score n likes)
		}
	};

	onMount(() => {
		window.addEventListener('keydown', keyListener);
		updateCaret();
	});
</script>

<div
	bind:this={words}
	class="relative line-clamp-3 flex max-w-prose flex-wrap gap-x-[1ch] overflow-visible text-3xl"
>
	<span
		bind:this={caret}
		class="absolute top-0 left-0 z-10 h-[1.4em] w-0.75 -translate-x-0.5 animate-pulse rounded-full bg-primary"
	></span>
	{#each wordList as word, index}
		<span data-word={index}>
			{#each word as letter, index}
				<span data-letter={index} class="leading-relaxed opacity-60">
					{letter}
				</span>
			{/each}
		</span>
	{/each}
</div>
