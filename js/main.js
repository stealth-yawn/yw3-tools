

const topMenuButton = document.querySelectorAll(".top-menu-button");
const tools = document.querySelectorAll(".tool");



const displaySelectedContent = (selectedString) => {

    if (selectedString.length === 0) return;

    const selectedButton = document.querySelector(`.top-menu-button[data-button-id="${selectedString}"]`);

    const selectedContent = document.querySelector(`#${selectedString}`);

    if (!selectedButton || !selectedContent) return;
    

    for (const b of topMenuButton) b.dataset.selected = "false";
    selectedButton.dataset.selected = "true";
    for (const t of tools) t.dataset.hidden = "true";
    selectedContent.dataset.hidden = "false";
}




for (const button of topMenuButton) {
    button.addEventListener("pointerdown", () => {
        displaySelectedContent(button.dataset.buttonId);
    });
}








const firstSelectedString = "damage";
displaySelectedContent(firstSelectedString);








