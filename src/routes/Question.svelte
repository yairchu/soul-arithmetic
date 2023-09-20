<script lang="ts">
    import { fade } from 'svelte/transition';
    import { scrollIntoView } from '$lib/scroll';

    export var question: any;
    export let questionIdx: number;
    export let isCurrent: boolean;
    export let isLast: boolean;
</script>

<div id="question-{questionIdx}">
    <div id="question-{questionIdx}-header">
        <hr />
        <h2 class="font-bold text-xl my-4 mx-3">Question #{questionIdx + 1}: {question.title}</h2>
        <div style="position: relative" class="m-5">
            <img src={question.image} alt={question.info} class="person-image" />
            {#if !question.hideAnswer}
                <img
                    src={question.originImage}
                    alt={question.origin}
                    class="person-image"
                    style="position: absolute; top: 0; left: 0"
                    transition:fade={{ duration: 1000 }}
                />
            {/if}
        </div>
    </div>
    {#if !isCurrent}
        <div class="my-3 mx-1">
            <label class="text-s">
                <input type="checkbox" bind:checked={question.hideAnswer} />
                Show question
            </label>
        </div>
    {/if}
    {#if question.hideAnswer}
        <p class="font-bold text-xl">"{question.quote}"</p>
        <p class="text-lg">{question.info}</p>
    {:else}
        <div class="text-lg">
            {@html question.originInfo}
        </div>
    {/if}
    {#if isCurrent}
        <p>
            The above statement is based on a statement originally said by a human on other humans.
        </p>
        <p>Guess who it was:</p>
    {:else}
        <p class="text-lg my-1">
            Score: <b>{question.scoreAfter}</b>.
        </p>
        {#if !isLast}
            <button
                on:click={() => scrollIntoView(`question-${questionIdx + 1}`)}
                class="next px-4 py-1 rounded-full border shadow flex my-2"
            >
                Next question
            </button>
        {/if}
    {/if}

    <div class="answers">
        {#each question.answers as answer}
            <label
                class="px-4 py-1 rounded-xl border border-black flex bg-slate-200 m-1"
                class:origin={!isCurrent && answer == question.origin}
            >
                <input
                    type="checkbox"
                    name="answers"
                    value={answer}
                    bind:group={question.selected}
                    disabled={!isCurrent}
                    on:click={() => scrollIntoView(`submit`)}
                />
                {answer}
            </label>
        {/each}
    </div>
</div>

<style lang="postcss">
    .person-image {
        border-radius: 50px;
        border: 2px solid #444;
        width: 500px;
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
