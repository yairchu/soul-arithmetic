<script lang="ts">
    import ForkMe from './ForkMe.svelte';
    import Intro from './Intro.svelte';
    import Question from './Question.svelte';
    import ThatsAll from './ThatsAll.svelte';
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
            scrollIntoView(`question-${prev}-header`);
            onScrollStop(() => (questions[prev].hideAnswer = false));
        }, 0);
    }
</script>

<ForkMe />

<div style="margin: auto" id="content">
    <Intro />
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
        <ThatsAll/>
    {/if}
</div>

<style lang="scss">
    @import './styles.scss';
    #content {
        margin: auto;
        width: 95%;
        max-width: 800px;
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
