<script lang="ts">
    function shuffle(arr: any[]) {
        return arr
            .map((value: any) => ({ value, key: Math.random() }))
            .sort((a: { key: number }, b: { key: number }) => a.key - b.key)
            .map(({ value }) => value);
    }

    let questions = shuffle([
        {
            title: 'Elves and Dwarves',
            image: 'high-elf-jurum-ka.jpg',
            quote: 'The elven army should wipe Nogrod* off the face of middle-earth',
            info: '- Jurum Ka, high elven minister of weather manipulation. (Nogrod is a dwarvish town)',
            origin: 'The Israeli finance minister on an Arab village',
            origin_image: 'bezalel-smotrich.jpg',
            origin_info: /*html*/ `
                <p>
                    Israel's finance minister, Bezalel Smotrich, called for the destruction of Huwara, a West
                    Bank Palestinian village days after
                    <a href="https://en.wikipedia.org/wiki/Huwara_rampage">
                        it was attacked by a mob of settlers who torched dozens of homes and killed one
                        resident</a>.
                </p>
                <p>
                    Smotrich: “The village of Hawara needs to be wiped out. I think that the State of Israel
                    needs to do that - not, God forbid, private individuals”
                </p>
                `,
            alt_answers: [
                'The leader of an Arab terror organization on an Israeli settlement',
                'A Russian general on a Ukranian city',
                'A Nazi affiliated journalist in 1930s Germany on a Jewish suburb'
            ]
        },
        {
            title: 'Merfolk and humans',
            image: 'mermen-king-arion.jpg',
            quote: 'I would prefer my daughter to die than have a relationship with a surface dweller',
            info: '- Arion, king of the merfolk. ("Surface dweller" is a slur for humans)',
            origin: 'The president of Brazil on homosexuality',
            origin_image: 'jair-bolsonaro.jpg',
            origin_info: /*html*/ `
                <p>
                    Jair Bolsonaro, the president of Brazil between 2019-2022
                    <a href="https://en.wikipedia.org/wiki/Jair_Bolsonaro#Views_on_homosexuality">
                        has said that if he had a gay son then he would prefer for him to die in an accident</a>.
                </p>
                `,
            alt_answers: [
                'A Mormon apostle on crossbreeding with Jews',
                'The Israeli minister of transportation on mixed marriages',
                'A US senator on relationships with Republicans'
            ]
        },
        {
            title: 'Magicians and muggles',
            image: 'magic-councilour-sir-bauldinium.jpg',
            quote: 'Magicians and muggles should not mix, it only leads to tension and violence',
            info: '- Sir Bauldinium, member of the magic council (muggles are non-magical humans)',
            origin: 'The prime minister of South Africa during Apartheid',
            origin_image: 'hendrik-verwoerd.jpg',
            origin_info: /*html*/ `
                <p>
                    Hendrik Verwoerd, the founding prime minister of Apartheid South Africa,
                    <a href="https://en.wikiquote.org/wiki/Hendrik_Verwoerd">has said</a>:
                </p>
                <p>
                    "There will be competition and conflict everywhere.
                    So long as the points of contact are still comparatively few, as is the case now,
                    friction and conflict will be few and less evident.
                    The more this intermixing develops, however, the stronger the conflict will become."
                </p>
                `,
            alt_answers: [
                'The prime minister of Japan on Koreans',
                'The chief Rabbi of Israel on mixed marriages',
                'The president of the US on Mexicans'
            ]
        },
        {
            title: 'Cyborgs and humans',
            image: 'professor-zoltar.jpg',
            quote: 'Bios should not be accepted into universities, they are too stupid to learn',
            info: '- Professor Zoltar, head of the first Mars university (bios are non-cyborg humans)',
            origin: 'The Israeli chief Rabbi on women studying Torah',
            origin_image: 'ovadia-yosef.jpg',
            origin_info: /*html*/ `
                <p>
                    Rabbi Ovadia Yosef
                    <a href="https://www.jpost.com/jewish-world/jewish-news/rabbi-ovadia-women-should-stick-to-cooking-sewing">
                        has said</a>
                    that women should not engage in religious studies because they are stupid.
                </p>
                `,
            alt_answers: [
                'The president of the US in the beginning of the 19th century on people of color',
                'The president of Oxford university on women studying engineering',
                'The leader of ISIS on women participating in paramilitary organizations'
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
        let prev = cur_question_idx;
        cur_question_idx += 1;
        // After the document updates, animate scrolling so that the button to go to next question is visible
        setTimeout(() => scrollIntoView(`after-question-${prev}`, 'nearest'), 0);
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
        It consists of imaginary offensive quotes which are based on actual quotes said by actual people
        of importance and positions of power in our society.
    </p>
    <p>If that's fine by you, then here we go:</p>
    <hr />
    {#each questions.slice(0, cur_question_idx + 1) as question, question_idx}
        <div id="question-{question_idx}">
            <h2>Question #{cur_question_idx + 1}: {question.title}</h2>
            <img
                src={question_idx == cur_question_idx ? question.image : question.origin_image}
                alt="An important elf"
                width="500px"
            />
            <h2>"{question.quote}"</h2>
            <p>{question.info}</p>
            <p>
                The above statement is based on a statement originally said by a human on other humans.
                Guess who it was:
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
                {#if question_idx < questions.length - 1}
                    <button on:click={() => scrollIntoView(`question-${question_idx + 1}`)}>
                        Next question
                    </button>
                {/if}
                <hr id="after-question-{question_idx}" />
            {/if}
        </div>
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
    {:else}
        <p>
            This is all I have for now, this game is in very early alpha stages. I'm not a web or game
            developer, nor UX designer or graphics artist. If you would like to help make it, your help is
            very wanted and appreciated! Development is done over at <a
                href="https://github.com/yairchu/soul-arithmetic">GitHub</a
            >. Cheers! - Yair
        </p>
    {/if}
</div>

<style>
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
