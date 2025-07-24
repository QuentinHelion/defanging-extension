chrome.commands.onCommand.addListener((command) => {
  if (command === "defang-selection") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]?.id) {
        console.log("Defanging triggered by shortcut");
        chrome.tabs.sendMessage(tabs[0].id, {action: "defang-selection"});
      }
    });
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.id) {
    console.log("Defanging triggered by button");
    chrome.tabs.sendMessage(tab.id, {action: "defang-selection"});
  }
}); 