<script lang="ts">
    import ForkMe from './ForkMe.svelte';
    import Intro from './Intro.svelte';
    import Question from './Question.svelte';
    import ThatsAll from './ThatsAll.svelte';
    import { scrollIntoView, onScrollStop } from '$lib/scroll';

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

<div class="container mx-auto max-w-3xl p-3">
    <Intro />
    {#each questions.slice(0, curQuestionIdx + 1) as question, questionIdx}
        <Question
            bind:question
            {questionIdx}
            isCurrent={questionIdx == curQuestionIdx}
            isLast={questionIdx + 1 == questions.length}
        />
    {/each}
    {#if curQuestionIdx < questions.length}
        <p class="text-center">
            {#if enabled}
                Points: <b>+{gain}</b> if correct, <b>{penalty}</b> if mistaken
            {:else}
                (multiple choices allowed)
            {/if}
        </p>
        <button
            disabled={!enabled}
            on:click={guess}
            class="next px-4 py-1 rounded-full border mx-auto shadow-lg flex text-lg"
            id="submit"
        >
            {#if skip}
                Skip question
            {:else}
                Submit guess
            {/if}
            (<b>{curQuestion.selected.length}</b>/<b>{total}</b>&nbsp;choices selected)
        </button>
    {:else}
        <ThatsAll />
    {/if}
    <div class="h-5" />
</div>

<style lang="postcss">
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
