const container = document.querySelector(".dropdown-container");


function createDropdown(parent, titleText, contentHTML, scale = 1) {
    var dropdown = document.createElement("div");
    var title = document.createElement("h2");
    var content = document.createElement("div");

    content.classList.add("content");

    title.textContent = titleText[0].toUpperCase() + titleText.substring(1, titleText.length);

    dropdown.appendChild(title);
    
    if (Array.isArray(contentHTML)) {
        for (let html of contentHTML) {
            content.appendChild(html);
        }
    } else {
        content.appendChild(contentHTML);
    }

    dropdown.appendChild(content);

    dropdown.classList.add("dropdown");

    dropdown.style.setProperty("--scale", scale);

    dropdownListener(dropdown);

    return parent.appendChild(dropdown);
}

function dropdownListener(dropdown) {
    dropdown.querySelector("h2").addEventListener("click", event => {


        var content = dropdown.querySelector(".content");
        var scale = dropdown.style.getPropertyValue("--scale");

        if (content.getAttribute("hide") == "true") {


            content.style.opacity = "0";
            content.style.display = "";
            content.setAttribute("hide", "false");

            dropdown.style.height = (dropdown.clientHeight + content.clientHeight - (15 * scale)) + "px";

            setTimeout(() => {
                content.style.opacity = 1;
                dropdown.style.height = "fit-content";
            }, 250);

        } else {

            dropdown.style.height = (dropdown.clientHeight - (30 * scale)) + "px";
            content.style.opacity = "0";

            setTimeout(() => {
                content.style.display = "none";
                content.setAttribute("hide", "true");
                dropdown.style.height = "";
            }, 250);
        }
    });

    dropdown.querySelector("h2").click();
}