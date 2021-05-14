/**
 * くぉ～～んに～ちに～んにっ！
 * ガチ恋ぽん〇こだ～～お♡
 * 
 * みたわね～～～？！
 */
const pattern = /[サシスセソツテラルロザズゼゾ]|[オコソノホモヨロヲョ]ウ|シャ|.[タバト]./;
const dic_path = "./scripts/kuromoji/dict";

var last_result = "";

window.addEventListener("load", init);

function init() {
    document.getElementById("button").addEventListener("click", process);
    document.getElementById("copy-btn").addEventListener("click", copyText);
    document.getElementById("tweet-btn").addEventListener("click", tweet);
}

function tweet() {
    let text = document.getElementById("gachikoi").textContent;
    let sliced = text.slice(0, 120);
    if (text !== sliced) {
        sliced = sliced + "...";
    }
    let url = "https://twitter.com/intent/tweet?text=" + sliced + encodeURI("\nhttps://kawamix.github.io/gachikoilang/") + "&hashtags=ガチ恋語";
    window.open(url);
}

function copyText() {
    let text = document.getElementById('gachikoi').textContent;
    navigator.clipboard.writeText(text).then(e => {
        let alert_success = document.getElementById("alert-success");
        alert_success.textContent = "コピーちまちた💕";
        alert_success.style.zIndex = "100";
        alert_success.style.opacity = "1.0";
        alert_success.classList.add("move");
        setTimeout(fadeOut, 1500, alert_success);
    });
}

function kanaToHira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        let chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

function convertToGachikoi(str) {
    for (let i = 0; i < gachikoi_language_rules.length; ++i) {
        let rule = gachikoi_language_rules[i];
        if (rule.length < 3) {
            str = str.replace(rule[0], rule[1]);
        } else {
            // 簡易的な否定後読み (for Safari(iOS)!!!)
            // 1文字ずつ走査
            let results = "";
            for (let j = 0; j < str.length - 1; ++j) {
                let current = str.charAt(j);
                // 置換対象でない
                if (current !== rule[0]) {
                    results += current;
                    continue;
                }
                let target = current + str.charAt(j + 1);
                // 後読み否定に該当
                if (rule[2].test(target)) {
                    results += current;
                    continue;
                }
                results += current.replace(rule[0], rule[1]);
            }
            results += str.charAt(str.length - 1);
            str = results;
        }
    }
    return str;
}

function postProcess(str) {
    str = str.replace(/。/g, "💕");
    str += "💕";
    return str;
}

function setText(text) {
    let element = document.getElementById("gachikoi");
    element.innerHTML = text;
}

function process() {
    let text = document.getElementById("input").value;
    if (text.length < 1) {
        return;
    }
    document.getElementById("button").setAttribute("disabled", true);
    document.getElementById("copy-btn").setAttribute("disabled", true);
    document.getElementById("tweet-btn").setAttribute("disabled", true);

    let alert_process = document.getElementById("alert-process");
    let alert_success = document.getElementById("alert-success");
    alert_process.style.zIndex = "100";
    alert_process.style.opacity = "1";
    alert_process.classList.add("move");
    setText("変換ちゅう…");

    kuromoji.builder({ dicPath: dic_path }).build(function (err, tokenizer) {
        var tokens = tokenizer.tokenize(text);
        var result = "";
        for (var i = 0; i < tokens.length; ++i) {
            let token = tokens[i];
            let reading = token.reading;
            let surface = token.surface_form;

            if (pattern.test(reading)) {
                result += convertToGachikoi(kanaToHira(reading));
            } else if (pattern.test(surface)) {
                result += convertToGachikoi(kanaToHira(surface));
            } else {
                result += surface;
            }
        }
        result = postProcess(result);
        console.log(result);
        last_result = result;
        setText(result.replace(/\n/g, "<br>"));

        alert_process.style.opacity = "0.0";
        alert_process.classList.remove("move");
        alert_process.style.zIndex = "-1";

        alert_success.textContent = "変換完了～💕";
        alert_success.style.zIndex = "100";
        alert_success.style.opacity = "1.0";
        alert_success.classList.add("move");
        setTimeout(fadeOut, 1500, alert_success);
    });
}

function fadeOut(element) {
    element.style.opacity = "0.0";
    element.classList.remove("move");
    element.style.zIndex = "-1";
    document.getElementById("button").removeAttribute("disabled");
    document.getElementById("copy-btn").removeAttribute("disabled");
    document.getElementById("tweet-btn").removeAttribute("disabled");
}