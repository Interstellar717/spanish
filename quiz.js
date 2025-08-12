//// normal quiz, doesn't let you gues more than once


var streak = 0;
var hints = true; /// Specifically, when it tells you if you typed in something that's correct in another tense and what that tense is

const qs = q => { return document.querySelector(q) }
const qsa = q => { return document.querySelectorAll(q) }

!localStorage.maxStreakConj && sessionStorage.setItem("maxStreakConj", 0);
!localStorage.maxStreakRevConj && sessionStorage.setItem("maxStreakRevConj", 0);
!localStorage.maxStreakTran && sessionStorage.setItem("maxStreakTran", 0);
!localStorage.maxStreakRevTran && sessionStorage.setItem("maxStreakRevTran", 0);
sessionStorage.setItem("guesses", 0);
sessionStorage.setItem("answer", "");


function updateNumbers() {
    qs(".quiz-container #guesses").textContent = sessionStorage.getItem("guesses") + " guesses";
    qs(".quiz-container #streak").textContent = streak + " streak";
}

function hideDropdowns() {
    qs(".dropdown-container").style.display = "none";
    qs(".quiz-container").style.display = "";
    qs("body").style.overflow = "hidden";
}

function resetFields() {

    qs(".quiz-container #answer-text").placeholder = "Enter your answer";
    qs("#status").textContent = "";
    qs("#answer-text").value = "";
    qs("#answer-text").select();

    qs("#answer-tense").selectedIndex = 0;
    qs("#answer-person").selectedIndex = 0;
}

function removeAllListeners() {
    qs("#answer-text").removeEventListener("keypress", newConjugationQuestion);
    qs("#answer-text").removeEventListener("keypress", checkConjugationAnswer);
    qs("#answer-submit").removeEventListener("click", newReverseConjugationQuestion);
    qs("#answer-submit").removeEventListener("click", checkReverseConjugationAnswer);
    // qs("#answer-text").removeEventListener("keypress", newTranslationQuestion);
    // qs("#answer-text").removeEventListener("keypress", checkTranslationAnswer);
    // qs("#answer-text").removeEventListener("keypress", newReverseTranslationQuestion);
    // qs("#answer-text").removeEventListener("keypress", checkReverseTranslationAnswer);
}


function startQuiz(func) {
    hideDropdowns();
    resetFields();
    func();
}

function randomConjugation() {
    const verb = arrayRandom(verbs.verbs);
    const infinitive = verb.infinitive;
    const tense = arrayRandom(["Present", "Past Preterite", "Past Imperfect", "Future", "Subjunctive", "Imperative"]);
    const person = arrayRandom(tense == "Imperative" ? personsImperative : persons);
    const personLegible = tense == "Imperative" ? personsInSpanish[person].replace("Él/Ella", "Usted").replace("Ellos/Ellas", "Ustedes") : personsInSpanish[person];

    var a = verb;
    for (let i of tense.split(" ")) {
        a = a[i.toLowerCase()];
    }
    const conjugation = a[person];

    return { verb, infinitive, tense, person, personLegible, conjugation };
}

function newConjugationQuestion(e) {

    removeAllListeners();
    resetFields();

    qs("#answer-text").style.display = "block";
    qs("#answer-tense").style.display = "none";
    qs("#answer-person").style.display = "none";
    qs("#answer-submit").style.display = "none";


    const { verb, infinitive, tense, person, personLegible, conjugation } = randomConjugation();


    qs(".quiz-container #question").innerHTML = `${capitalize(infinitive)} <br><br>${personLegible} ${tense} Tense ${irregular.includes(`${infinitive}.${tense.toLowerCase().replaceAll(" ", ".")}.${person}`) ? "<br><h5 style='position:absolute;'>(this form is irregular)</h5>" : ""}`;
    sessionStorage.setItem("answer", conjugation);
    sessionStorage.setItem("guesses", 0);
    updateNumbers();
    qs(".quiz-container #answer-text").addEventListener("keypress", checkConjugationAnswer);
}

function checkConjugationAnswer(e) {
    if (e.key == "Enter") {
        if (!e.target.value) return;

        qs(".quiz-container #status").style.transform = "";

        if (e.target.value.toLowerCase() == sessionStorage.getItem("answer")) {
            removeAllListeners();

            qs(".quiz-container #status").textContent = "Correct! It is " + sessionStorage.getItem("answer") + "!";
            streak++;
            if (parseInt(sessionStorage.getItem("maxStreak")) < streak) {
                sessionStorage.setItem("maxStreakConj", streak);
            }
            updateNumbers();
            e.target.addEventListener("keypress", newConjugationQuestion);
            qs(".quiz-container #answer-text").placeholder = "Press enter for next";
            qs(".quiz-container #answer-text").value = "";
            return;

        } else if (e.target.value.toLowerCase() == removeAccents(sessionStorage.getItem("answer"))) {
            qs(".quiz-container #status").textContent = "Remember the accents!!!";
            if (sessionStorage.getItem("guesses") == "3") {
                sessionStorage.setItem("guesses", "2");
            }
        } else if (removeAccents(e.target.value.toLowerCase()) == sessionStorage.getItem("answer")) {
            qs(".quiz-container #status").textContent = "You added unneccessary accents!!!";
            if (sessionStorage.getItem("guesses") == "3") {
                sessionStorage.setItem("guesses", "2");
            }
        } else if (removeAccents(e.target.value.toLowerCase()) == removeAccents(sessionStorage.getItem("answer"))) {
            qs(".quiz-container #status").textContent = "Check the accents!!!";
            if (sessionStorage.getItem("guesses") == "3") {
                sessionStorage.setItem("guesses", "2");
            }
        } else {
            removeAllListeners();

            var matches = [];

            if (hints) {
                for (let verb of verbs.verbs) {
                    for (let tense of Object.keys(verb)) {
                        for (let person of Object.keys(verb[tense])) {
                            if (verb[tense][person] == e.target.value.toLowerCase()) {

                                person = personsInSpanish[person];
                                if (tense == "imperative") {
                                    person = person.replace("Él/Ella", "Usted").replace("Ellos/Ellas", "Ustedes");
                                }
                                matches.push({
                                    person: person,
                                    tense: tense,
                                    verb: verb.infinitive
                                });
                            }
                        }
                    }
                }
            }

            qs(".quiz-container #status").innerHTML = "Nope!";

            if (matches.length) {
                for (let match of matches) {
                    qs(".quiz-container #status").innerHTML += `<br> That's the ${match.person} ${match.tense} tense of ${match.verb}`;

                    var y = parseInt(qs(".quiz-container #status").style.transform.split("(")[1]?.split("vh)")[0]);
                    if (y) {
                        y -= 2.25;
                    } else y = 9.75;

                    qs(".quiz-container #status").style.transform = "translateY(" + y + "vh)";
                }
            }
        }

        sessionStorage.setItem("guesses", parseInt(sessionStorage.getItem("guesses")) + 1);
        updateNumbers();
        if (sessionStorage.getItem("guesses") >= 3) {
            sessionStorage.setItem("guesses", 0);
            streak = 0;
            updateNumbers();
            qs(".quiz-container #status").textContent = "The answer was " + sessionStorage.getItem("answer");
            e.target.addEventListener("keypress", newConjugationQuestion);
            return;
        }
    }

}



function newReverseConjugationQuestion(e) {
    removeAllListeners();
    resetFields();
    qs("#answer-submit").textContent = "Submit";


    qs("#answer-text").style.display = "none";
    qs("#answer-tense").style.display = "inline-block";
    qs("#answer-person").style.display = "inline-block";
    qs("#answer-submit").style.display = "block";
    qs("#status").style.transform = "translateY(5.5vh)";

    const { verb, infinitive, tense, person, personLegible, conjugation } = randomConjugation();

    qs(".quiz-container #question").innerHTML = `${conjugation}`;

    sessionStorage.setItem("answer", `${infinitive}.${tense.toLowerCase().replaceAll(" ", ".")}.${person}`);
    sessionStorage.setItem("guesses", 0);
    updateNumbers();
    qs(".quiz-container #answer-submit").addEventListener("click", checkReverseConjugationAnswer);


}

function checkReverseConjugationAnswer(e) {

    const tense = qs("#answer-tense").querySelectorAll("option")[qs("#answer-tense").selectedIndex].value;
    const tenseLegible = qs("#answer-tense").querySelectorAll("option")[qs("#answer-tense").selectedIndex].textContent;
    const person = qs("#answer-person").querySelectorAll("option")[qs("#answer-person").selectedIndex].value;
    const personLegible = qs("#answer-person").querySelectorAll("option")[qs("#answer-person").selectedIndex].textContent;
    const infinitive = sessionStorage.getItem("answer").split(".")[0];

    if (!(tense && tenseLegible && person && personLegible && infinitive)) return;


    if (`${infinitive}.${tense.toLowerCase().replaceAll(" ", ".")}.${person}` == sessionStorage.getItem("answer")) {
        removeAllListeners();
        qs(".quiz-container #status").textContent = `Correct!`;
        streak++;
        if (parseInt(sessionStorage.getItem("maxStreak")) < streak) {
            sessionStorage.setItem("maxStreakRevConj", streak);
        }

        qs("#answer-submit").addEventListener("click", newReverseConjugationQuestion);
        qs("#answer-submit").textContent = "Next";

        /// It is the ${tenseLegible} ${personLegible} form of ${infinitive}!
    } else {

        /* var matches = [];

        for (let verb of verbs.verbs) {
            for (let tense of Object.keys(verb)) {
                for (let person of Object.keys(verb[tense])) {
                    let storageTense = sessionStorage.getItem("answer").split(".")[1];
                    let storagePerson = sessionStorage.getItem("answer").split(".")[2];

                    if (verb.infinitive = infinitive && verb[tense][person] == verb[storageTense][storagePerson]) {
                        if (`${verb.infinitive}.${tense.toLowerCase().replaceAll(" ", ".")}.${person}` == `${infinitive}.${tense.toLowerCase().replaceAll(" ", ".")}.${person}`) {

                            person = personsInSpanish[person];
                            if (tense == "imperative") {
                                person = person.replace("Él/Ella", "Usted").replace("Ellos/Ellas", "Ustedes");
                            }
                            matches.push({
                                person: person,
                                tense: tense,
                                verb: verb.infinitive
                            });
                        }
                    }
                }
            }
        }

        if (matches.length > 1) {
            qs(".quiz-container #status").textContent = `Correct! It's also the ${tenseLegible} ${personLegible} form of ${infinitive}!`;

            return;
        } */

        qs(".quiz-container #status").textContent = `Nope!`;

    }

    sessionStorage.setItem("guesses", parseInt(sessionStorage.getItem("guesses")) + 1);
    updateNumbers();


    if (sessionStorage.getItem("guesses") >= 3) {
        removeAllListeners();
        qs("#answer-submit").addEventListener("click", newReverseConjugationQuestion);
        qs("#answer-submit").textContent = "Next";
        sessionStorage.setItem("guesses", 0);
        streak = 0;
        updateNumbers();

        var correctTense = sessionStorage.getItem("answer").split(".")[1]; // handling for incorrect splitting because of past.preterite and past.imperfect
        var correctPerson = sessionStorage.getItem("answer").split(".")[2];
        if (correctTense == "past") {
            correctTense = sessionStorage.getItem("answer").split(".")[1] + " " + sessionStorage.getItem("answer").split(".")[2];
            correctPerson = sessionStorage.getItem("answer").split(".")[3];
        }

        qs(".quiz-container #status").textContent = `It was the ${correctTense} ${personsInSpanish[correctPerson]} form of ${infinitive}`;

    }
}