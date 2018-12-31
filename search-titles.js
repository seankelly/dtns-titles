(function() {

    const MINIMUM_QUERY_LENGTH = 2;
    const SHOW_MAP = {
        buzzoutloud: "BOL",
        technewstoday: "TNT",
        dailytechnewsshow: "DTNS",
    };

    var titles = null;

    function loaded_titles() {
        if (this.status !== 200) {
            update_status("Failed to load titles.");
            return;
        }

        titles = this.response;
        update_status("");
    }

    function update_status(message) {
        var status_element = document.getElementById("status");
        status_element.innerText = message;
    }

    function search_titles(ev) {
        var search_input = ev.target;
        var query = search_input.value;
        if (query.length < MINIMUM_QUERY_LENGTH) {
            return;
        }

        var query_option = document.querySelector('input[name="query-type"]:checked');
        if (!query_option) {
            console.log("Couldn't get query type");
            return;
        }
        var query_type = query_option.value;

        var compare_fn = null;
        switch (query_type) {
            case "loose":
                compare_fn = query_type_loose
                break;
            case "exact":
                break;
            case "wildcard":
                break;
            case "wildcard-any":
                break;
            default:
                console.log("Unknown query type.");
                return;
        }

        if (!compare_fn) {
            console.log("Null compare function, aborting search.");
            return;
        }

        clear_results();
        for (var show in titles) {
            for (var i in titles[show]) {
                var episode = titles[show][i];
                if (compare_fn(query, episode.title)) {
                    add_result(show, episode);
                }
            }
        }
    }

    function query_type_loose(query, title) {
        var query_upper = query.toUpperCase();
        var title_upper = title.toUpperCase();
        var result = title_upper.indexOf(query_upper);
        return result >= 0;
    }

    function add_result(show, episode) {
        var results = document.getElementById("results");
        var fragment = document.createDocumentFragment();
        var row = document.createElement("tr");
        fragment.appendChild(row);
        // episode number
        var number = document.createElement("td");
        number.innerText = SHOW_MAP[show] + " " + episode.number;
        // episode title
        var title = document.createElement("td");
        title.innerText = episode.title;
        // episode date
        var date = document.createElement("td");
        date.innerText = episode.date;
        // episode audio link
        var audio = document.createElement("td");
        var link = document.createElement("a");
        link.innerText = "Download";
        link.href = episode.download;
        audio.appendChild(link);

        row.appendChild(number);
        row.appendChild(title);
        row.appendChild(date);
        row.appendChild(audio);
        results.children[1].appendChild(fragment);
    }

    function clear_results() {
        var results = document.getElementById("results");
        var tbody = results.children[1];
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

    function init() {
        var req = new XMLHttpRequest();
        req.addEventListener("load", loaded_titles);
        req.open("GET", "titles.json");
        req.responseType = "json";
        req.send();

        var search_input = document.getElementById("title-query");
        search_input.addEventListener('input', search_titles);
    }

    init();
})()
