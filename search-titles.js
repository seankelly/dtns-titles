(function() {

    const MINIMUM_QUERY_LENGTH = 2;
    const SHOW_MAP = {
        buzzoutloud: "BOL",
        technewstoday: "TNT",
        dailytechnewsshow: "DTNS",
    };

    // The title data, unmanipulated.
    var raw_titles = null;
    // Processed title data to make searching easier.
    var titles = null;

    function loaded_titles() {
        if (this.status !== 200) {
            update_status("Failed to load titles.");
            return;
        }

        raw_titles = this.response;
        titles = process_titles(raw_titles);
        update_status("");
    }

    function process_titles(raw_titles) {
        var titles = new Array();
        var punct_re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        var spaces_re = /\s+/g;
        for (var show in raw_titles) {
            for (var i in raw_titles[show]) {
                var episode = raw_titles[show][i];
                var title = episode.title;
                var title_loose = title.replace(punct_re, '').replace(spaces_re, ' ');
                var episode_data = {
                    loose: title_loose.toUpperCase(),
                    // These keys are so the original entry can be found again.
                    _show: show,
                    _index: i,
                };
                titles.push(episode_data);
            }
        }
        return titles;
    }

    function update_status(message) {
        var status_element = document.getElementById("status");
        status_element.innerText = message;
    }

    function search_titles() {
        var search_input = document.getElementById("title-query");
        var query = search_input.value;
        if (query.length < MINIMUM_QUERY_LENGTH) {
            return;
        }
        var query_upper = query.toUpperCase();

        var query_option = document.querySelector('input[name="query-type"]:checked');
        if (!query_option) {
            console.log("Couldn't get query type");
            return;
        }
        var query_type = query_option.value;

        var compare_fn = null;
        switch (query_type) {
            case "exact":
                break;
            case "loose":
                compare_fn = query_type_loose;
                query = query_upper;
                break;
            case "wildcard":
                compare_fn = query_wildcard;
                // Convert query from a string into a regex with globbing
                // between the words.
                var query_words = query_upper.split(/\s+/);
                var query_words_re = query_words.join('.*?');
                var query_re = new RegExp(query_words_re);
                query = query_re;
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
        for (var episode of titles) {
            if (compare_fn(query, episode)) {
                add_result(episode);
            }
        }
    }

    function query_type_loose(query, episode) {
        var title = episode.loose;
        var result = title.indexOf(query);
        return result >= 0;
    }

    function query_wildcard(query, episode) {
        var title = episode.loose;
        var result = title.search(query);
        return result >= 0;
    }

    function add_result(episode) {
        var episode_data = raw_titles[episode._show][episode._index];
        var results = document.getElementById("results");
        var fragment = document.createDocumentFragment();
        var row = document.createElement("tr");
        fragment.appendChild(row);
        // episode number
        var number = document.createElement("td");
        number.innerText = SHOW_MAP[episode._show] + " " + episode_data.number;
        // episode title
        var title = document.createElement("td");
        title.innerText = episode_data.title;
        // episode date
        var date = document.createElement("td");
        date.innerText = episode_data.date;
        // episode audio link
        var audio = document.createElement("td");
        var link = document.createElement("a");
        link.innerText = "Download";
        link.href = episode_data.download;
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

        var query_options = document.querySelectorAll('input[name=query-type]');
        for (var query_option of query_options) {
            query_option.addEventListener('change', search_titles);
        }
    }

    init();
})()
