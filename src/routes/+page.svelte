<script lang="ts">
    import Question from './Question.svelte';
    import { scrollIntoView } from './utils';

    export let data;

    let { questions } = data;
    let score = 0;
    let curQuestionIdx = 0;

    $: curQuestion = questions[Math.min(curQuestionIdx, questions.length - 1)];
    $: total = curQuestion.answers.length;
    $: enabled = curQuestion.selected.length > 0;
    $: skip = curQuestion.selected.length == total;
    $: gain = skip ? 0 : Math.floor(10 / curQuestion.selected.length);
    $: penalty = skip ? 0 : Math.floor(-10 / (total - curQuestion.selected.length));

    function onScrollStop(action: () => void) {
        var lastPos: number | null = null;
        function checkPos() {
            let pos = window.scrollY;
            console.log(lastPos);
            if (pos == lastPos) {
                action();
            } else {
                lastPos = pos;
                requestAnimationFrame(checkPos);
            }
        }
        requestAnimationFrame(checkPos);
    }

    function guess() {
        score += curQuestion.selected.includes(curQuestion.origin) ? gain : penalty;
        curQuestion.scoreAfter = score;
        let prev = curQuestionIdx;
        curQuestionIdx += 1;
        // After the document updates, animate scrolling so that the button to go to next question is visible
        setTimeout(() => {
            scrollIntoView(`question-${prev}`);
            onScrollStop(() => (questions[prev].hideAnswer = false));
        }, 0);
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
    {#each questions.slice(0, curQuestionIdx + 1) as question, questionIdx}
        <div id="question-{questionIdx}">
            <Question
                {question}
                {questionIdx}
                isCurrent={questionIdx == curQuestionIdx}
                isLast={questionIdx + 1 == questions.length}
            />
            <div class="answers">
                {#each question.answers as answer}
                    <label class:origin={questionIdx < curQuestionIdx && answer == question.origin}>
                        <input
                            type="checkbox"
                            name="answers"
                            value={answer}
                            bind:group={question.selected}
                            disabled={questionIdx < curQuestionIdx}
                            on:click={() => scrollIntoView(`submit`)}
                        />
                        {answer}
                    </label>
                {/each}
            </div>
            <hr id="after-question-{questionIdx}" />
        </div>
    {/each}
    {#if curQuestionIdx < questions.length}
        {#if enabled}
            Points: <b>+{gain}</b> if correct, <b>{penalty}</b> if mistaken
        {:else}
            (multiple choices allowed)
        {/if}
        <button disabled={!enabled} on:click={guess} class="next" id="submit">
            {#if skip}
                Skip question
            {:else}
                Submit guess
            {/if}
            (<b>{curQuestion.selected.length}</b>/<b>{total}</b> choices selected).
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

<style lang="scss">
    @import './styles.scss';
    #content {
        margin: auto;
        width: 95%;
        max-width: 800px;
    }
    h1 {
        font-size: 200%;
    }
    .answers label {
        display: flex;
    }
    .answers input {
        height: 25px;
        width: 25px;
        background: black;
    }
    .origin {
        border-radius: 10px;
        border: 2px solid black;
        background: #ccc;
    }
</style>
