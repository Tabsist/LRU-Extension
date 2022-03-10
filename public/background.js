
// Removing the tab/window from the Lru obj
const deleteItem= (tabId,n)=>{
    // n is the index at which tabId/windowId is located in the lru Object's list
    chrome.storage.local.get("lru",(items)=>{
        var allKeys = Object.keys(items.lru)
        for(let k=0;k<allKeys.length;k++){
            if(items.lru[allKeys[k]][n] == tabId){
                delete items.lru[allKeys[k]]
            }   
        }
        chrome.storage.local.set({"lru":items.lru},()=>{
            console.log("Item deleted Successfully")
        })
        
    })
}


chrome.runtime.onMessage.addListener((obj)=>{
    if(obj.type==="FROM_CONTENT_TRUE"){
        console.log("INSIDE BACKGROUND when TRUE")
        // window.onload = ()=>{
        chrome.tabs.query( {
            // gets the window the user can currently see
            active: true, 
            currentWindow: true 
            },function(tabs){
                // if(tabs.length>0){
                    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,                        
                    function(dataurl){
                        console.log("POPup",dataurl)
                        console.log("tabs",tabs)
                        console.log(tabs[0].windowId,tabs[0].id)
                        chrome.windows.onRemoved.addListener((windowId)=>{ 
                            if(windowId === tabs[0].windowId){
                                console.log("windowDeleted",windowId)
                                deleteItem(windowId,5)
                            }
                        })
                        chrome.tabs.onRemoved.addListener(function(tabId){
                            if(tabId === tabs[0].id){
                                console.log("tabDeleted",tabId)
                                deleteItem(tabId,4)
                            }
                        })
                        console.log("tabs",tabs[0])
                        chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_TRUE",dataurl:dataurl,iconurl:tabs[0].favIconUrl,tabId:tabs[0].id,windowId:tabs[0].windowId});
                        chrome.webNavigation.onBeforeNavigate.addListener((details)=>{
                            console.log("Before Navigating",details)
                          })
                    })
            })
    }
    else if(obj.type === "ACTIVATE_TAB" ){
        console.log("BG",obj.tabId,chrome.runtime.id)
        // chrome.tabs.get(obj.tabId, async (tab) => {
        chrome.windows.update(parseInt(obj.windowId),{focused:true},()=>{
            console.log("Window Updated")
            chrome.tabs.update(parseInt(obj.tabId),{ active: true },()=>{
                console.log("Tab Updated")
            });
        })    
        
            // let contentjsFile = chrome.runtime.getManifest().content_scripts[0].js[0];
            // chrome.tabs.executeScript(parseInt(obj.tabId), {
            //     file: contentjsFile
            // })
        
        // })
        
    }
    else{

        console.log("INSIDE BACKGROUND when False")
    }
})

