<script lang="ts">
	function shuffle(arr: any[]) {
		return arr
			.map((value: any) => ({ value, key: Math.random() }))
			.sort((a: { key: number }, b: { key: number }) => a.key - b.key)
			.map(({ value }) => value);
	}

	let questions = shuffle([
		{
			image: 'high-elf-jurum-ka.jpg',
			quote: 'The elven army should wipe Nogrod* off the face of the earth',
			info: '- Jurum Ka, high elven minister of weather manipulation. (Nogrod is a dwarvish town)',
			origin: 'The Israeli Finance Minister on an Arab village',
			origin_image: 'bezalel-smotrich.jpg',
			origin_info: `
                <p>
					Israel’s finance minister, Bezalel Smotrich, called for the destruction of Huwara, a West
					Bank Palestinian village days after
					<a href="https://en.wikipedia.org/wiki/Huwara_rampage"
						>it was attacked by a mob of settlers who torched dozens of homes and killed one
						resident</a
					>.
				</p>
				<p>
					Smotrich: “The village of Hawara needs to be wiped out. I think that the State of Israel
					needs to do that – not, God forbid, private individuals”
				</p>
                `,
			alt_answers: [
				'The leader of an Arab terror organization on an Israeli settlement',
				'A Russian general on a Ukranian city',
				'A Nazi affiliated journalist in 1930s Germany on a Jewish suburb'
			]
		}
	]);
	questions.forEach((question) => {
		question.answers = shuffle(question.alt_answers.concat([question.origin]));
		question.selected = [];
	});

	let score = 0;
	let cur_question_idx = 0;

	let total = 4;
	$: cur_question = questions[Math.min(cur_question_idx, questions.length - 1)];
	$: enabled = cur_question.selected.length > 0;
	$: skip = cur_question.selected.length == total;
	$: gain = skip ? 0 : Math.floor(10 / cur_question.selected.length);
	$: penalty = skip ? 0 : Math.floor(-10 / (total - cur_question.selected.length));

	function guess() {
		score += cur_question.selected.includes(cur_question.origin) ? gain : penalty;
		cur_question.score_after = score;
		cur_question_idx += 1;
	}
</script>

<div style="width: 800px; margin: auto">
	<h1>Soul Arithmetic</h1>
	{#each questions.slice(0, cur_question_idx + 1) as question, question_idx}
		<img src={question_idx == cur_question_idx ? question.image : question.origin_image} alt="An important elf" width="500px" />
		<h2>"{question.quote}"</h2>
		<p>{question.info}</p>
		<p>
			The above statement is based on a statement originally said by a human on other humans. Guess
			who it was:
		</p>
		{#each question.answers as answer}
			<label class:origin={question_idx < cur_question_idx && answer == question.origin}>
				<input
					type="checkbox"
					name="answers"
					value={answer}
					bind:group={question.selected}
					disabled={question_idx < cur_question_idx}
				/>
				{answer}
			</label>
		{/each}
		{#if question_idx < cur_question_idx}
			<div class="origin" style="padding:10px; background: #eee">
				{@html question.origin_info}
			</div>
			<p>Score: <b>{question.score_after}</b></p>
		{/if}
	{/each}
	{#if cur_question_idx < questions.length}
		<button disabled={!enabled} on:click={guess}>
			<p>
				{#if skip}
					Skip question
				{:else}
					Submit guess
				{/if}
				(<b>{cur_question.selected.length}</b>/<b>{total}</b> choices selected).
				{#if enabled}
					Points: <b>+{gain}</b> if correct, <b>{penalty}</b> if mistaken
				{/if}
			</p>
		</button>
	{/if}
</div>

<style>
	* {
		font-size: large;
	}
	h1 {
		font-size: 200%;
	}
	label {
		display: flex;
		border: 1px solid #888;
		border-radius: 10px;
		background: #ddd;
		margin: 5px;
	}
	.origin {
		border-radius: 10px;
		border: 2px solid black;
		background: #ccc;
	}
	input {
		height: 25px;
		width: 25px;
		background: black;
	}
	button {
		border-radius: 10px;
	}
</style>
