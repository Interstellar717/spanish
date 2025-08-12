var verbs;
const irregular = [];

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

    ////////// ER/IR, AR
    present: {
        "1s": ["o", "o"],
        "2s": ["es", "as"],
        "3s": ["e", "a"],
        "1p": ["emos", "amos"],
        "2p": ["éis", "áis"],
        "3p": ["en", "an"]
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
            "3p": ["ian", "aban"]
        }
    },
    subjunctive: {
        "1s": ["a", "e"],
        "2s": ["as", "es"],
        "3s": ["a", "e"],
        "1p": ["amos", "emos"],
        "2p": ["áis", "éis"],
        "3p": ["an", "en"],
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

function fillInData(data) {
    data = data.verbs;

    for (let verb of data) {

        let infinitive = verb.infinitive;


        for (let person of persons) {

            var conj;

            /// PRESENT
            if (!verb.present) verb.present = {};

            conj = verb.present[person];

            if (!conj) {

                var base = verb.present.base || infinitive.substring(0, infinitive.length - 2);
                var end = infinitive.substring(infinitive.length - 2, infinitive.length);

                var index = end[0] == "a" ? 1 : 0;

                base += endings.present[person][index];

                verb.present[person] = base;
            } else {
                verb.present.irregular = true;
                irregular.push(`${verb.infinitive}.present.${person}`);
            }
            if (verb.present.base) {
                verb.present.irregular = true;
                irregular.push(`${verb.infinitive}.present.${person}`);
            }



            /// FUTURE
            if (!verb.future) verb.future = {};

            conj = verb.future[person];

            if (!conj) {
                var base = verb.future.base || infinitive;
                verb.future[person] = base + endings.future[person];
            } else {
                verb.future.irregular = true;
                irregular.push(`${verb.infinitive}.future.${person}`);
            }
            if (verb.future.base) {
                verb.future.irregular = true;
                irregular.push(`${verb.infinitive}.future.${person}`);
            }


            /// PAST PRETERITE
            if (!verb.past) verb.past = {};
            if (!verb.past.preterite) verb.past.preterite = {};

            conj = verb.past.preterite[person];

            if (!conj) {
                var base = verb.past.preterite.base || infinitive.substring(0, infinitive.length - 2);
                var end = infinitive.substring(infinitive.length - 2, infinitive.length);

                var index = end[0] == "a" ? 1 : 0;

                base += endings.past.preterite[person][index];

                verb.past.preterite[person] = base;
            } else {
                verb.past.preterite.irregular = true;
                irregular.push(`${verb.infinitive}.past.preterite.${person}`);
            }
            if (verb.past.preterite.base) {
                verb.past.preterite.irregular = true;
                irregular.push(`${verb.infinitive}.past.preterite.${person}`);
            }

            /// PAST IMPERFECT
            if (!verb.past) verb.past = {};
            if (!verb.past.imperfect) verb.past.imperfect = {};

            conj = verb.past.imperfect[person];

            if (!conj) {
                var base = verb.past.imperfect.base || infinitive.substring(0, infinitive.length - 2);
                var end = infinitive.substring(infinitive.length - 2, infinitive.length);

                var index = end[0] == "a" ? 1 : 0;

                base += endings.past.imperfect[person][index];

                verb.past.imperfect[person] = base;
            } else {
                verb.past.imperfect.irregular = true;
                irregular.push(`${verb.infinitive}.past.imperfect.${person}`);
            }
            if (verb.past.imperfect.base) {
                verb.past.imperfect.irregular = true;
                irregular.push(`${verb.infinitive}.past.imperfect.${person}`);
            }

            /// SUBJUNCTIVE
            if (!verb.subjunctive) verb.subjunctive = {};

            conj = verb.subjunctive[person];

            if (!conj) {
                var base = verb.subjunctive.base || infinitive.substring(0, infinitive.length - 2),
                    end = infinitive.substring(infinitive.length - 2, infinitive.length),
                    index = end[0] == "a" ? 1 : 0,
                    _1s = verb.present["1s"]; // Works because 1s present is the absolute first one to be processed.

                verb.subjunctive[person] = _1s.substring(0, _1s.length - 1) + endings.subjunctive[person][index];
            } else {
                verb.subjunctive.irregular = true;
                irregular.push(`${verb.infinitive}.subjunctive.${person}`);
            }
            if (verb.subjunctive.base) {
                verb.subjunctive.irregular = true;
                irregular.push(`${verb.infinitive}.subjunctive.${person}`);
            }


            /// IMPERATIVE
            if (!verb.imperative) verb.imperative = {};

            conj = verb.imperative[person];

            if (!conj) {
                if (person == "2s") {
                    verb.imperative[person] = verb.present[person].substring(0, verb.present[person].length - 1);
                } else if (person == "3s") {
                    verb.imperative[person] = verb.subjunctive[person];
                } else if (person == "1p") {
                    verb.imperative[person] = verb.subjunctive[person];
                } else if (person == "2p") {
                    verb.imperative[person] = infinitive.substring(0, infinitive.length - 1) + "d";
                } else if (person == "3p") {
                    verb.imperative[person] = verb.subjunctive[person];
                } else {
                    verb.imperative[person] = "";
                }
            } else {
                verb.imperative.irregular = true;
                irregular.push(`${verb.infinitive}.imperative.${person}`);
            }
            if (verb.imperative.base) {
                verb.imperative.irregular = true;
                irregular.push(`${verb.infinitive}.imperative.${person}`);
            }
        }



        delete verb?.present?.base;
        delete verb?.future?.base;
        delete verb?.past?.base;
    }

    return data;
}

function verbChart(verb) {

    var columnLabels = ["", "Present", "Future", "Past Preterite", "Past Imperfect", "Imperative", "Subjunctive"];
    var columnValues = [persons, verb.present, verb.future, verb.past.preterite, verb.past.imperfect, verb.imperative, verb.subjunctive];

    var table = document.createElement('table');

    var header = document.createElement('thead');

    for (let i of columnLabels) {
        var th = document.createElement("th");
        th.textContent = i;
        header.appendChild(th);
    }

    table.appendChild(header);



    for (let p of persons) {
        const tr = document.createElement("tr");
        for (let tense of columnValues) {
            const td = document.createElement("td");
            if (Array.isArray(tense)) {
                td.textContent = personsInEnglishFancy[tense[persons.indexOf(p)]];
            } else {
                td.textContent = tense[p];
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
}

function verbDropdowns() {
    for (let verb of verbs.verbs) {
        const main = createDropdown(container, verb.infinitive, text("h3", "To " + capitalize(verb.english)));
        createDropdown(main.querySelector(".content"), "Conjugations", verbChart(verb), 0.75);
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