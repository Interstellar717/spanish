var verbs;

const irregular = [];

const vowels = "aeiou".split("");

const persons = ["1s", "2s", "3s", "1p", "2p", "3p"];
const personsImperative = ["2s", "3s", "1p", "2p", "3p"];
const personsInEnglishFancy = {
    "1s": "1st Person Singular",
    "2s": "2nd Person Singular",
    "3s": "3rd Person Singular",
    "1p": "1st Person Plural",
    "2p": "2nd Person Plural",
    "3p": "3rd Person Plural"
}
const personsInEnglish = {
    "1s": "I",
    "2s": "You",
    "3s": "He/She/It",
    "1p": "We",
    "2p": "Y'all",
    "3p": "They"
}
const personsInSpanish = {
    "1s": "Yo",
    "2s": "Tú",
    "3s": "Él/Ella",
    "1p": "Nosotros",
    "2p": "Vosotros",
    "3p": "Ellos/Ellas"
}

const endings = {

    ////////// ER, AR, IR
    present: {
        "1s": ["o", "o", "o"],
        "2s": ["es", "as", "es"],
        "3s": ["e", "a", "e"],
        "1p": ["emos", "amos", "imos"],
        "2p": ["éis", "áis", "ís"],
        "3p": ["en", "an", "en"]
    },
    future: {
        "1s": "é",
        "2s": "ás",
        "3s": "á",
        "1p": "emos",
        "2p": "éis",
        "3p": "án"
    },
    past: {
        preterite: {
            "1s": ["í", "é"],
            "2s": ["iste", "aste"],
            "3s": ["ió", "ó"],
            "1p": ["imos", "amos"],
            "2p": ["isteis", "asteis"],
            "3p": ["ieron", "aron"]
        },
        imperfect: {
            "1s": ["ía", "aba"],
            "2s": ["ías", "abas"],
            "3s": ["ía", "aba"],
            "1p": ["íamos", "ábamos"],
            "2p": ["íais", "abais"],
            "3p": ["ían", "aban"]
        }
    },
    subjunctive: {
        present: {
            "1s": ["a", "e"],
            "2s": ["as", "es"],
            "3s": ["a", "e"],
            "1p": ["amos", "emos"],
            "2p": ["áis", "éis"],
            "3p": ["an", "en"]
        },
        past: {
            "1s": "ra",
            "2s": "ras",
            "3s": "ra",
            "1p": "ramos",
            "2p": "rais",
            "3p": "ran"
        }
    },
    conditional: {
        "1s": "ía",
        "2s": "ías",
        "3s": "ía",
        "1p": "íamos",
        "2p": "íais",
        "3p": "ían"
    },
    participle: {
        past: {
            "1s": ["ido", "ado"],
            "2s": ["ido", "ado"],
            "3s": ["ido", "ado"],
            "1p": ["ido", "ado"],
            "2p": ["ido", "ado"],
            "3p": ["ido", "ado"]
        },
        present: {
            "1s": ["iendo", "ando"],
            "2s": ["iendo", "ando"],
            "3s": ["iendo", "ando"],
            "1p": ["iendo", "ando"],
            "2p": ["iendo", "ando"],
            "3p": ["iendo", "ando"]
        }
    }
}

async function getJSON(path) {
    var s = await fetch(path),
        r = await s.json();
    return (r)
}

getJSON("spanish_verbs.json").then(data => verbs = data).then(() => {

    console.log(fillInData(verbs));
    verbDropdowns();
});

function conjugateVerb(verb) {

    let infinitive = verb.infinitive;


    var haber;

    if (!haber) {
        haber = {
            "present": {
                "1s": "he",
                "2s": "has",
                "3s": "ha",
                "1p": "hemos",
                "2p": "habéis",
                "3p": "han"
            },
            "future": {
                "1s": "habré",
                "2s": "habrás",
                "3s": "habrá",
                "1p": "habremos",
                "2p": "habréis",
                "3p": "habrán"
            },
            "conditional": {
                "1s": "habría",
                "2s": "habrías",
                "3s": "habría",
                "1p": "habríamos",
                "2p": "habríais",
                "3p": "habrían"
            },
            "past": {
                "preterite": {
                    "1s": "hubo",
                    "2s": "hubiste",
                    "3s": "hube",
                    "1p": "hubemos",
                    "2p": "hubéis",
                    "3p": "huben"
                },
                "imperfect": {
                    "1s": "había",
                    "2s": "habías",
                    "3s": "había",
                    "1p": "habíamos",
                    "2p": "habíais",
                    "3p": "habían"
                }
            },
            "subjunctive": {
                "present": {
                    "1s": "haya",
                    "2s": "hayas",
                    "3s": "haya",
                    "1p": "hayamos",
                    "2p": "hayáis",
                    "3p": "hayan"
                },
                "past": {
                    "1s": "hubiera",
                    "2s": "hubieras",
                    "3s": "hubiera",
                    "1p": "hubiéramos",
                    "2p": "hubierais",
                    "3p": "hubieran"
                }
            }
        }
    }


    for (let person of persons) {

        var conj;

        /// PRESENT
        if (!verb.present) verb.present = {};

        conj = verb.present[person];

        if (!conj) {

            var stem = verb.present.stem || infinitive.substring(0, infinitive.length - 2);
            var end = infinitive.substring(infinitive.length - 2, infinitive.length);

            var index = { "e": 0, "a": 1, "i": 2 }[end[0]];

            if (vowels.includes(stem[stem.length - 1]) && endings.present[person][index][0] == "i") {
                stem += accentIndex(endings.present[person][index], 0);
            } else {
                stem += endings.present[person][index];
            }

            verb.present[person] = stem;
        } else {
            verb.present.irregular = true;
            irregular.push(`${verb.infinitive}.present.${person}`);
        }
        if (verb.present.stem) {
            verb.present.irregular = true;
            irregular.push(`${verb.infinitive}.present.${person}`);
        }



        /// FUTURE
        if (!verb.future) verb.future = {};

        conj = verb.future[person];

        if (!conj) {
            var stem = verb.future.stem || infinitive;
            verb.future[person] = stem + endings.future[person];
        } else {
            verb.future.irregular = true;
            irregular.push(`${verb.infinitive}.future.${person}`);
        }
        if (verb.future.stem) {
            verb.future.irregular = true;
            irregular.push(`${verb.infinitive}.future.${person}`);
        }


        /// PAST PRETERITE
        if (!verb.past) verb.past = {};
        if (!verb.past.preterite) verb.past.preterite = {};

        conj = verb.past.preterite[person];

        if (!conj) {
            var stem = verb.past.preterite.stem || infinitive.substring(0, infinitive.length - 2);
            var end = infinitive.substring(infinitive.length - 2, infinitive.length);

            var index = end[0] == "a" ? 1 : 0;

            if (vowels.includes(stem[stem.length - 1]) && endings.past.preterite[person][index][0] == "i") {
                stem += accentIndex(endings.past.preterite[person][index], 0);
            } else {
                stem += endings.past.preterite[person][index];
            }

            verb.past.preterite[person] = stem;

        } else {
            verb.past.preterite.irregular = true;
            irregular.push(`${verb.infinitive}.past.preterite.${person}`);
        }
        if (verb.past.preterite.stem) {
            verb.past.preterite.irregular = true;
            irregular.push(`${verb.infinitive}.past.preterite.${person}`);
        }

        /// PAST IMPERFECT
        if (!verb.past) verb.past = {};
        if (!verb.past.imperfect) verb.past.imperfect = {};

        conj = verb.past.imperfect[person];

        if (!conj) {
            var stem = verb.past.imperfect.stem || infinitive.substring(0, infinitive.length - 2);
            var end = infinitive.substring(infinitive.length - 2, infinitive.length);

            var index = end[0] == "a" ? 1 : 0;

            stem += endings.past.imperfect[person][index];

            verb.past.imperfect[person] = stem;
        } else {
            verb.past.imperfect.irregular = true;
            irregular.push(`${verb.infinitive}.past.imperfect.${person}`);
        }
        if (verb.past.imperfect.stem) {
            verb.past.imperfect.irregular = true;
            irregular.push(`${verb.infinitive}.past.imperfect.${person}`);
        }




        /// SUBJUNCTIVE
        if (!verb.subjunctive) verb.subjunctive = {};
        if (!verb.subjunctive.present) verb.subjunctive.present = {};
        if (!verb.subjunctive.present_perfect) verb.subjunctive.present_perfect = {};
        if (!verb.subjunctive.past) verb.subjunctive.past = {};
        if (!verb.subjunctive.past_perfect) verb.subjunctive.past_perfect = {};

        /// SUBJUNCTIVE PRESENT
        conj = verb.subjunctive.present[person];

        if (!conj) {
            var stem = verb.subjunctive.present.stem || verb.present["1s"].substring(0, verb.present["1s"].length - 1),
                end = infinitive.substring(infinitive.length - 2, infinitive.length),
                index = end[0] == "a" ? 1 : 0;

            verb.subjunctive.present[person] = stem + endings.subjunctive.present[person][index];
        } else {
            verb.subjunctive.present.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }
        if (verb.subjunctive.present.stem) {
            verb.subjunctive.present.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }

        /// PARTICIPLES
        if (!verb.participle) verb.participle = {}
        var stem = verb.infinitive.substring(0, verb.infinitive.length - 2),
            end = infinitive.substring(infinitive.length - 2, infinitive.length),
            index = end[0] == "a" ? 1 : 0;
        if (!verb.participle.past) {
            if (vowels.includes(stem[stem.length - 1]) && endings.participle.past[person][index][0] == "i") {
                stem += accentIndex(endings.participle.past[person][index], 0);
            } else {
                stem += endings.participle.past[person][index];
            }
            verb.participle.past = stem;
        }
        stem = verb.infinitive.substring(0, verb.infinitive.length - 2); // reset stem;
        if (!verb.participle.present) {
            if (vowels.includes(stem[stem.length - 1]) && endings.participle.present[person][index][0] == "i") {
                stem += accentIndex(endings.participle.present[person][index], 0);
            } else {
                stem += endings.participle.present[person][index];
            }
            verb.participle.present = stem;
        }


        /// SUBJUNCTIVE PRESENT PERFECT
        conj = verb.subjunctive.present_perfect[person];

        if (!conj) {
            var stem = verb.subjunctive.present_perfect.stem || verb.subjunctive.present[person].substring(0, verb.subjunctive.present["1s"].length - 1),
                end = infinitive.substring(infinitive.length - 2, infinitive.length),
                index = end[0] == "a" ? 1 : 0;

            verb.subjunctive.present_perfect[person] = haber.subjunctive.present[person] + " " + verb.participle.past;
            verb.subjunctive.past_perfect[person] = haber.subjunctive.past[person] + " " + verb.participle.past;
        } else {
            verb.subjunctive.present_perfect.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }
        if (verb.subjunctive.present_perfect.stem) {
            verb.subjunctive.present_perfect.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }






        /// CONDITIONAL
        if (!verb.conditional) verb.conditional = {};

        conj = verb.conditional[person];

        if (!conj) {
            var stem = verb.conditional.stem || infinitive;
            verb.conditional[person] = stem + endings.conditional[person];
        } else {
            verb.conditional.irregular = true;
            irregular.push(`${verb.infinitive}.conditional.${person}`);
        }
        if (verb.conditional.stem) {
            verb.conditional.irregular = true;
            irregular.push(`${verb.infinitive}.conditional.${person}`);
        }




        /// PERFECT SETUP
        if (!verb.perfect) verb.perfect = {};
        if (!verb.perfect.present) verb.perfect.present = {};
        if (!verb.perfect.future) verb.perfect.future = {};
        if (!verb.perfect.past) verb.perfect.past = {};
        if (!verb.perfect.conditional) verb.perfect.conditional = {};

        /// PERFECT PRESENT
        conj = verb.perfect.present[person];

        if (!conj) {
            verb.perfect.present[person] = haber.present[person] + " " + verb.participle.past;
        } else {
            verb.perfect.present.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.present.${person}`);
        }
        if (verb.perfect.present.stem) {
            verb.perfect.present.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.present.${person}`);
        }

        /// PERFECT FUTURE
        conj = verb.perfect.future[person];

        if (!conj) {
            verb.perfect.future[person] = haber.future[person] + " " + verb.participle.past;
        } else {
            verb.perfect.future.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.future.${person}`);
        }
        if (verb.perfect.future.stem) {
            verb.perfect.future.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.future.${person}`);
        }


        /// PERFECT PAST
        conj = verb.perfect.past[person];

        if (!conj) {
            verb.perfect.past[person] = haber.past.imperfect[person] + " " + verb.participle.past;
        } else {
            verb.perfect.past.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.past.${person}`);
        }
        if (verb.perfect.past.stem) {
            verb.perfect.past.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.past.${person}`);
        }


        /// PERFECT CONDITIONAL
        conj = verb.perfect.conditional[person];

        if (!conj) {
            verb.perfect.conditional[person] = haber.conditional[person] + " " + verb.participle.past;
        } else {
            verb.perfect.conditional.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.conditional.${person}`);
        }
        if (verb.perfect.conditional.stem) {
            verb.perfect.conditional.irregular = true;
            irregular.push(`${verb.infinitive}.perfect.conditional.${person}`);
        }









        /// IMPERATIVE
        if (!verb.imperative) verb.imperative = {};

        conj = verb.imperative[person];

        if (!conj) {
            if (person == "2s") {
                verb.imperative[person] = verb.present[person].substring(0, verb.present[person].length - 1);
            } else if (person == "3s") {
                verb.imperative[person] = verb.subjunctive.present[person];
            } else if (person == "1p") {
                verb.imperative[person] = verb.subjunctive.present[person];
            } else if (person == "2p") {
                verb.imperative[person] = infinitive.substring(0, infinitive.length - 1) + "d";
            } else if (person == "3p") {
                verb.imperative[person] = verb.subjunctive.present[person];
            }
        } else {
            verb.imperative.irregular = true;
            irregular.push(`${verb.infinitive}.imperative.${person}`);
        }
        if (verb.imperative.stem) {
            verb.imperative.irregular = true;
            irregular.push(`${verb.infinitive}.imperative.${person}`);
        }
    }

    for (let person of persons) {
        /// SUBJUNCTIVE PAST/PAST PERFECT
        conj = verb.subjunctive.past[person];

        if (!conj) {

            var defaultStem = verb.past.preterite["3p"].substring(0, verb.past.preterite["3p"].length - 3); // minus -ron
            var stem = verb.subjunctive.past.stem || defaultStem,
                end = infinitive.substring(infinitive.length - 2, infinitive.length);

            verb.subjunctive.past[person] = stem + endings.subjunctive.past[person];

            if (person == "1p") {
                verb.subjunctive.past[person] = accentIndex(verb.subjunctive.past[person], verb.subjunctive.past[person].length - 6);
            }
        } else {
            verb.subjunctive.past.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }
        if (verb.subjunctive.past.stem) {
            verb.subjunctive.past.irregular = true;
            irregular.push(`${verb.infinitive}.subjunctive.${person}`);
        }
    }





    delete verb?.present?.stem;
    delete verb?.future?.stem;
    delete verb?.past?.preterite?.stem;
    delete verb?.past?.imperfect?.stem;
    delete verb?.conditional?.stem;
    delete verb?.perfect.present?.stem;
    delete verb?.perfect?.future?.stem;
    delete verb?.perfect?.past?.stem;
    delete verb?.perfect?.conditional?.stem;
    delete verb?.subjunctive?.present?.stem;
    delete verb?.subjunctive?.past?.stem;
    delete verb?.subjunctive?.present_perfect?.stem;
    delete verb?.subjunctive?.past_perfect?.stem;
    delete verb?.imperative?.stem;

    return verb;
}

function fillInData(data) {
    data = data.verbs;

    const haber = conjugateVerb({
        "infinitive": "haber",
        "english": "have (done)",
        "present": {
            "1s": "he",
            "2s": "has",
            "3s": "ha",
            "1p": "hemos",
            "2p": "habéis",
            "3p": "han"
        },
        "future": {
            "stem": "habr"
        },
        "conditional": {
            "stem": "habr"
        },
        "past": {
            "preterite": {
                "stem": "hub",
                "1s": "hube",
                "3s": "hubo"
            },
            "imperfect": {
                "stem": "hab"
            }
        },
        "imperative": {
            "2s": "hé"
        },
        "subjunctive": {
            "present": {
                "stem": "hay"
            },
            "present_perfect": {
                "stem": "hab"
            }
        }
    });

    data.push(haber);

    for (let verb of data) {
        verb = conjugateVerb(verb);
    }

    return data;
}

function verbChart(rowLabels, rowValues) {

    rowLabels = [""].concat(rowLabels);
    rowValues = [persons].concat(rowValues);

    var table = document.createElement('table');

    var header = document.createElement('thead');

    for (let i of [""].concat(persons)) {
        var th = document.createElement("th");
        th.textContent = personsInSpanish[i];
        header.appendChild(th);
    }

    table.appendChild(header);


    for (let tense of rowValues) {
        const tr = document.createElement("tr");
        for (let p of [""].concat(persons)) {
            const td = document.createElement("td");
            if (p == "") {
                td.innerHTML = `<b>${rowLabels[rowValues.indexOf(tense)]}</b>`;
            } else {
                td.textContent = tense[p];
            }
            tr.appendChild(td);
        }

        for (let i in tr.querySelectorAll("td")) { // If row not empty, add it
            if (tr.querySelectorAll("td")[i].textContent) { table.appendChild(tr); break; };
        }

        // table.appendChild(tr);

    }

    return table;
}

function participleTable(verb) {
    var table = document.createElement("table");

    var tr = document.createElement("tr");
    var [label, past, present] = [document.createElement("td"), document.createElement("td"), document.createElement("td")];
    label.innerHTML = "<b></b>";
    past.innerHTML = "<b>Past</b>";
    present.innerHTML = "<b>Present</b>";
    tr.append(label, past, present);
    table.appendChild(tr);


    var tr = document.createElement("tr");
    var [label, past, present] = [document.createElement("td"), document.createElement("td"), document.createElement("td")];
    label.innerHTML = "<b>Participle</b>";
    past.textContent = verb.participle.past;
    present.textContent = verb.participle.present;
    tr.append(label, past, present);
    table.appendChild(tr);

    table.style.position = "absolute";

    return table;
}

function verbDropdowns() {
    for (let verb of verbs.verbs) {

        var negativeImperative = Object.assign({}, verb.subjunctive.present);
        negativeImperative["1s"] = "";

        const indicativeLabels = ["Indicative", "Present", "Future", "Past Preterite", "Past Imperfect", "Conditional", "Present Perfect", "Future Perfect", "Past Perfect", "Conditional Perfect"];
        const indicativeValues = [{}, verb.present, verb.future, verb.past.preterite, verb.past.imperfect, verb.conditional, verb.perfect.present, verb.perfect.future, verb.perfect.past, verb.perfect.conditional];

        const subjunctiveLabels = ["Subjunctive", "Present Subjunctive", "Past Subjunctive", "Present Perfect Subjunctive", "Past Perfect Subjunctive"];
        const subjunctiveValues = [{}, verb.subjunctive.present, verb.subjunctive.past, verb.subjunctive.present_perfect, verb.subjunctive.past_perfect];

        const imperativeLabels = ["Imperative", "Positive Imperative", "Negative Imperative"];
        const imperativeValues = [{}, verb.imperative, negativeImperative];


        const main = createDropdown(container, verb.infinitive, text("h3", "To " + capitalize(verb.english)));

        var conjugationTable = verbChart(indicativeLabels.concat(subjunctiveLabels).concat(imperativeLabels), indicativeValues.concat(subjunctiveValues).concat(imperativeValues));
        createDropdown(main.querySelector(".content"), "Conjugations", [
            participleTable(verb), conjugationTable
        ], 0.75);

        main.querySelector(".content").querySelectorAll("table")[0].style.transform = "translate(" + (main.querySelector(".content").querySelectorAll("table")[1].clientWidth - main.querySelector(".content").querySelectorAll("table")[0].clientWidth) + "px, -128px)";

    }
}

function text(tag, text) {
    var el = document.createElement(tag);
    el.textContent = text;
    return el;
}

function capitalize(text) {
    return text[0].toUpperCase() + text.substring(1, text.length);
}

function arrayRandom(arr) {
    if (!arr) return;
    if (!arr.length) return;
    return arr[Math.floor(Math.random() * arr.length)];
}

function removeAccents(string) {
    return (string
        .replaceAll("á", "a")
        .replaceAll("é", "e")
        .replaceAll("í", "i")
        .replaceAll("ó", "o")
        .replaceAll("ú", "u")
        .replaceAll("ý", "y"));
}

function accentIndex(string, index) {
    const toAccent = {
        "a": "á",
        "e": "é",
        "i": "í",
        "o": "ó",
        "u": "ú",
        "y": "ý"
    }
    string = string.split("");

    string[index] = toAccent[string[index]];

    return string.join("");
}