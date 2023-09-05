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
			origin: 'The Israeli finance minister on an Arab village',
			origin_image: 'bezalel-smotrich.jpg',
			origin_info: `
                <p>
					Israel’s finance minister, Bezalel Smotrich, called for the destruction of Huwara, a West
					Bank Palestinian village days after
					<a href="https://en.wikipedia.org/wiki/Huwara_rampage">
						it was attacked by a mob of settlers who torched dozens of homes and killed one
						resident</a>.
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
		},
		{
			image: 'mermen-king-arion.jpg',
			quote: 'I would prefer my daughter to die than have a relationship with a surface dweller',
			info: '- Arion, king of the merfolk. (Surface dweller is a slur for humans)',
			origin: 'The president of Brazil on homosexuality',
			origin_image: 'jair-bolsonaro.jpg',
			origin_info: `
				<p>
					Jair Bolsonaro, the president of Brazil between 2019-2022
					<a href="https://en.wikipedia.org/wiki/Jair_Bolsonaro#Views_on_homosexuality">
						has said that if he had a gay son then he would prefer for him to die in an accident</a>.
				</p>
				`,
			alt_answers: [
				'A Mormon apostle on crossbreeding with Jews',
				'The Israeli minister of transporation on mixed marriages',
				'A US senator on relationships with Republicans'
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

<a href="https://github.com/yairchu/soul-arithmetic">
	<img
		style="position: absolute; top: 0; right: 0; border: 0;"
		decoding="async"
		width="149"
		height="149"
		src="https://github.blog/wp-content/uploads/2008/12/forkme_right_green_007200.png?resize=149%2C149"
		alt="Fork me on GitHub"
		loading="lazy"
		data-recalc-dims="1"
	/>
</a>

<div style="width: 800px; margin: auto">
	<h1>Soul Arithmetic</h1>
	{#each questions.slice(0, cur_question_idx + 1) as question, question_idx}
		<img
			src={question_idx == cur_question_idx ? question.image : question.origin_image}
			alt="An important elf"
			width="500px"
		/>
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
