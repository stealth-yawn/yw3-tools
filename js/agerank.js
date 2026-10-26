/* 
かぜカモLv.85アゲランク前後ステータス

D(デフォルト)
HP:286
ちから:57
ようりょく:185
まもり:105
すばやさ:107

C
HP:303
ちから:60
ようりょく:196
まもり:111
すばやさ:113

B
HP:319
ちから:63
ようりょく:207
まもり:116
すばやさ:120

A
HP:335
ちから:66
ようりょく:217
まもり:122
すばやさ:126

S
HP:351
ちから:69
ようりょく:228
まもり:129
すばやさ:132


*/




/* 
かぜカモLv.アゲランク前後ステータス

D(デフォルト)
HP:
ちから:
ようりょく:
まもり:
すばやさ:

C
HP:
ちから:
ようりょく:
まもり:
すばやさ:

B
HP:
ちから:
ようりょく:
まもり:
すばやさ:

A
HP:
ちから:
ようりょく:
まもり:
すばやさ:

S
HP:
ちから:
ようりょく:
まもり:
すばやさ:


*/








const hex = "3c23d70a";

const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

view.setUint32(0, parseInt(hex, 16), false);

const beforeStatusRate = view.getFloat32(0, false);



export const calcAgerankStatusYokaiwatch3 = (
    beforeStatus,
    numberAgerank
) => {

    const afterStatus = Math.floor((100 + (6 * numberAgerank)) * beforeStatus * beforeStatusRate + 0.5)

    return afterStatus;
}












const displayCalcResult = () => {
    // DOM要素から値を取得する
    const beforeStatus = Number(beforeStatusMenu.value);
    const numberAgerank = Number(numberAgerankMenu.value);


    const afterStatus = calcAgerankStatusYokaiwatch3(
        beforeStatus,
        numberAgerank
    );

    if (isNaN(beforeStatus) || !beforeStatus) {
        beforeStatusElement.textContent = "---";
    } else {
        beforeStatusElement.textContent = beforeStatus;
    }

    if (isNaN(afterStatus) || !afterStatus) {
        afterStatusElement.textContent = "---";
    } else {
        afterStatusElement.textContent = afterStatus;
    }
}
















const agerankSettingMenu = document.querySelectorAll(".agerank-settingMenu");
const beforeStatusElement = document.querySelector("#agerank-beforeStatus");
const afterStatusElement = document.querySelector("#agerank-afterStatus");

// ダメ計設定のDOM要素を取得
const beforeStatusMenu = document.querySelector('.agerank-settingMenu[data-setting-type="beforeStatus"]');
const numberAgerankMenu = document.querySelector('.agerank-settingMenu[data-setting-type="numberAgerank"]');








for (const menu of agerankSettingMenu) {
    menu.addEventListener("change", () => {

        displayCalcResult();
        
    });
}






// アゲランク後ステータスの計算式のソース
// https://togenyanweb.appspot.com/Yokai/





