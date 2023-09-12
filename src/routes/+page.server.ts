import { questions_pool } from './questions';

function shuffle(arr: any[]) {
    return arr
        .map((value: any) => ({ value, key: Math.random() }))
        .sort((a: { key: number }, b: { key: number }) => a.key - b.key)
        .map(({ value }) => value);
}

export const load = async () => {
    let questions = shuffle(questions_pool);
    questions.forEach((question) => {
        question.answers = shuffle(question.alt_answers.concat([question.origin]));
        question.selected = [];
    });
    return { questions };
};
