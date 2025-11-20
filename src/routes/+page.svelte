<script lang="ts">
	import { generate } from 'random-words';
	import { onMount } from 'svelte';

	const wordList = generate({ exactly: 16, minLength: 1, maxLength: 7 });

	let wordTrack = 0;
	let letterTrack = 0;
	let words: HTMLDivElement;

	const keyListener = (e: KeyboardEvent) => {
		// Select word and letter
		const word = words.querySelector(`[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const letter = word.querySelector(`[data-letter="${letterTrack.toString()}"]`);

			if (e.key == 'Backspace') {
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
			}

			// Cancel if any modifier key is being pressed (SHIFT included since all words are lowercase)
			if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
				return;
			}

			const allowedChars = 'abcdefghijklmnopqrstuvwxyz ';
			// Ignore if chars are not allowed or if letter index is 14 (max length provided by api)
			if (!allowedChars.includes(e.key) || letterTrack == 14) {
				return;
			}

			// If key press is a letter
			if (allowedChars.trim().includes(e.key)) {
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
			}
			// If word is over (if letter index is equal to word length, the word is over)
			else if (letterTrack >= wordList[wordTrack].length) {
				wordTrack++;
				letterTrack = 0;
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
	});
</script>

<main
	class="flex h-full w-full flex-col items-center-safe justify-center-safe bg-background font-mono font-medium"
>
	<div bind:this={words} class="flex max-w-prose flex-wrap gap-[1ch] text-3xl">
		{#each wordList as word, index}
			<span data-word={index}>
				{#each word as letter, index}
					<span data-letter={index} class="opacity-60">
						{letter}
					</span>
				{/each}
			</span>
		{/each}
	</div>
</main>
