<script lang="ts">
    import { fade } from 'svelte/transition';

    export let data;

    let { questions } = data;
    let score = 0;
    let cur_question_idx = 0;

    $: cur_question = questions[Math.min(cur_question_idx, questions.length - 1)];
    $: total = cur_question.answers.length;
    $: enabled = cur_question.selected.length > 0;
    $: skip = cur_question.selected.length == total;
    $: gain = skip ? 0 : Math.floor(10 / cur_question.selected.length);
    $: penalty = skip ? 0 : Math.floor(-10 / (total - cur_question.selected.length));

    function guess() {
        score += cur_question.selected.includes(cur_question.origin) ? gain : penalty;
        cur_question.score_after = score;
        let prev = cur_question_idx;
        cur_question_idx += 1;
        // After the document updates, animate scrolling so that the button to go to next question is visible
        setTimeout(() => scrollIntoView(`question-${prev}`, 'nearest'), 0);
    }

    function scrollIntoView(id: string, block: ScrollLogicalPosition = 'start') {
        let elem = document.getElementById(id);
        if (!elem) return;
        elem.scrollIntoView({ behavior: 'smooth', block });
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

<div style="margin: auto" id="content">
    <h1>Soul Arithmetic</h1>
    <p>
        This educational quiz-game is meant to confront societal tolerance towards racism, misoginy,
        homophobia, and other forms of intolerance.
    </p>
    <p>
        It consists of imaginary offensive quotes which are based on actual quotes said by actual
        people of importance and positions of power in our society.
    </p>
    <p>If that's fine by you, then here we go:</p>
    <hr />
    {#each questions.slice(0, cur_question_idx + 1) as question, question_idx}
        <div id="question-{question_idx}">
            <h2>Question #{cur_question_idx + 1}: {question.title}</h2>
            <div style="position: relative">
                <img
                    src={question_idx >= cur_question_idx - 1
                        ? question.image
                        : question.origin_image}
                    alt={question.info}
                    class="person-image"
                />
                {#if question_idx == cur_question_idx - 1 && !question.hideAnswer}
                    <img
                        src={question.origin_image}
                        alt={question.origin}
                        class="person-image"
                        style="position: absolute; left: 0"
                        transition:fade
                    />
                {/if}
            </div>
            {#if question_idx < cur_question_idx && !question.hideAnswer}
                {@html question.origin_info}
            {:else}
                <h2>"{question.quote}"</h2>
                <p>{question.info}</p>
            {/if}
            {#if question_idx < cur_question_idx}
                <label style="padding: 5px" transition:fade>
                    <input type="checkbox" bind:checked={question.hideAnswer} />
                    Show question
                </label>
                <p>
                    Score: <b>{question.score_after}</b>.
                </p>
                {#if question_idx < questions.length - 1}
                    <button
                        on:click={() => scrollIntoView(`question-${question_idx + 1}`)}
                        class="next"
                    >
                        Next question
                    </button>
                {/if}
            {:else}
                <p>
                    The above statement is based on a statement originally said by a human on other
                    humans. Guess who it was:
                </p>
            {/if}
            <div class="answers">
                {#each question.answers as answer}
                    <label
                        class:origin={question_idx < cur_question_idx && answer == question.origin}
                    >
                        <input
                            type="checkbox"
                            name="answers"
                            value={answer}
                            bind:group={question.selected}
                            disabled={question_idx < cur_question_idx}
                            on:click={() => scrollIntoView(`submit`)}
                        />
                        {answer}
                    </label>
                {/each}
            </div>
            <hr id="after-question-{question_idx}" />
        </div>
    {/each}
    {#if cur_question_idx < questions.length}
        <button disabled={!enabled} on:click={guess} class="next" id="submit">
            {#if skip}
                Skip question
            {:else}
                Submit guess
            {/if}
            (<b>{cur_question.selected.length}</b>/<b>{total}</b> choices selected).
            {#if enabled}
                Points: <b>+{gain}</b> if correct, <b>{penalty}</b> if mistaken
            {/if}
        </button>
    {:else}
        <p>
            This is all I have for now, this game is in very early alpha stages. I'm not a web or
            game developer, nor UX designer or graphics artist. If you would like to help make it,
            your help is very wanted and appreciated! Development is done over at <a
                href="https://github.com/yairchu/soul-arithmetic">GitHub</a
            >. Cheers! - Yair
        </p>
    {/if}
</div>

<style>
    .next {
        /* Look like a big button */
        display: block;
        margin: auto;
        width: 99%;
        height: 50px;
        font-size: 110%;
        border: 2px solid #888;
        border-radius: 10px;
        margin: 5px;
    }
    .next:disabled {
        background: #e65;
    }
    .next:not(:disabled) {
        background: #6e5;
    }
    #content {
        margin: auto;
        width: 80%;
        max-width: 800px;
    }
    img {
        max-width: 100%;
        height: auto;
    }
    * {
        font-size: large;
    }
    h1 {
        font-size: 200%;
    }
    label {
        border: 1px solid #888;
        border-radius: 10px;
        background: #ddd;
        margin: 5px;
    }
    .answers label {
        display: flex;
    }
    .origin {
        border-radius: 10px;
        border: 2px solid black;
        background: #ccc;
    }
    .answers input {
        height: 25px;
        width: 25px;
        background: black;
    }
    button {
        border-radius: 10px;
    }
    .person-image {
        border-radius: 50px;
        border: 2px solid #444;
        width: 500px;
    }
</style>
