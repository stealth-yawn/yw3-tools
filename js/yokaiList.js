import { calcAgerankStatusYokaiwatch3 } from "./agerank.js";





export const loadJson = async (jsonFile) => {

    const response = await fetch(jsonFile);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${jsonFile}. HTTP Status: ${response.status}`
        );
    }

    const yokaiList = await response.json();

    return yokaiList;
};





const yokaiListListContainer = document.querySelector("#yokaiList-listContainer");

// 要素を作るヘルパー
// className: クラス名(スペース区切り) / text: テキスト / attrs: 属性 / children: 子要素
const el = (tag, className, { text, attrs, children } = {}) => {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    if (attrs) {
        for (const [name, value] of Object.entries(attrs)) {
            element.setAttribute(name, value);
        }
    }

    if (children) element.append(...children);

    return element;
};

// 「ラベル + 値」のペア(contentWrapper)を作る
const createContent = (labelClass, labelText, labelAttrs, valueClass, valueText) => {
    return el("div", "yokaiList-yokai-contentWrapper flex marginBottom", {
        children: [
            el("p", labelClass, { text: labelText, attrs: labelAttrs }),
            el("p", valueClass, { text: valueText }),
        ],
    });
};

// ステータス用(ちから・ようりょく など)
const createStatus = (displayName, className, value) => {
    return createContent(
        "yokaiList-yokai-contentName", displayName,
        { "data-contentName": displayName },
        className, value
    );
};

// 通常の項目用(スキル・攻撃 など)
const createInfo = (labelText, className, value) => {
    return createContent(
        "yokaiList-yokai-contentName", labelText, null,
        className, value
    );
};

const createYokaiElement = (data) => {
    const status = data.Lv99; // Lv99のステータスのみ使用

    // ---- ヘッダー ----
    const header = el("div", "flex yokaiList-yokai-header", {
        children: [
            el("p", "yokaiList-yokai-no", {
                text: String(data.no).padStart(3, "0"),
            }),
            el("div", "yokaiList-yokai-header-nameAndSoOn flex spaceBetween", {
                children: [
                    el("p", "yokaiList-yokai-妖怪名", { text: data.妖怪名 }),
                    el("div", "flex yokaiList-yokai-header-nameAndSoOn-classAndRank", {
                        children: [
                            el("p", "yokaiList-yokai-種族", {
                                text: data.種族,
                                attrs: { "data-yokaiClass": data.種族 },
                            }),
                            el("p", "yokaiList-yokai-ランク", {
                                text: data.ランク,
                                attrs: { "data-rank": data.ランク },
                            }),
                        ],
                    }),
                ],
            }),
            el("div", "yokaiList-yokai-header-smooth"),
        ],
    });

    // ---- 左側 ----
    const left = el("div", "yokaiList-yokai-left", {
        children: [
            // HP・得意・ニガテ
            el("div", "flex", {
                children: [
                    el("div", "yokaiList-yokai-hpWrapper flex marginBottom", {
                        children: [
                            el("p", "yokaiList-yokai-smallName", { text: "HP" }),
                            el("p", "yokaiList-yokai-status-HP", { text: status.HP }),
                        ],
                    }),
                    el("div", "flex spaceAround fullWidth", {
                        children: [
                            el("div", "yokaiList-yokai-contentWrapper flex marginBottom", {
                                children: [
                                    el("p", "yokaiList-yokai-smallName", { text: "とくい" }),
                                    el("p", "yokaiList-yokai-得意属性", { text: data.得意属性 }),
                                ],
                            }),
                            el("div", "yokaiList-yokai-contentWrapper flex marginBottom", {
                                children: [
                                    el("p", "yokaiList-yokai-smallName", { text: "ニガテ" }),
                                    el("p", "yokaiList-yokai-苦手属性", { text: data.苦手属性 }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),

            // ちから・ようりょく・まもり・すばやさ
            el("div", "", {
                children: [
                    el("div", "flex spaceAround fullWidth", {
                        children: [
                            createStatus("ちから", "yokaiList-yokai-status-力", status.力),
                            createStatus("ようりょく", "yokaiList-yokai-status-妖力", status.妖力),
                        ],
                    }),
                    el("div", "flex spaceAround fullWidth", {
                        children: [
                            createStatus("まもり", "yokaiList-yokai-status-守り", status.守り),
                            createStatus("すばやさ", "yokaiList-yokai-status-素早さ", status.素早さ),
                        ],
                    }),
                ],
            }),

            // スキル
            el("div", "", {
                children: [
                    el("div", "flex spaceAround fullWidth", {
                        children: [
                            createInfo("スキル", "yokaiList-yokai-スキル", data.スキル),
                        ],
                    }),
                ],
            }),
        ],
    });

    // ---- 右側 ----
    const right = el("div", "yokaiList-yokai-right", {
        children: [
            createInfo("攻撃", "yokaiList-yokai-攻撃", data.攻撃),
            createInfo("妖術", "yokaiList-yokai-妖術", data.妖術),
            createInfo("必殺", "yokaiList-yokai-必殺技", data.必殺技),
            createInfo("取憑", "yokaiList-yokai-とりつく", data.とりつく),
        ],
    });

    return el("div", "yokaiList-yokai", {
        children: [
            header,
            el("div", "flex", { children: [left, right] }),
        ],
    });
};



const dataKeys = [
    "no",
    "妖怪名",
    "Lv99",
    "種族",
    "ランク",
    "得意属性",
    "苦手属性",
    "スキル",
    "攻撃",
    "妖術",
    "必殺技",
    "とりつく",
];

const createDataElements = (dataList) => {

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];

        const keys = Object.keys(data);
        
        // let dataCorrect = true;
        // for (const key of dataKeys) {
        //     if (!keys.includes(key)) {
        //         dataCorrect = false;
        //     }
        // }
        // if (!dataCorrect) continue;


        const yokaiElement = createYokaiElement(data);
        yokaiElement.dataset.yokaiDataIndex = i;
        yokaiElement.dataset.yokaiType = data.種類 ?? 0;
        fragment.append(yokaiElement);
    }

    yokaiListListContainer.append(fragment);
};










const yokaiListSettingMenu = document.querySelectorAll(".yokaiList-settingMenu");



const keywordMenu = document.querySelector(".yokaiList-settingMenu[data-setting-type='keyword']");
const orderMenu = document.querySelector(".yokaiList-settingMenu[data-setting-type='order']");
const sRankMenu = document.querySelector(".yokaiList-settingMenu[data-setting-type='sRank']");
const yokaiClassMenu = document.querySelector(".yokaiList-settingMenu[data-setting-type='yokaiClass']");



const keywordSearchKeys = [
    "妖怪名",
    "得意属性",
    "苦手属性",
    "スキル",
    "攻撃",
    "妖術",
    "必殺技",
    "とりつく",
];

const filterDisplayingYokaiList = () => {

    const keyword = keywordMenu.value;
    // const orderValue = orderMenu.value;
    // sRank = sRankMenu.checked;
    const yokaiClass = yokaiClassMenu.value;


    for (const yokaiElement of document.querySelectorAll(".yokaiList-yokai")) {
        const index = Number(yokaiElement.dataset.yokaiDataIndex);
        const currentYokaiType = Number(yokaiElement.dataset.yokaiType);
        
        const yokaiData = allYokaiData[currentYokaiType][index];

        let displayOk = true;

        if (yokaiClass !== "all" && yokaiClass !== yokaiData.種族) {
            displayOk = false;
        }

        if (displayOk) {
            for (const key of keywordSearchKeys) {
                if (
                    yokaiData[key] &&
                    yokaiData[key].includes(keyword)
                ) {
                    displayOk = true;
                    break;
                } else {
                    displayOk = false;
                }
            }
        }

        if (!displayOk) yokaiElement.dataset.hidden = "true";
        else yokaiElement.dataset.hidden = "false";
    }

}



const rankToNum = {
    E: 5,
    D: 4,
    C: 3,
    B: 2,
    A: 1,
    S: 0,
}
const getRankNum = (rank) => rankToNum[rank] ?? -1;

const sortYokaiDataList = (yokaiDataList, orderValue) => {
    
    const sortedYokaiDataList = [...yokaiDataList].sort((a, b) => {
        if (orderValue.includes("status-")) {
            const string = orderValue.replace("status-", "");
            if (string === "total") {
                if (sRank) {
                    const bTotal = b.Lv99S.HP + b.Lv99S.力 + b.Lv99S.妖力 + b.Lv99S.守り + b.Lv99S.素早さ;
                    const aTotal = a.Lv99S.HP + a.Lv99S.力 + a.Lv99S.妖力 + a.Lv99S.守り + a.Lv99S.素早さ;
                    return bTotal - aTotal;
                } else {
                    const bTotal = b.Lv99.HP + b.Lv99.力 + b.Lv99.妖力 + b.Lv99.守り + b.Lv99.素早さ;
                    const aTotal = a.Lv99.HP + a.Lv99.力 + a.Lv99.妖力 + a.Lv99.守り + a.Lv99.素早さ;
                    return bTotal - aTotal;
                }
                
            } else if (string.includes("add-")) {
                const statuses = string.replace("add-", "").split("+");
                const status1 = statuses[0];
                const status2 = statuses[1];
                if (sRank) {
                    return (b.Lv99S[status1] + b.Lv99S[status2]) - (a.Lv99S[status1] + a.Lv99S[status2]);
                } else {
                    return (b.Lv99[status1] + b.Lv99[status2]) - (a.Lv99[status1] + a.Lv99[status2]);
                }
            } else {
                if (sRank) {
                    return b.Lv99S[string] - a.Lv99S[string];
                } else {
                    return b.Lv99[string] - a.Lv99[string];
                }
            }
        } else if (orderValue === "ランク") {
            return getRankNum(a.ランク) - getRankNum(b.ランク);
        } else if (orderValue === "妖怪名") {
            return a.妖怪名.localeCompare(b.妖怪名, "ja");
        }
        return 0;
    });
    
    // ソートされたデータにインデックスを持たせる
    for (let i = 0; i < sortedYokaiDataList.length; i++) {
        const yokaiData = sortedYokaiDataList[i];
        yokaiData.sortedIndex = i;
    }

    return sortedYokaiDataList;
}




let sRank = sRankMenu.checked;

const statusNames = ["HP", "力", "妖力", "守り", "素早さ"];

const renderYokaiList = () => {

    const orderValue = orderMenu.value;
    sRank = sRankMenu.checked;

    const yokaiElements = [
        ...document.querySelectorAll(".yokaiList-yokai")
    ];



    // ソート処理
    const sortedYokaiDataList = sortYokaiDataList(
        allYokaiData[0],
        orderValue
    );

    yokaiElements.sort((a, b) => {
        const aIndex = allYokaiData[
            a.dataset.yokaiType
        ][
            a.dataset.yokaiDataIndex
        ].sortedIndex;

        const bIndex = allYokaiData[
            b.dataset.yokaiType
        ][
            b.dataset.yokaiDataIndex
        ].sortedIndex;

        return aIndex - bIndex;
    });

    
    for (const yokaiElement of yokaiElements) {
        yokaiListListContainer.append(yokaiElement);
        
        // アゲランク後ステータスに切り替える処理
        const statusDict = allYokaiData[yokaiElement.dataset.yokaiType][yokaiElement.dataset.yokaiDataIndex][sRank ? "Lv99S" : "Lv99"];

        for (const statusName of statusNames) {
            yokaiElement.querySelector(`.yokaiList-yokai-status-${statusName}`).textContent = statusDict[statusName];
        }
    }
}







const allYokaiData = [];

const init = async () => {

    const yokaiDataList = await loadJson("./json/data.json");
    allYokaiData.push(yokaiDataList);
    // アゲランク後のステータス情報を追加
    for (const dataList of allYokaiData) {
        for (const data of dataList) {
            const dataLv99 = data.Lv99;
            data.Lv99S = {
                "HP": calcAgerankStatusYokaiwatch3(dataLv99.HP, getRankNum(data.ランク)),
                "力": calcAgerankStatusYokaiwatch3(dataLv99.力, getRankNum(data.ランク)),
                "妖力": calcAgerankStatusYokaiwatch3(dataLv99.妖力, getRankNum(data.ランク)),
                "守り": calcAgerankStatusYokaiwatch3(dataLv99.守り, getRankNum(data.ランク)),
                "素早さ": calcAgerankStatusYokaiwatch3(dataLv99.素早さ, getRankNum(data.ランク))
            };
        }
    }


    createDataElements(yokaiDataList);

    
    filterDisplayingYokaiList();
    renderYokaiList();
    for (const menu of yokaiListSettingMenu) {
        menu.addEventListener("change", () => {
            filterDisplayingYokaiList();
            renderYokaiList();
        });
    }

}


init();






// JSONファイルのソース
// https://spwiki.net/youkaiwatch3/



