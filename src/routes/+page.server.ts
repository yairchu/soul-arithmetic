import { questionsPool } from './questions';

function shuffle(arr: any[]) {
    return arr
        .map((value: any) => ({ value, key: Math.random() }))
        .sort((a: { key: number }, b: { key: number }) => a.key - b.key)
        .map(({ value }) => value);
}

export const load = async () => {
    const questions = shuffle(questionsPool);
    questions.forEach((question) => {
        question.answers = shuffle(question.altAnswers.concat([question.origin]));
        question.selected = [];
        question.hideAnswer = true;
    });
    return { questions };
};
