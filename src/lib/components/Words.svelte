<script lang="ts">
	import type { TypingResults } from '$lib/utils';
	import clsx from 'clsx';
	import { generate } from 'random-words';
	import { onMount, tick } from 'svelte';
	import { Button } from './ui/button';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { fly } from 'svelte/transition';

	const COUNTDOWN = 5 * 1000; // 30 seconds
	const VISIBLE_LINES = 3;
	const MAXIMUM_WORDS_PER_LINE = 12; // generates ~1.1 lines.

	const {
		onComplete
	}: {
		onComplete: (results: TypingResults) => void;
	} = $props();

	let wordList: string | string[] = $state([]);

	// words
	let wordTrack = 0;
	let letterTrack = 0;
	let wordsWrapper: HTMLDivElement;
	let words: HTMLDivElement;
	let caret: HTMLSpanElement;

	// countdown
	let countdown = $state(COUNTDOWN);
	let lastTime = 0;
	let animationFrame = 0;

	// result tracking
	let correctWordLetters = 0;
	let totalKeyPresses = 0;
	let correctKeyPresses = 0;

	const endTest = () => {
		// Get elapsed tiem in minutes
		const elapsed = COUNTDOWN / 1000 / 60; // COUNTDOWN is in ms;
		// Get results
		const wpm = Math.round((correctWordLetters + wordTrack) / 5 / elapsed);
		const rwpm = Math.round(totalKeyPresses / 5 / elapsed);
		const acc = Math.round((correctKeyPresses / totalKeyPresses) * 100);
		const rawpm = Math.round(rwpm * (acc / 100));

		// Pass results onto parent comp
		onComplete({ wpm, rwpm, acc, rawpm });
	};

	const appendWords = (exactly = MAXIMUM_WORDS_PER_LINE * VISIBLE_LINES) => {
		wordList = [...wordList, ...generate({ exactly, minLength: 1, maxLength: 7 })];
	};

	const generateWords = async () => {
		if (wordList.length > 0) {
			// empty wordList to remove UI states
			wordList = [];
			// reset word index tracks
			wordTrack = 0;
			letterTrack = 0;
			// Reset countdown
			stopCountdown();
			countdown = COUNTDOWN;

			// Skip tick (will run after DOM updates according to empty wordList)
			await tick();
		}

		// generate (new) words in wordList
		appendWords();

		// Update caret to positioning after updating DOM once again
		tick().then(() => {
			updateCaret();
		});
	};

	const countdownTick = () => {
		const now = Date.now();
		countdown -= now - lastTime; // delta
		lastTime = now;

		// If remaining time in countdown, continue ticking
		if (countdown > 0) {
			animationFrame = requestAnimationFrame(countdownTick);
		} else {
			countdown = 0;
			stopCountdown();
		}
	};

	const startCountdown = () => {
		// Set time of starting countdown
		lastTime = Date.now();
		// Start/resume countdown
		animationFrame = requestAnimationFrame(countdownTick);
	};

	const stopCountdown = () => {
		// End/pause countdown
		cancelAnimationFrame(animationFrame);

		// End test if countdown is over
		if (countdown <= 0) {
			endTest();
		}
	};

	const updateCaret = () => {
		const word = words.querySelector(`.word[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const wordsRect = words.getBoundingClientRect();
			// caret's position is AFTER PREV letter
			const prevLetter = word.querySelector(
				`.letter[data-letter="${(letterTrack - 1).toString()}"]`
			);
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

			// Calculate distance of word from wrapper to align words
			const wordRect = word.getBoundingClientRect();
			const wordsWrapperRect = wordsWrapper.getBoundingClientRect();
			const distanceFromWrapper = wordRect.y - wordsWrapperRect.y;
			// If word is on the thrid line (second line would make distance closely EQUAL to height)
			if (distanceFromWrapper > word.clientHeight) {
				// Get how much words is alr translated
				const delta = wordsWrapperRect.y - wordsRect.y;
				// Translate words up by height of a word (next line effect)
				words.style.translate = `0 -${Math.round(delta + word.clientHeight)}px`;

				// append more words
				appendWords(MAXIMUM_WORDS_PER_LINE);
			}
		} else {
			// Remove caret when no words (after reaching end of wordlist)
			caret.remove();
		}
	};

	const gotoPrevWord = () => {
		const prevWord = words.querySelector(`.word[data-word="${(wordTrack - 1).toString()}"]`);
		if (prevWord) {
			// Prevent going back to a word that's already correct
			if (!prevWord.classList.contains('incorrect')) {
				return;
			}

			// Remove incorrect state
			if (prevWord.classList.contains('incorrect')) {
				prevWord.classList.remove('incorrect');
			}
			// decrement word index
			wordTrack--;

			const letters = prevWord.querySelectorAll('.letter');
			let letterPos = 0;
			// Get letter position (letters with states)
			for (const [index, letter] of letters.entries()) {
				// If letter doesn't contain any state, that's the position to jump the user back to
				if (
					!letter.classList.contains('incorrect') &&
					!letter.classList.contains('correct') &&
					!letter.classList.contains('wrong')
				) {
					letterPos = index;
					break;
				}
			}

			// set letter index, fallback to last letter if letterPos isn't set (everything has a state)
			letterTrack = letterPos || letters.length;
		}
	};

	const removeLetter = (index: number) => {
		const word = words.querySelector(`.word[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const prevLetter = word.querySelector(`.letter[data-letter="${index.toString()}"]`);
			if (prevLetter) {
				// Delete if wrong letter (extra wrong letters)
				if (prevLetter.classList.contains('wrong')) {
					prevLetter.remove();
				}
				// Remove class if exists
				else if (prevLetter.classList.contains('incorrect')) {
					prevLetter.classList.remove('incorrect');
				} else if (prevLetter.classList.contains('correct')) {
					prevLetter.classList.remove('correct');
				}
				// Decrement letter index tracking
				letterTrack--;
			}
			// user is on the first index (0), go to previous word's last index
			else {
				gotoPrevWord();
			}
		}
	};

	const keyListener = (e: KeyboardEvent) => {
		// Select word and letter
		const word = words.querySelector(`.word[data-word="${wordTrack.toString()}"]`);
		if (word) {
			const letter = word.querySelector(`.letter[data-letter="${letterTrack.toString()}"]`);

			// To cancel or restart
			if (e.key == 'Escape') {
				generateWords();
			}

			// For removing letter
			if (e.key == 'Backspace') {
				e.preventDefault();
				if (e.ctrlKey || e.altKey) {
					if (letterTrack == 0) {
						// Jump to previous word if the current word hasn't been started yet
						gotoPrevWord();
					}
					// Loop through each letter and remove them
					for (let i = letterTrack - 1; i >= 0; i--) {
						removeLetter(i);
					}
				} else {
					// Remove letter
					removeLetter(letterTrack - 1);
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

			// increment tracking var
			totalKeyPresses++;

			// If key press is a letter
			if (allowedChars.trim().includes(e.key)) {
				// Start countdown (countdown only starts from allowedChars excluding spaces)
				if (countdown == COUNTDOWN) {
					startCountdown();
				}

				// if letter index is 14 (max length of possible words is 13)
				if (letterTrack == 14) {
					return;
				}

				// If letter exists
				if (letter) {
					// If letter matches
					if (e.key == letter.innerHTML) {
						letter.classList.add('correct');
						// incrememnt tracking var
						correctKeyPresses++;
					} else {
						letter.classList.add('incorrect');
					}
				}
				// Create a new letter and append to word
				else {
					const newLetter = document.createElement('span');
					newLetter.classList.add('letter', 'wrong');
					newLetter.dataset.letter = letterTrack.toString();
					newLetter.innerHTML = e.key;
					word.appendChild(newLetter);
				}

				letterTrack++; // increment letter index track
				updateCaret();
			}
			// Let user skip work with 'Space' after typing atleast one character
			else if (letterTrack > 0) {
				// If word is not completed
				if (letterTrack < wordList[wordTrack].length) {
					word.classList.add('incorrect');
				}
				// If word contains a wrong state
				else if (word.querySelectorAll('.letter.wrong, .letter.incorrect').length > 0) {
					// make word state wrong
					word.classList.add('incorrect');
				}
				// If word does not cintain any wrong states
				else {
					// Increment length of correct letters into correctWordLetters
					const letters = word.querySelectorAll('.letter.correct');
					correctWordLetters += letters.length;
				}

				wordTrack++;
				letterTrack = 0;
				updateCaret();

				// incrememnt tracking var
				correctKeyPresses++;
			}
		}
	};

	onMount(() => {
		// Generate words
		generateWords();
		// Add listener for user input
		window.addEventListener('keydown', keyListener);

		// Wait till DOM update word generation
		tick().then(() => {
			// Set fixed height of wordsWrapper to 3 times the height of a word (for 3 lines)
			wordsWrapper.style.height = (words.querySelector('.word')?.clientHeight || 1) * 3 + 'px';
		});

		return () => {
			window.removeEventListener('keydown', keyListener);
		};
	});
</script>

<div in:fly={{ y: 64 }} class="mt-32 mb-64 flex flex-col gap-4">
	<!-- Countdown -->
	<p
		class={clsx(
			'text-3xl text-primary',
			// Hide countdown if countdown hasn't started
			COUNTDOWN == countdown && 'opacity-0'
		)}
	>
		{Math.ceil(countdown / 1000)}
	</p>
	<!-- Words wrapper -->
	<div bind:this={wordsWrapper} class="max-w-prose overflow-y-clip text-3xl font-medium">
		<!-- Word "paragraph" -->
		<div bind:this={words} class="relative flex flex-wrap gap-x-[1ch] max-sm:justify-center">
			<span
				bind:this={caret}
				class="absolute z-10 h-[1.3em] w-0.75 -translate-x-0.5 translate-y-1 animate-pulse rounded-full bg-primary"
			></span>
			{#each wordList as word, index}
				<span data-word={index} class="word">
					{#each word as letter, index}
						<span data-letter={index} class="letter">
							{letter}
						</span>
					{/each}
				</span>
			{/each}
		</div>
	</div>
	<!-- Restart button -->
	<Button
		class="mt-2 self-center"
		variant="ghost"
		onclick={() => {
			generateWords();
		}}
	>
		<RotateCcw />
		Restart
	</Button>
</div>
