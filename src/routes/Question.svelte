<script lang="ts">
    import { fade } from 'svelte/transition';
    import { scrollIntoView } from '$lib/scroll';

    export var question: any;
    export let questionIdx: number;
    export let isCurrent: boolean;
    export let isLast: boolean;
</script>

<div id="question-{questionIdx}-header">
    <hr />
    <h2>Question #{questionIdx + 1}: {question.title}</h2>
    <div style="position: relative">
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
{#if !question.hideAnswer}
    {@html question.originInfo}
{:else}
    <h2>"{question.quote}"</h2>
    <p>{question.info}</p>
{/if}
{#if isCurrent}
    <p>
        The above statement is based on a statement originally said by a human on other humans.
        Guess who it was:
    </p>
{:else}
    <label style="padding: 5px">
        <input type="checkbox" bind:checked={question.hideAnswer} />
        Show question
    </label>
    <p>
        Score: <b>{question.scoreAfter}</b>.
    </p>
    {#if !isLast}
        <button on:click={() => scrollIntoView(`question-${questionIdx + 1}`)} class="next">
            Next question
        </button>
    {/if}
{/if}

<style lang="scss">
    @import './styles.scss';
    img {
        max-width: 100%;
        height: auto;
    }
    * {
        font-size: large;
    }
    .person-image {
        border-radius: 50px;
        border: 2px solid #444;
        width: 500px;
    }
</style>
