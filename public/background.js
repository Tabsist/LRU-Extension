
// Removing the tab/window from the Lru obj
const deleteItem= (tabId,n)=>{
    // n is the index at which tabId/windowId is located in the lru Object's list
    chrome.storage.local.get("lru",(items)=>{
        var allKeys = Object.keys(items.lru)
        for(let k=0;k<allKeys.length;k++){
            console.log(items.lru[allKeys[k]])
            if(items.lru[allKeys[k]][n] == tabId){
                delete items.lru[allKeys[k]]
            }   
        }
        chrome.storage.local.set({"lru":items.lru},()=>{
            console.log("Item deleted Successfully")
        })
        
    })
}



// chrome.tabs.onActivated.addListener((activeinfo)=>{
//     chrome.tabs.query( {
//         // gets the window the user can currently see
//         active: true, 
//         currentWindow: true 
//         },function(tabs){
//                 chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,                        
//                 function(dataurl){
//                     console.log("tabs",tabs)
//                     if(tabs.length>0){
//                         console.log(tabs[0].windowId,tabs[0].id)
//                         chrome.windows.onRemoved.addListener((windowId)=>{ 
//                             if(windowId === tabs[0].windowId){
//                                 console.log("windowDeleted",windowId)
//                                 deleteItem(windowId,5)
//                             }
//                         })
//                         chrome.tabs.onRemoved.addListener(function(tabId){
//                             if(tabId === tabs[0].id){
//                                 console.log("tabDeleted",tabId)
//                                 deleteItem(tabId,4)
//                             }
//                         })
//                         console.log("tabs",tabs[0])
//                         chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_TRUE",dataurl:dataurl,iconurl:tabs[0].favIconUrl,tabId:tabs[0].id,windowId:tabs[0].windowId}).then((res)=>{
//                             console.log(res)
//                           }).catch((err)=>console.log(err));
//                     }
//                 })
//         })
// })

chrome.runtime.onMessage.addListener((obj)=>{
    if(obj.type==="FROM_CONTENT_TRUE"){
        console.log("INSIDE BACKGROUND when TRUE")
        // window.onload = ()=>{
        //Deals with when the Extension is first Loaded    
        if(obj.mode === "LOADING_EXTENSION" ) {
                
                chrome.tabs.query( {},function(tabs){
                    console.log("LOADING_EXTENSION",tabs)
                    const tabList = []
                    for(let idx = 0; idx <tabs.length;idx++){
                        tabList.push(tabs[idx].id)
                    }
                    chrome.storage.local.get("lru",(items)=>{
                        var allKeys = Object.keys(items.lru)
                        for(let k=0;k<allKeys.length;k++){
                            console.log(items.lru[allKeys[k]])
                            if(!tabList.includes(items.lru[allKeys[k]][4])){
                                delete items.lru[allKeys[k]]
                            }   
                        }
                        chrome.storage.local.set({"lru":items.lru},()=>{
                            console.log("Item deleted Successfully")
                        })
                        
                    })

                })
            }  
            chrome.tabs.query( {
                // gets the window the user can currently see
                active: true, 
                currentWindow: true 
                },function(tabs){
                        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,                        
                        function(dataurl){
                            console.log("tabs",tabs)
                            if(tabs.length>0){
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
                                chrome.tabs.sendMessage(tabs[0].id,{type:"FROM_BACKGROUND_TRUE",dataurl:dataurl,iconurl:tabs[0].favIconUrl,tabId:tabs[0].id,windowId:tabs[0].windowId}).then((res)=>{
                                    console.log(res)
                                  }).catch((err)=>console.log(err));
                            }
                        })
                })
            // return true
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
            // return true
            
        }
        else{

            console.log("INSIDE BACKGROUND when False")
            // return true
        }
        return new Promise((resolve,reject)=>resolve("success from Background"))
    })

