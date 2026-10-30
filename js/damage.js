








const toritukuWrapper = document.querySelector("#toritukuWrapper");

const addTorituku = () => {
    // 親要素を作成
    const settingContent = document.createElement("div");
    settingContent.className = "tool-body-settingContent";

    // select要素を作成
    const select = document.createElement("select");
    select.name = "とりつく";
    select.className = "damage-settingMenu";
    select.dataset.settingType = "torituku";

    // optionの内容
    const options = [
        { value: "attacker-super", text: "攻撃力 超アップ" },
        { value: "attacker-large", text: "攻撃力 大アップ" },
        { value: "attacker-normal", text: "攻撃力 アップ" },
        { value: "attacker-small", text: "攻撃力 小アップ" },
        { value: "attacker-small-d", text: "攻撃力 小ダウン" },
        { value: "attacker-normal-d", text: "攻撃力 ダウン" },
        { value: "attacker-large-d", text: "攻撃力 大ダウン" },
        { value: "attacker-super-d", text: "攻撃力 超ダウン" },
        { value: "defender-super", text: "まもり 超アップ" },
        { value: "defender-large", text: "まもり 大アップ" },
        { value: "defender-normal", text: "まもり アップ" },
        { value: "defender-small", text: "まもり 小アップ" },
        { value: "defender-small-d", text: "まもり 小ダウン" },
        { value: "defender-normal-d", text: "まもり ダウン" },
        { value: "defender-large-d", text: "まもり 大ダウン" },
        { value: "defender-super-d", text: "まもり 超ダウン" },
    ];

    // option要素を追加
    options.forEach((option, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;

        // 1つ目の要素では「攻撃力 超アップ」を選択
        if (index === 3) {
            optionElement.selected = true;
        }

        select.appendChild(optionElement);
    });

    // 削除ボタンを作成
    const button = document.createElement("button");
    button.className = "removeTorituku";
    button.textContent = "-";

    // 親要素に追加
    settingContent.appendChild(select);
    settingContent.appendChild(button);

    
    // コンテナに追加
    toritukuWrapper.appendChild(settingContent);


    // とりつくの内容再設定用のイベントリスナーを設定
    select.addEventListener("change", () => {
        displayCalcDamageResult();
    });


    // 削除用のイベントリスナーを設定
    button.addEventListener("pointerdown", () => {
        settingContent.remove();
        displayCalcDamageResult();
    });
}



const addToritukuButton = document.querySelector("#addTorituku");





addToritukuButton.addEventListener("pointerdown", () => {
    addTorituku();
    displayCalcDamageResult();
});






// とりつく倍率
// 1.05 小アップ
// 1.2 アップ
// 1.4 大アップ
// 1.6 超アップ
const toritukuDict = {
    "small": 1.05,
    "normal": 1.2,
    "large": 1.4,
    "super": 1.6,

    "small-d": 1/1.05,
    "normal-d": 1/1.2,
    "large-d": 1/1.4,
    "super-d": 1/1.6
}















const calcDamageYokaiwatch3 = (
    isPhysic,
    attackerStatus,
    defenderStatus,
    movePower,
    weakAttribute,
    critical,
    guard,
    jin,
    asobi,
    positionMultiply,
    attackMultiply,
    defenderMultiply,
    manualMultiply,
    manualAdd
) => {

    let damage = 0;

    // 計算式
    
    if (isPhysic) {
        damage = attackerStatus * attackMultiply * jin * 0.3 + movePower * 1.5;
    } else {
        damage = attackerStatus * attackMultiply * jin + movePower * 0.5;
    }
    // 全体補正
    if (isPhysic) {
        damage -= defenderStatus * defenderMultiply * 0.12;
        damage -= 27;
    }
    damage *= critical;
    damage *= guard;
    damage *= 1.1 ** asobi;
    damage *= positionMultiply;
    damage *= weakAttribute;


    damage *= manualMultiply;
    damage += manualAdd;

    // if (damage < 1) damage = 1;
    

    return parseInt(damage);
}







// 最前列だと最後列と比較し攻撃は1.2倍になり、妖術は1/1.2倍になる
const positionMultiplyDict = {
    "front": [1.2, 1/1.2],
    "center": [1.1, 1/1.1],
    "back": [1, 1]
};







const damageSettingMenu = document.querySelectorAll(".damage-settingMenu");
const calcResultElement = document.querySelector("#damage-calcResult");

// ダメ計設定のDOM要素を取得
const attackClassMenu = document.querySelector('.damage-settingMenu[data-setting-type="attackClass"]');
const attackerStatusMenu = document.querySelector('.damage-settingMenu[data-setting-type="attackerStatus"]');
const defenderStatusMenu = document.querySelector('.damage-settingMenu[data-setting-type="defenderStatus"]');
const movePowerMenu = document.querySelector('.damage-settingMenu[data-setting-type="movePower"]');

const weakAttributeMenu = document.querySelector('.damage-settingMenu[data-setting-type="weakAttribute"]');
const criticalMenu = document.querySelector('.damage-settingMenu[data-setting-type="critical"]');
const guardMenu = document.querySelector('.damage-settingMenu[data-setting-type="guard"]');
const jinMenu = document.querySelector('.damage-settingMenu[data-setting-type="jin"]');
const asobiMenu = document.querySelector('.damage-settingMenu[data-setting-type="asobi"]');
const positionMenu = document.querySelector('.damage-settingMenu[data-setting-type="position"]');

const manualMultiplyMenu = document.querySelector('.damage-settingMenu[data-setting-type="manualMultiply"]');
const manualAddMenu = document.querySelector('.damage-settingMenu[data-setting-type="manualAdd"]');







const displayCalcDamageResult = () => {
    // DOM要素から値を取得する
    const isPhysic = attackClassMenu.value === "physic";
    const attackerStatus = Number(attackerStatusMenu.value);
    const defenderStatus = Number(defenderStatusMenu.value);
    const movePower = Number(movePowerMenu.value);

    const weakAttribute = Number(weakAttributeMenu.value);
    const critical = Number(criticalMenu.value);
    const guard = Number(guardMenu.value);
    const jin = Number(jinMenu.value);
    const asobi = Number(asobiMenu.value);
    const position = positionMenu.value;
    const positionMultiply = positionMultiplyDict[position][isPhysic ? 0 : 1];

    const manualMultiply = Number(manualMultiplyMenu.value);
    const manualAdd = Number(manualAddMenu.value);

    // とりつくの全要素を取得
    let attackMultiply = 1;
    let defenderMultiply = 1;
    const toritukuMenus = document.querySelectorAll('[data-setting-type="torituku"]');
    for (const toritukuMenu of toritukuMenus) {
        const target = toritukuMenu.value.match(/([^-]+)-/)?.[1];
        const buffType = toritukuMenu.value.match(/[^-]+-(.+)/)?.[1];

        if (!target || !buffType) continue;

        const multiply = toritukuDict[buffType];

        if (target === "attacker") {
            attackMultiply *= multiply;
        } else {
            defenderMultiply *= multiply;
        }
    }


    const damage = calcDamageYokaiwatch3(
        isPhysic,
        attackerStatus,
        defenderStatus,
        movePower,
        weakAttribute,
        critical,
        guard,
        jin,
        asobi,
        positionMultiply,
        attackMultiply,
        defenderMultiply,
        manualMultiply,
        manualAdd
    );

    if (isNaN(damage) || !damage) {
        calcResultElement.textContent = "---";
    } else {
        calcResultElement.textContent = damage;
    }
}





for (const menu of damageSettingMenu) {
    menu.addEventListener("change", () => {

        displayCalcDamageResult();
        
    });
}






// ダメージ計算式のソース
// https://youtu.be/BW-e_PkYmgc?si=6LN2oGyOcPqlxWW2


