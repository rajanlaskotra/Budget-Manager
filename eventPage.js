var contextMenuItem = {
    "id": "spendMoney",
    "title": "SpendMoney",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);
// function to check if the value is Integer or not.
function isInt(value){
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    if (clickData.menuItemId == "spendMoney" && clickData.selectionText){
        
        if(isInt(clickData.selectionText.replace(/,/g,''))){
            chrome.storage.sync.get(['total','limit'], function(budget){
                var newTotal = 0;
                if(budget.total){
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(clickData.selectionText.replace(/,/g,''));
                chrome.storage.sync.set({'total':newTotal}, function(){
                     if( newTotal >= budget.limit){
                         var notifObj = {
                             "type": "basic",
                             "iconUrl": "icon48.png",
                             "title": "Limit Reached !",
                             "message": "Uh Oh! looks like you've reached your limit !"
                         };
                         chrome.notifications.create("LimitNotif",notifObj);
                     }   
                })
            })
        }
    }
})

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});

