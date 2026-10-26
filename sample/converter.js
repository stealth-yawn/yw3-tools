const jsonFile = "./json/yokai.json";




const loadJson = async () => {

    const response = await fetch(jsonFile);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${jsonFile}. HTTP Status: ${response.status}`
        );
    }

    const yokaiList = await response.json();

    return yokaiList;
};
















const yokaiClasses = [
    "イサマシ",
    "ウスラカゲ",
    "エンマ",
    "ゴーケツ",
    "ニョロロン",
    "ハグレ",
    "ブキミー",
    "フシギ",
    "プリチー",
    "ポカポカ",
    "怪魔",
];


function parseHtml(htmlString) {
    const parser = new DOMParser();

    return parser.parseFromString(htmlString, "text/html");
}

function toFullWidth(str) {
  // 半角英数字を全角に変換
  str = str.replace(/[A-Za-z0-9]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
  return str;
}


async function convertTxtFiles(yokaiList) {

    for (const yokaiClass of yokaiClasses) {
        const fileName = `./sample/${yokaiClass}.txt`;

        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error(`読み込み失敗: ${fileName}`);
        }

        const htmlString = (await response.text()).replace("\s", "");
        // console.log(text);

        const doc = parseHtml(htmlString);
        
        for (const tr of doc.querySelectorAll("tr")) {
            const tds = tr.querySelectorAll("td");

            const yokaiNo = Number(tds[0].textContent);
            const yokaiName = toFullWidth(tds[1].textContent);

            const yokaiData = yokaiList.find(y => y.no === yokaiNo || y.妖怪名 === yokaiName);
            yokaiData.no = yokaiNo;
            yokaiData.妖怪名 = yokaiName;
            yokaiData.種族 = yokaiClass;
            yokaiData.ランク = tds[2].textContent;
            yokaiData.得意属性 = tds[3].textContent;
            yokaiData.苦手属性 = tds[4].textContent;
            
            const text = tds[5].innerHTML
                .replace(/<br\s*\/?>/gi, "\n");

            const skillList = text
                .split("\n")
                .map(text => text.trim())
                .filter(text => text !== "")
                .map(text => text.replace(/^.*?：/, ""));
                
            yokaiData.スキル = skillList[0];
            yokaiData.攻撃 = skillList[1];
            yokaiData.妖術 = skillList[2];
            yokaiData.必殺技 = skillList[3];
            yokaiData.とりつく = skillList[4];
        }
    }

}



const main = async () => {
    const yokaiList = await loadJson();
    console.log(yokaiList);

    await convertTxtFiles(yokaiList);


    


    const jsonString = JSON.stringify(yokaiList, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "yokai.json";
    a.click();
    URL.revokeObjectURL(url);
}


main();


